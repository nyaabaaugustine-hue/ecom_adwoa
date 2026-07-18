import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchProductById, updateProduct, deleteProduct } from "@/server/ecommerce";
import { requireRole } from "@/lib/auth-utils";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await fetchProductById(params.id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
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

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  brand: z.string().min(1).optional(),
  price: z.coerce.number().positive().optional(),
  original_price: nullableOptionalPositiveNumber,
  category: z.string().min(1).optional(),
  image: nullableOptionalString,
  badge: nullableOptionalString,
  stock: z.coerce.number().int().min(0).optional(),
  description: z.string().optional(),
  active: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, "manage_products");
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { original_price, ...rest } = updateProductSchema.parse(body);
    const product = await updateProduct(params.id, {
      ...rest,
      price: rest.price ? String(rest.price) : undefined,
      originalPrice: original_price ? String(original_price) : undefined,
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const message = err.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ");
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const auth = requireRole(req, "manage_products");
  if (auth instanceof NextResponse) return auth;

  try {
    await deleteProduct(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
