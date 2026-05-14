/**
 * GET  /api/products  → list all active products
 * POST /api/products  → create a product (admin only)
 */
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT * FROM products WHERE active = TRUE ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const sql = getDb();
    const body = await req.json();
    const { name, brand, price, original_price, category, image, badge, stock, description } = body;

    const rows = await sql`
      INSERT INTO products (name, brand, price, original_price, category, image, badge, stock, description)
      VALUES (
        ${name}, ${brand}, ${price},
        ${original_price ?? null}, ${category},
        ${image ?? null}, ${badge ?? null},
        ${stock ?? 0}, ${description ?? ""}
      )
      RETURNING *
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
