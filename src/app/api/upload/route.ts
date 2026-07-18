import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { requireRole } from "@/lib/auth-utils";

// Vercel (and most serverless hosts) have an EPHEMERAL, READ-ONLY
// filesystem outside /tmp — writing to /public/uploads works in
// `npm run dev` but silently fails (or vanishes on the next cold start)
// in production. Uploads go straight to Cloudinary instead, which is
// durable, CDN-backed, and already used for image delivery elsewhere
// in the app (see components/cloudinary.ts).

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024; // 5MB

export async function POST(request: NextRequest) {
  const auth = requireRole(request, "manage_products");
  if (auth instanceof NextResponse) return auth;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Image upload is not configured. Missing Cloudinary credentials." },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: "Unsupported file type. Use JPG, PNG, WEBP or GIF." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File too large (max 5MB)." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Math.round(Date.now() / 1000);
    const folder = "adwoas-beauty/products";

    // Cloudinary signed upload: sign every param EXCEPT file/api_key/
    // cloud_name/resource_type, sorted alphabetically, as "key=value" pairs
    // joined by "&", with the API secret appended — see Cloudinary docs
    // on generating an upload signature.
    const paramsToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");

    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", new Blob([buffer], { type: file.type }), file.name);
    cloudinaryForm.append("api_key", apiKey);
    cloudinaryForm.append("timestamp", String(timestamp));
    cloudinaryForm.append("folder", folder);
    cloudinaryForm.append("signature", signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: cloudinaryForm }
    );

    if (!uploadRes.ok) {
      const errBody = await uploadRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: errBody?.error?.message ?? "Cloudinary upload failed" },
        { status: 502 }
      );
    }

    const data = await uploadRes.json();
    return NextResponse.json({ url: data.secure_url as string });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
