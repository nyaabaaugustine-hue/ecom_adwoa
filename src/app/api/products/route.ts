import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchActiveProducts, createProduct } from "@/server/ecommerce";
import { requireRole } from "@/lib/auth-utils";

export async function GET() {
  try {
    const rows = await fetchActiveProducts();
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

const nullableOptionalString = z.preprocess(
  (v) => (v === null || v === "" ? undefined : v),
  z.string().optional()
);
const nullableOptionalPositiveNumber = z.preprocess(
  (v) => (v === null || v === "" ? undefined : v),
  z.coerce.number().positive().optional()
);

const createProductSchema = z.object({
  name: z.string().min(1),
  brand: z.string().min(1),
  price: z.coerce.number().positive(),
  original_price: nullableOptionalPositiveNumber,
  category: z.string().min(1),
  image: nullableOptionalString,
  badge: nullableOptionalString,
  stock: z.coerce.number().int().min(0).optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  const auth = requireRole(req, "manage_products");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { original_price, ...rest } = createProductSchema.parse(body);
    const product = await createProduct({
      ...rest,
      price: String(rest.price),
      originalPrice: original_price ? String(original_price) : undefined,
    });
    return NextResponse.json(product, { status: 201 });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
