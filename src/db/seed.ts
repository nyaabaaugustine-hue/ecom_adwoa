import { getDb } from "./index";
import { products, customers, orders, orderItems } from "./schema";
import { sql } from "drizzle-orm";

// NOTE: images use https://picsum.photos/seed/<unique-seed>/800/1000 — a free,
// no-key photo service that deterministically resolves each seed to the same
// distinct photo, so every product gets its own image. Swap for real
// Cloudinary product photos whenever available.

async function seed() {
  const db = getDb();

  console.log("Seeding products...");
  await db.insert(products).values([
    { name: "Ankara Maxi Dress", brand: "Adwoa's Collection", price: "350.00", originalPrice: "450.00", rating: "4.8", reviews: 124, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-01/800/1000", badge: "Sale", stock: 15, description: "Beautiful Ankara maxi dress with modern cut. Perfect for weddings and special occasions." },
    { name: "Kente Wrap Skirt", brand: "Heritage Ghana", price: "280.00", rating: "4.9", reviews: 89, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-02/800/1000", badge: "New", stock: 8, description: "Authentic Kente wrap skirt handwoven by Ghanaian artisans. A timeless piece." },
    { name: "Ankara Peplum Blouse", brand: "Adwoa's Collection", price: "180.00", rating: "4.7", reviews: 156, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-03/800/1000", stock: 20, description: "Stylish peplum blouse in vibrant Ankara print. Pairs perfectly with skirts or trousers." },
    { name: "African Print Jumpsuit", brand: "Modern Afrika", price: "420.00", originalPrice: "520.00", rating: "4.6", reviews: 78, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-04/800/1000", badge: "Sale", stock: 5, description: "Contemporary jumpsuit with traditional African print. Modern elegance meets heritage." },
    { name: "Kente Evening Gown", brand: "Heritage Ghana", price: "850.00", rating: "5.0", reviews: 45, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-05/800/1000", badge: "Premium", stock: 3, description: "Luxurious Kente evening gown for the most special occasions. Handwoven excellence." },
    { name: "Ankara Shift Dress", brand: "Adwoa's Collection", price: "290.00", rating: "4.5", reviews: 203, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-06/800/1000", stock: 12, description: "Comfortable shift dress in beautiful Ankara fabric. Perfect for work or casual outings." },
    { name: "Dashiki Maxi Kaftan", brand: "Modern Afrika", price: "320.00", rating: "4.8", reviews: 167, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-07/800/1000", stock: 18, description: "Elegant dashiki kaftan in rich colors. Comfortable and stylish for any occasion." },
    { name: "Ankara Palazzo Pants", brand: "Adwoa's Collection", price: "220.00", rating: "4.6", reviews: 134, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-08/800/1000", stock: 25, description: "Flowy palazzo pants in stunning Ankara print. Comfort meets style." },
    { name: "Boubou African Dress", brand: "Heritage Ghana", price: "380.00", rating: "4.7", reviews: 92, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-09/800/1000", stock: 7, description: "Traditional Boubou dress with modern touches. Perfect for cultural events." },
    { name: "Ankara Kimono Jacket", brand: "Modern Afrika", price: "195.00", originalPrice: "250.00", rating: "4.9", reviews: 211, category: "Fashion", image: "https://picsum.photos/seed/adwoa-fashion-10/800/1000", badge: "Sale", stock: 14, description: "Versatile kimono jacket that transforms any outfit. A statement piece." },
    { name: "Shea Butter Lip Gloss Set", brand: "Ghana Glow", price: "85.00", rating: "4.8", reviews: 342, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-11/800/1000", badge: "Bestseller", stock: 30, description: "Nourishing lip gloss set infused with Ghanaian shea butter. 6 gorgeous shades." },
    { name: "Natural Foundation - Cocoa", brand: "Ghana Glow", price: "120.00", rating: "4.7", reviews: 289, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-12/800/1000", stock: 22, description: "Full coverage foundation made for African skin tones. 12 shades available." },
    { name: "African Black Soap Mascara", brand: "Natural Beauty GH", price: "65.00", rating: "4.6", reviews: 178, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-13/800/1000", stock: 45, description: "Lengthening mascara with African black soap extracts. Gentle and effective." },
    { name: "Kente Inspired Eyeshadow Palette", brand: "Ghana Glow", price: "150.00", rating: "4.9", reviews: 456, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-14/800/1000", badge: "New", stock: 19, description: "Vibrant eyeshadow palette inspired by Kente colors. 18 stunning shades." },
    { name: "Shea Butter Highlighter", brand: "Natural Beauty GH", price: "95.00", rating: "4.8", reviews: 234, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-15/800/1000", stock: 28, description: "Glowing highlighter with shea butter for smooth application. Golden shimmer." },
    { name: "Cocoa Butter Contour Kit", brand: "Ghana Glow", price: "135.00", rating: "4.7", reviews: 167, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-16/800/1000", stock: 16, description: "Complete contour and bronzing kit. Perfect for sculpting African features." },
    { name: "Natural Brow Gel Duo", brand: "Natural Beauty GH", price: "55.00", rating: "4.5", reviews: 198, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-17/800/1000", stock: 50, description: "Dual-ended brow gel for perfectly defined brows. Long-lasting formula." },
    { name: "Coconut Oil Setting Spray", brand: "Ghana Glow", price: "75.00", rating: "4.6", reviews: 312, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-18/800/1000", stock: 33, description: "Long-lasting setting spray infused with coconut oil. 12-hour hold." },
    { name: "Berry Blush Trio", brand: "Natural Beauty GH", price: "89.00", rating: "4.8", reviews: 145, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-19/800/1000", stock: 24, description: "Three complementary blush shades for every occasion. Buildable color." },
    { name: "African Clay Face Powder", brand: "Ghana Glow", price: "110.00", rating: "4.7", reviews: 267, category: "Cosmetics", image: "https://picsum.photos/seed/adwoa-cosmetics-20/800/1000", stock: 20, description: "Oil-absorbing face powder with African clay. Matte finish all day." },
  ]);

  console.log("Seeding customers...");
  await db.insert(customers).values([
    { name: "Akua Mensah", email: "akua.mensah@gmail.com", phone: "0241234567", address: "12 Cantonments Road, Accra" },
    { name: "Efua Asante", email: "efua.asante@gmail.com", phone: "0557654321", address: "45 Adum Street, Kumasi" },
    { name: "Adwoa Osei", email: "adwoa.osei@yahoo.com", phone: "0201122334", address: "8 Sekondi Road, Takoradi" },
    { name: "Kofi Owusu", email: "kofi.owusu@gmail.com", phone: "0269988776", address: "23 Cape Coast Road, Cape Coast" },
    { name: "Ama Darko", email: "ama.darko@gmail.com", phone: "0244556677", address: "67 Legon Campus, Accra" },
    { name: "Yaa Appiah", email: "yaa.appiah@hotmail.com", phone: "0277889900", address: "15 Koforidua Rd, Eastern Region" },
    { name: "Kwame Boateng", email: "kwame.boateng@gmail.com", phone: "0231234567", address: "Tamale Central, Northern Region" },
    { name: "Akosua Manu", email: "akosua.manu@gmail.com", phone: "0209876543", address: "Ho District, Volta Region" },
    { name: "Abena Kyei", email: "abena.kyei@gmail.com", phone: "0554433221", address: "Sunyani, Bono Region" },
    { name: "Nana Ama Frimpong", email: "namafrimpong@gmail.com", phone: "0243210987", address: "Tema Community 4, Greater Accra" },
  ]);

  console.log("Seeding orders...");
  const akua = await db.select().from(customers).where(sql`email = 'akua.mensah@gmail.com'`).limit(1);
  const efua = await db.select().from(customers).where(sql`email = 'efua.asante@gmail.com'`).limit(1);

  if (akua[0]) {
    await db.insert(orders).values({
      reference: "ADWOA-1735000001-AA1111",
      customerId: akua[0].id,
      customerName: "Akua Mensah",
      customerEmail: "akua.mensah@gmail.com",
      customerPhone: "0241234567",
      items: JSON.stringify([{ id: 21, name: "Raw Shea Butter - 500g", price: 95, quantity: 2 }, { id: 22, name: "African Black Soap Bar", price: 45, quantity: 1 }]),
      subtotal: "235.00",
      total: "235.00",
      status: "delivered",
      paymentStatus: "paid",
      paystackRef: "ADWOA-1735000001-AA1111-PS",
    });
  }

  if (efua[0]) {
    await db.insert(orders).values({
      reference: "ADWOA-1735000002-BB2222",
      customerId: efua[0].id,
      customerName: "Efua Asante",
      customerEmail: "efua.asante@gmail.com",
      customerPhone: "0557654321",
      items: JSON.stringify([{ id: 14, name: "Kente Inspired Eyeshadow Palette", price: 150, quantity: 1 }, { id: 31, name: "Shea Butter Hair Cream", price: 95, quantity: 1 }]),
      subtotal: "245.00",
      total: "245.00",
      status: "pending",
      paymentStatus: "unpaid",
    });
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
