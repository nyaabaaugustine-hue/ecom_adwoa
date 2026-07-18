/**
 * One-time fix: assigns every existing product row a distinct image URL.
 * Run once with: npm run fix-images
 *
 * Why this is needed: the original seed data used placeholder Cloudinary
 * public_ids (e.g. "uyy_ixp2x1") that were never actually uploaded, so
 * getSafeImageUrl() in src/components/cloudinary.ts silently fell back to
 * one single stock photo for all of them — that's why every product looked
 * identical on both the storefront and the dashboard.
 *
 * This script gives each product row its own deterministic photo via
 * https://picsum.photos/seed/<id>/800/1000 (no API key needed, always
 * resolves the same seed to the same photo). Swap in real Cloudinary
 * product photos later by editing the `image` column per product.
 */
import { getDb } from "./index";
import { products } from "./schema";
import { eq } from "drizzle-orm";

async function fixImages() {
  const db = getDb();

  const rows = await db.select().from(products);
  console.log(`Found ${rows.length} product(s). Assigning distinct images...`);

  for (const row of rows) {
    const image = `https://picsum.photos/seed/adwoa-product-${row.id}/800/1000`;
    await db.update(products).set({ image }).where(eq(products.id, row.id));
    console.log(`  #${row.id} ${row.name} -> ${image}`);
  }

  console.log("Done. Every product now has a distinct image.");
  process.exit(0);
}

fixImages().catch((err) => {
  console.error("fix-images failed:", err);
  process.exit(1);
});
