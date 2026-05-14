-- ================================================================
-- ADWOA'S BEAUTY — Complete Neon PostgreSQL Seed File
-- Built by TGNE Solutions | Run once after creating the database
-- Usage A:  psql "<your_DATABASE_URL>" -f seed.sql
-- Usage B:  Paste into Neon SQL Editor → console.neon.tech
-- ================================================================

-- ── 1. CREATE TABLES (idempotent — safe to re-run) ──────────────

CREATE TABLE IF NOT EXISTS products (
  id             SERIAL PRIMARY KEY,
  name           TEXT NOT NULL,
  brand          TEXT NOT NULL,
  price          NUMERIC(10,2) NOT NULL,
  original_price NUMERIC(10,2),
  rating         NUMERIC(3,2) DEFAULT 0,
  reviews        INTEGER DEFAULT 0,
  category       TEXT NOT NULL,
  image          TEXT,
  badge          TEXT,
  stock          INTEGER DEFAULT 0,
  description    TEXT,
  active         BOOLEAN DEFAULT TRUE,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customers (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT UNIQUE NOT NULL,
  phone      TEXT,
  address    TEXT,
  role       TEXT DEFAULT 'customer',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Migration guard: add address if upgrading an existing DB
ALTER TABLE customers ADD COLUMN IF NOT EXISTS address TEXT;

CREATE TABLE IF NOT EXISTS orders (
  id              SERIAL PRIMARY KEY,
  reference       TEXT UNIQUE NOT NULL,
  customer_id     INTEGER REFERENCES customers(id),
  customer_name   TEXT,
  customer_email  TEXT,
  customer_phone  TEXT,
  items           JSONB NOT NULL,
  subtotal        NUMERIC(10,2) NOT NULL,
  total           NUMERIC(10,2) NOT NULL,
  status          TEXT DEFAULT 'pending',
  payment_status  TEXT DEFAULT 'unpaid',
  paystack_ref    TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  name       TEXT NOT NULL,
  price      NUMERIC(10,2) NOT NULL,
  quantity   INTEGER NOT NULL
);

-- ── 2. PRODUCTS — 50 items across Fashion, Cosmetics, Skincare, Hair Care, Accessories ──

INSERT INTO products (id, name, brand, price, original_price, rating, reviews, category, image, badge, stock, description, active) VALUES
  -- FASHION (10)
  (1,  'Ankara Maxi Dress',           'Adwoa''s Collection', 350.00, 450.00, 4.8, 124,  'Fashion',     'yyyr_rrilrc', 'Sale',       15, 'Beautiful Ankara maxi dress with modern cut. Perfect for weddings and special occasions.', TRUE),
  (2,  'Kente Wrap Skirt',            'Heritage Ghana',      280.00, NULL,   4.9,  89,  'Fashion',     'xxx_peeq9k',  'New',         8, 'Authentic Kente wrap skirt handwoven by Ghanaian artisans. A timeless piece.', TRUE),
  (3,  'Ankara Peplum Blouse',        'Adwoa''s Collection', 180.00, NULL,   4.7, 156,  'Fashion',     'jjb_pwzexw',  NULL,         20, 'Stylish peplum blouse in vibrant Ankara print. Pairs perfectly with skirts or trousers.', TRUE),
  (4,  'African Print Jumpsuit',      'Modern Afrika',       420.00, 520.00, 4.6,  78,  'Fashion',     'yyyy_woib3l', 'Sale',        5, 'Contemporary jumpsuit with traditional African print. Modern elegance meets heritage.', TRUE),
  (5,  'Kente Evening Gown',          'Heritage Ghana',      850.00, NULL,   5.0,  45,  'Fashion',     'adaw_tld2fa', 'Premium',     3, 'Luxurious Kente evening gown for the most special occasions. Handwoven excellence.', TRUE),
  (6,  'Ankara Shift Dress',          'Adwoa''s Collection', 290.00, NULL,   4.5, 203,  'Fashion',     'yyyr_rrilrc', NULL,         12, 'Comfortable shift dress in beautiful Ankara fabric. Perfect for work or casual outings.', TRUE),
  (7,  'Dashiki Maxi Kaftan',         'Modern Afrika',       320.00, NULL,   4.8, 167,  'Fashion',     'xxx_peeq9k',  NULL,         18, 'Elegant dashiki kaftan in rich colors. Comfortable and stylish for any occasion.', TRUE),
  (8,  'Ankara Palazzo Pants',        'Adwoa''s Collection', 220.00, NULL,   4.6, 134,  'Fashion',     'jjb_pwzexw',  NULL,         25, 'Flowy palazzo pants in stunning Ankara print. Comfort meets style.', TRUE),
  (9,  'Boubou African Dress',        'Heritage Ghana',      380.00, NULL,   4.7,  92,  'Fashion',     'yyyy_woib3l', NULL,          7, 'Traditional Boubou dress with modern touches. Perfect for cultural events.', TRUE),
  (10, 'Ankara Kimono Jacket',        'Modern Afrika',       195.00, 250.00, 4.9, 211,  'Fashion',     'adaw_tld2fa', 'Sale',       14, 'Versatile kimono jacket that transforms any outfit. A statement piece.', TRUE),

  -- COSMETICS (10)
  (11, 'Shea Butter Lip Gloss Set',   'Ghana Glow',          85.00,  NULL,   4.8, 342,  'Cosmetics',   'uyy_ixp2x1',  'Bestseller', 30, 'Nourishing lip gloss set infused with Ghanaian shea butter. 6 gorgeous shades.', TRUE),
  (12, 'Natural Foundation - Cocoa',  'Ghana Glow',          120.00, NULL,   4.7, 289,  'Cosmetics',   'uyy_ixp2x1',  NULL,         22, 'Full coverage foundation made for African skin tones. 12 shades available.', TRUE),
  (13, 'African Black Soap Mascara',  'Natural Beauty GH',    65.00, NULL,   4.6, 178,  'Cosmetics',   'uyy_ixp2x1',  NULL,         45, 'Lengthening mascara with African black soap extracts. Gentle and effective.', TRUE),
  (14, 'Kente Inspired Eyeshadow Palette','Ghana Glow',      150.00, NULL,   4.9, 456,  'Cosmetics',   'uyy_ixp2x1',  'New',        19, 'Vibrant eyeshadow palette inspired by Kente colors. 18 stunning shades.', TRUE),
  (15, 'Shea Butter Highlighter',     'Natural Beauty GH',    95.00, NULL,   4.8, 234,  'Cosmetics',   'uyy_ixp2x1',  NULL,         28, 'Glowing highlighter with shea butter for smooth application. Golden shimmer.', TRUE),
  (16, 'Cocoa Butter Contour Kit',    'Ghana Glow',          135.00, NULL,   4.7, 167,  'Cosmetics',   'uyy_ixp2x1',  NULL,         16, 'Complete contour and bronzing kit. Perfect for sculpting African features.', TRUE),
  (17, 'Natural Brow Gel Duo',        'Natural Beauty GH',    55.00, NULL,   4.5, 198,  'Cosmetics',   'uyy_ixp2x1',  NULL,         50, 'Dual-ended brow gel for perfectly defined brows. Long-lasting formula.', TRUE),
  (18, 'Coconut Oil Setting Spray',   'Ghana Glow',           75.00, NULL,   4.6, 312,  'Cosmetics',   'uyy_ixp2x1',  NULL,         33, 'Long-lasting setting spray infused with coconut oil. 12-hour hold.', TRUE),
  (19, 'Berry Blush Trio',            'Natural Beauty GH',    89.00, NULL,   4.8, 145,  'Cosmetics',   'uyy_ixp2x1',  NULL,         24, 'Three complementary blush shades for every occasion. Buildable color.', TRUE),
  (20, 'African Clay Face Powder',    'Ghana Glow',          110.00, NULL,   4.7, 267,  'Cosmetics',   'uyy_ixp2x1',  NULL,         20, 'Oil-absorbing face powder with African clay. Matte finish all day.', TRUE),

  -- SKINCARE (10)
  (21, 'Raw Shea Butter - 500g',      'Naturals Ghana',       95.00, NULL,   5.0, 892,  'Skincare',    'lk_oyxxa6',   'Bestseller', 50, 'Pure unrefined shea butter from Northern Ghana. Multi-purpose skin nourishment.', TRUE),
  (22, 'African Black Soap Bar',      'Naturals Ghana',       45.00, NULL,   4.9,1245,  'Skincare',    'lk_oyxxa6',   'Bestseller', 80, 'Traditional African black soap handcrafted in Ghana. For all skin types.', TRUE),
  (23, 'Cocoa Butter Body Cream',     'Naturals Ghana',      120.00, NULL,   4.8, 567,  'Skincare',    'lk_oyxxa6',   NULL,         35, 'Rich cocoa butter cream for deep moisturizing. Leaves skin glowing.', TRUE),
  (24, 'Baobab Oil Serum',            'Ghana Organics',      145.00, NULL,   4.7, 234,  'Skincare',    'lk_oyxxa6',   NULL,         28, 'Pure baobab oil for face and body. Rich in vitamins and antioxidants.', TRUE),
  (25, 'Moringa Face Mask',           'Naturals Ghana',       75.00, NULL,   4.6, 189,  'Skincare',    'lk_oyxxa6',   NULL,         42, 'Detoxifying face mask with moringa extracts. Clears and brightens skin.', TRUE),
  (26, 'Coconut Oil Hair & Body Oil', 'Ghana Organics',       85.00, NULL,   4.8, 456,  'Skincare',    'lk_oyxxa6',   NULL,         60, 'Versatile coconut oil for hair and body. Pure and organic.', TRUE),
  (27, 'Shea Butter Lip Balm Set',    'Naturals Ghana',       55.00, NULL,   4.9, 678,  'Skincare',    'lk_oyxxa6',   NULL,         55, 'Set of 4 nourishing lip balms with shea butter. Natural flavors.', TRUE),
  (28, 'Aloe Vera Gel - Pure',        'Ghana Organics',       65.00, NULL,   4.7, 345,  'Skincare',    'lk_oyxxa6',   NULL,         48, 'Pure aloe vera gel for soothing and healing. Multipurpose skincare.', TRUE),
  (29, 'Turmeric Brightening Cream',  'Naturals Ghana',      110.00, NULL,   4.6, 234,  'Skincare',    'lk_oyxxa6',   NULL,         30, 'Brightening cream with turmeric and shea butter. Evens skin tone.', TRUE),
  (30, 'Ghanaian Honey Face Wash',    'Ghana Organics',       78.00, NULL,   4.8, 312,  'Skincare',    'lk_oyxxa6',   NULL,         38, 'Gentle face wash with raw Ghanaian honey. Cleanses without stripping.', TRUE),

  -- HAIR CARE (10)
  (31, 'Shea Butter Hair Cream',      'Natural Hair GH',      95.00, NULL,   4.8, 567,  'Hair Care',   'uyy_ixp2x1',  'Bestseller', 40, 'Moisturizing hair cream with raw shea butter. Perfect for natural hair.', TRUE),
  (32, 'Coconut Oil Hair Mask',       'Natural Hair GH',      85.00, NULL,   4.7, 345,  'Hair Care',   'uyy_ixp2x1',  NULL,         25, 'Deep conditioning hair mask with coconut oil. Repairs and strengthens.', TRUE),
  (33, 'African Black Soap Shampoo',  'Ghana Hair Care',      72.00, NULL,   4.6, 289,  'Hair Care',   'uyy_ixp2x1',  NULL,         33, 'Gentle cleansing shampoo with African black soap. Sulfate-free formula.', TRUE),
  (34, 'Baobab Oil Hair Serum',       'Natural Hair GH',     125.00, NULL,   4.9, 423,  'Hair Care',   'uyy_ixp2x1',  NULL,         20, 'Lightweight hair serum with baobab oil. Adds shine without greasiness.', TRUE),
  (35, 'Moringa Hair Growth Oil',     'Ghana Hair Care',     110.00, NULL,   4.8, 512,  'Hair Care',   'uyy_ixp2x1',  'Popular',    18, 'Stimulating hair growth oil with moringa. Promotes healthy scalp.', TRUE),
  (36, 'Shea Butter Edge Control',    'Natural Hair GH',      65.00, NULL,   4.5, 234,  'Hair Care',   'uyy_ixp2x1',  NULL,         45, 'Strong hold edge control with shea butter. Lays edges perfectly.', TRUE),
  (37, 'Hibiscus Leave-In Conditioner','Ghana Hair Care',     89.00, NULL,   4.7, 378,  'Hair Care',   'uyy_ixp2x1',  NULL,         30, 'Moisturizing leave-in with hibiscus extract. Detangles and softens.', TRUE),
  (38, 'Castor Oil Growth Serum',     'Natural Hair GH',      98.00, NULL,   4.8, 456,  'Hair Care',   'uyy_ixp2x1',  NULL,         22, 'Jamaican black castor oil blend for hair growth. Thickens and strengthens.', TRUE),
  (39, 'Braiding Hair Extensions',    'Ghana Hair Care',     180.00, NULL,   4.6, 234,  'Hair Care',   'uyy_ixp2x1',  NULL,         15, 'Premium braiding hair extensions. Natural looking and durable.', TRUE),
  (40, 'Satin Bonnet - African Print','Natural Hair GH',      55.00, NULL,   4.9, 678,  'Hair Care',   'adaw_tld2fa', NULL,         50, 'Beautiful satin bonnet in African print. Protects hair while sleeping.', TRUE),

  -- ACCESSORIES (10)
  (41, 'Gold Beaded Necklace Set',    'Adwoa''s Accessories', 220.00, NULL,  4.8, 189,  'Accessories', 'adaw_tld2fa', 'New',        22, 'Handmade gold beaded necklace and earring set. Traditional Ghanaian design.', TRUE),
  (42, 'Ankara Print Headwrap',       'Heritage Ghana',        65.00, NULL,  4.9, 456,  'Accessories', 'adaw_tld2fa', NULL,         40, 'Beautiful Ankara headwrap in vibrant colors. Multiple styling options.', TRUE),
  (43, 'Wooden Bead Bracelet Set',    'Adwoa''s Accessories',  85.00, NULL,  4.7, 234,  'Accessories', 'adaw_tld2fa', NULL,         35, 'Set of 5 wooden bead bracelets. Handcrafted by Ghanaian artisans.', TRUE),
  (44, 'Kente Clutch Bag',            'Heritage Ghana',       180.00, NULL,  4.8, 167,  'Accessories', 'jjb_pwzexw',  NULL,         12, 'Authentic Kente clutch bag for special occasions. Fully lined interior.', TRUE),
  (45, 'Cowrie Shell Earrings',       'Adwoa''s Accessories',  55.00, NULL,  4.6, 312,  'Accessories', 'adaw_tld2fa', NULL,         48, 'Beautiful cowrie shell earrings. Lightweight and elegant.', TRUE),
  (46, 'Beaded Waist Beads Set',      'Heritage Ghana',        75.00, NULL,  4.9, 567,  'Accessories', 'adaw_tld2fa', 'Popular',    55, 'Traditional waist beads in beautiful colors. Adjustable fit.', TRUE),
  (47, 'Ankara Print Tote Bag',       'Adwoa''s Accessories', 145.00, NULL,  4.7, 234,  'Accessories', 'jjb_pwzexw',  NULL,         18, 'Spacious tote bag in Ankara print. Perfect for everyday use.', TRUE),
  (48, 'Brass Cuff Bangle',           'Heritage Ghana',       120.00, NULL,  4.8, 189,  'Accessories', 'adaw_tld2fa', NULL,         27, 'Handcrafted brass cuff bangle. Traditional Ghanaian design.', TRUE),
  (49, 'African Print Scarf',         'Adwoa''s Accessories',  95.00, NULL,  4.6, 178,  'Accessories', 'adaw_tld2fa', NULL,         32, 'Versatile African print scarf. Can be worn multiple ways.', TRUE),
  (50, 'Statement Gold Earrings',     'Heritage Ghana',       135.00, NULL,  4.9, 345,  'Accessories', 'adaw_tld2fa', NULL,         20, 'Bold statement earrings in gold. Perfect for special occasions.', TRUE)

ON CONFLICT (id) DO UPDATE SET
  name           = EXCLUDED.name,
  brand          = EXCLUDED.brand,
  price          = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  rating         = EXCLUDED.rating,
  reviews        = EXCLUDED.reviews,
  category       = EXCLUDED.category,
  image          = EXCLUDED.image,
  badge          = EXCLUDED.badge,
  stock          = EXCLUDED.stock,
  description    = EXCLUDED.description,
  updated_at     = NOW();

-- Reset auto-increment sequence
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));


-- ── 3. CUSTOMERS — 15 real Ghanaian customers ───────────────────

INSERT INTO customers (name, email, phone, address, role) VALUES
  ('Akua Mensah',       'akua.mensah@gmail.com',     '0241234567', '12 Cantonments Road, Accra',          'customer'),
  ('Efua Asante',       'efua.asante@gmail.com',     '0557654321', '45 Adum Street, Kumasi',              'customer'),
  ('Adwoa Osei',        'adwoa.osei@yahoo.com',      '0201122334', '8 Sekondi Road, Takoradi',            'customer'),
  ('Kofi Owusu',        'kofi.owusu@gmail.com',      '0269988776', '23 Cape Coast Road, Cape Coast',      'customer'),
  ('Ama Darko',         'ama.darko@gmail.com',       '0244556677', '67 Legon Campus, Accra',              'customer'),
  ('Yaa Appiah',        'yaa.appiah@hotmail.com',    '0277889900', '15 Koforidua Rd, Eastern Region',     'customer'),
  ('Kwame Boateng',     'kwame.boateng@gmail.com',   '0231234567', 'Tamale Central, Northern Region',     'customer'),
  ('Akosua Manu',       'akosua.manu@gmail.com',     '0209876543', 'Ho District, Volta Region',           'customer'),
  ('Abena Kyei',        'abena.kyei@gmail.com',      '0554433221', 'Sunyani, Bono Region',                'customer'),
  ('Nana Ama Frimpong', 'namafrimpong@gmail.com',    '0243210987', 'Tema Community 4, Greater Accra',     'customer'),
  ('Serwaah Boateng',   'serwaah.b@gmail.com',       '0266778899', 'Mankessim, Central Region',           'customer'),
  ('Adjoa Tetteh',      'adjoa.tetteh@gmail.com',    '0558899001', 'Dansoman, Accra',                     'customer'),
  ('Esi Mensah',        'esi.mensah@gmail.com',      '0241122334', 'Madina Estate, Accra',                'customer'),
  ('Maame Serwaa',      'maame.serwaa@gmail.com',    '0207654321', 'Bantama, Kumasi',                     'customer'),
  ('Gifty Acheampong',  'gifty.a@gmail.com',         '0273344556', 'Berekum, Bono Region',                'customer')
ON CONFLICT (email) DO UPDATE SET
  name    = EXCLUDED.name,
  phone   = EXCLUDED.phone,
  address = EXCLUDED.address;


-- ── 4. ORDERS — 15 realistic orders with mixed statuses ─────────

-- Order 1: Akua Mensah — delivered
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000001-AA1111', c.id, 'Akua Mensah', 'akua.mensah@gmail.com', '0241234567',
  '[{"id":21,"name":"Raw Shea Butter - 500g","price":95,"quantity":2},{"id":22,"name":"African Black Soap Bar","price":45,"quantity":1}]'::jsonb,
  235.00, 235.00, 'delivered', 'paid', 'ADWOA-1735000001-AA1111-PS',
  NOW() - INTERVAL '28 days', NOW() - INTERVAL '24 days'
FROM customers c WHERE c.email = 'akua.mensah@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 21, 'Raw Shea Butter - 500g', 95.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000001-AA1111';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 22, 'African Black Soap Bar', 45.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000001-AA1111';

-- Order 2: Efua Asante — pending
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000002-BB2222', c.id, 'Efua Asante', 'efua.asante@gmail.com', '0557654321',
  '[{"id":14,"name":"Kente Inspired Eyeshadow Palette","price":150,"quantity":1},{"id":31,"name":"Shea Butter Hair Cream","price":95,"quantity":1}]'::jsonb,
  245.00, 245.00, 'pending', 'unpaid', NULL,
  NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'
FROM customers c WHERE c.email = 'efua.asante@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 14, 'Kente Inspired Eyeshadow Palette', 150.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000002-BB2222';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 31, 'Shea Butter Hair Cream', 95.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000002-BB2222';

-- Order 3: Adwoa Osei — processing
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000003-CC3333', c.id, 'Adwoa Osei', 'adwoa.osei@yahoo.com', '0201122334',
  '[{"id":1,"name":"Ankara Maxi Dress","price":350,"quantity":1}]'::jsonb,
  350.00, 350.00, 'processing', 'paid', 'ADWOA-1735000003-CC3333-PS',
  NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'
FROM customers c WHERE c.email = 'adwoa.osei@yahoo.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 1, 'Ankara Maxi Dress', 350.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000003-CC3333';

-- Order 4: Kofi Owusu — shipped
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000004-DD4444', c.id, 'Kofi Owusu', 'kofi.owusu@gmail.com', '0269988776',
  '[{"id":22,"name":"African Black Soap Bar","price":45,"quantity":2}]'::jsonb,
  90.00, 90.00, 'shipped', 'paid', 'ADWOA-1735000004-DD4444-PS',
  NOW() - INTERVAL '5 days', NOW() - INTERVAL '3 days'
FROM customers c WHERE c.email = 'kofi.owusu@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 22, 'African Black Soap Bar', 45.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000004-DD4444';

-- Order 5: Ama Darko — delivered (big order)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000005-EE5555', c.id, 'Ama Darko', 'ama.darko@gmail.com', '0244556677',
  '[{"id":14,"name":"Kente Inspired Eyeshadow Palette","price":150,"quantity":2},{"id":21,"name":"Raw Shea Butter - 500g","price":95,"quantity":1}]'::jsonb,
  395.00, 395.00, 'delivered', 'paid', 'ADWOA-1735000005-EE5555-PS',
  NOW() - INTERVAL '14 days', NOW() - INTERVAL '10 days'
FROM customers c WHERE c.email = 'ama.darko@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 14, 'Kente Inspired Eyeshadow Palette', 150.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000005-EE5555';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 21, 'Raw Shea Butter - 500g', 95.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000005-EE5555';

-- Order 6: Yaa Appiah — pending
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000006-FF6666', c.id, 'Yaa Appiah', 'yaa.appiah@hotmail.com', '0277889900',
  '[{"id":31,"name":"Shea Butter Hair Cream","price":95,"quantity":2}]'::jsonb,
  190.00, 190.00, 'pending', 'unpaid', NULL,
  NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'
FROM customers c WHERE c.email = 'yaa.appiah@hotmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 31, 'Shea Butter Hair Cream', 95.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000006-FF6666';

-- Order 7: Kwame Boateng — cancelled
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000007-GG7777', c.id, 'Kwame Boateng', 'kwame.boateng@gmail.com', '0231234567',
  '[{"id":1,"name":"Ankara Maxi Dress","price":350,"quantity":1}]'::jsonb,
  350.00, 350.00, 'cancelled', 'failed', NULL,
  NOW() - INTERVAL '10 days', NOW() - INTERVAL '9 days'
FROM customers c WHERE c.email = 'kwame.boateng@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 1, 'Ankara Maxi Dress', 350.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000007-GG7777';

-- Order 8: Akosua Manu — delivered (highest value)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000008-HH8888', c.id, 'Akosua Manu', 'akosua.manu@gmail.com', '0209876543',
  '[{"id":14,"name":"Kente Inspired Eyeshadow Palette","price":150,"quantity":2},{"id":21,"name":"Raw Shea Butter - 500g","price":95,"quantity":2}]'::jsonb,
  490.00, 490.00, 'delivered', 'paid', 'ADWOA-1735000008-HH8888-PS',
  NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days'
FROM customers c WHERE c.email = 'akosua.manu@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 14, 'Kente Inspired Eyeshadow Palette', 150.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000008-HH8888';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 21, 'Raw Shea Butter - 500g', 95.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000008-HH8888';

-- Order 9: Abena Kyei — delivered (premium item)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000009-II9999', c.id, 'Abena Kyei', 'abena.kyei@gmail.com', '0554433221',
  '[{"id":5,"name":"Kente Evening Gown","price":850,"quantity":1}]'::jsonb,
  850.00, 850.00, 'delivered', 'paid', 'ADWOA-1735000009-II9999-PS',
  NOW() - INTERVAL '35 days', NOW() - INTERVAL '30 days'
FROM customers c WHERE c.email = 'abena.kyei@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 5, 'Kente Evening Gown', 850.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000009-II9999';

-- Order 10: Nana Ama Frimpong — processing (multi-item)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000010-JJ0000', c.id, 'Nana Ama Frimpong', 'namafrimpong@gmail.com', '0243210987',
  '[{"id":11,"name":"Shea Butter Lip Gloss Set","price":85,"quantity":1},{"id":15,"name":"Shea Butter Highlighter","price":95,"quantity":1},{"id":17,"name":"Natural Brow Gel Duo","price":55,"quantity":1}]'::jsonb,
  235.00, 235.00, 'processing', 'paid', 'ADWOA-1735000010-JJ0000-PS',
  NOW() - INTERVAL '4 days', NOW() - INTERVAL '3 days'
FROM customers c WHERE c.email = 'namafrimpong@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 11, 'Shea Butter Lip Gloss Set', 85.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000010-JJ0000';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 15, 'Shea Butter Highlighter', 95.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000010-JJ0000';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 17, 'Natural Brow Gel Duo', 55.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000010-JJ0000';

-- Order 11: Serwaah Boateng — shipped (accessories)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000011-KK1122', c.id, 'Serwaah Boateng', 'serwaah.b@gmail.com', '0266778899',
  '[{"id":41,"name":"Gold Beaded Necklace Set","price":220,"quantity":1},{"id":42,"name":"Ankara Print Headwrap","price":65,"quantity":2}]'::jsonb,
  350.00, 350.00, 'shipped', 'paid', 'ADWOA-1735000011-KK1122-PS',
  NOW() - INTERVAL '6 days', NOW() - INTERVAL '4 days'
FROM customers c WHERE c.email = 'serwaah.b@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 41, 'Gold Beaded Necklace Set', 220.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000011-KK1122';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 42, 'Ankara Print Headwrap', 65.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000011-KK1122';

-- Order 12: Adjoa Tetteh — delivered (skincare bundle)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000012-LL2233', c.id, 'Adjoa Tetteh', 'adjoa.tetteh@gmail.com', '0558899001',
  '[{"id":21,"name":"Raw Shea Butter - 500g","price":95,"quantity":3},{"id":23,"name":"Cocoa Butter Body Cream","price":120,"quantity":1}]'::jsonb,
  405.00, 405.00, 'delivered', 'paid', 'ADWOA-1735000012-LL2233-PS',
  NOW() - INTERVAL '18 days', NOW() - INTERVAL '13 days'
FROM customers c WHERE c.email = 'adjoa.tetteh@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 21, 'Raw Shea Butter - 500g', 95.00, 3 FROM orders o WHERE o.reference = 'ADWOA-1735000012-LL2233';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 23, 'Cocoa Butter Body Cream', 120.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000012-LL2233';

-- Order 13: Esi Mensah — delivered (fashion)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000013-MM3344', c.id, 'Esi Mensah', 'esi.mensah@gmail.com', '0241122334',
  '[{"id":2,"name":"Kente Wrap Skirt","price":280,"quantity":1},{"id":3,"name":"Ankara Peplum Blouse","price":180,"quantity":1}]'::jsonb,
  460.00, 460.00, 'delivered', 'paid', 'ADWOA-1735000013-MM3344-PS',
  NOW() - INTERVAL '22 days', NOW() - INTERVAL '17 days'
FROM customers c WHERE c.email = 'esi.mensah@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 2, 'Kente Wrap Skirt', 280.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000013-MM3344';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 3, 'Ankara Peplum Blouse', 180.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000013-MM3344';

-- Order 14: Maame Serwaa — pending (hair care)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000014-NN4455', c.id, 'Maame Serwaa', 'maame.serwaa@gmail.com', '0207654321',
  '[{"id":35,"name":"Moringa Hair Growth Oil","price":110,"quantity":2}]'::jsonb,
  220.00, 220.00, 'pending', 'unpaid', NULL,
  NOW() - INTERVAL '12 hours', NOW() - INTERVAL '12 hours'
FROM customers c WHERE c.email = 'maame.serwaa@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 35, 'Moringa Hair Growth Oil', 110.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000014-NN4455';

-- Order 15: Gifty Acheampong — shipped (accessories)
INSERT INTO orders (reference, customer_id, customer_name, customer_email, customer_phone, items, subtotal, total, status, payment_status, paystack_ref, created_at, updated_at)
SELECT 'ADWOA-1735000015-OO5566', c.id, 'Gifty Acheampong', 'gifty.a@gmail.com', '0273344556',
  '[{"id":46,"name":"Beaded Waist Beads Set","price":75,"quantity":2},{"id":45,"name":"Cowrie Shell Earrings","price":55,"quantity":1}]'::jsonb,
  205.00, 205.00, 'shipped', 'paid', 'ADWOA-1735000015-OO5566-PS',
  NOW() - INTERVAL '7 days', NOW() - INTERVAL '5 days'
FROM customers c WHERE c.email = 'gifty.a@gmail.com'
ON CONFLICT (reference) DO NOTHING;

INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 46, 'Beaded Waist Beads Set', 75.00, 2 FROM orders o WHERE o.reference = 'ADWOA-1735000015-OO5566';
INSERT INTO order_items (order_id, product_id, name, price, quantity)
SELECT o.id, 45, 'Cowrie Shell Earrings', 55.00, 1 FROM orders o WHERE o.reference = 'ADWOA-1735000015-OO5566';


-- ── 5. VERIFICATION — should show 50 / 15 / 15 / 28+ ───────────

SELECT 'products'    AS "table", COUNT(*) AS rows FROM products
UNION ALL
SELECT 'customers'   AS "table", COUNT(*) AS rows FROM customers
UNION ALL
SELECT 'orders'      AS "table", COUNT(*) AS rows FROM orders
UNION ALL
SELECT 'order_items' AS "table", COUNT(*) AS rows FROM order_items;

-- ── Revenue summary ──────────────────────────────────────────────
SELECT
  status,
  COUNT(*)            AS order_count,
  SUM(total)          AS revenue_ghc
FROM orders
GROUP BY status
ORDER BY revenue_ghc DESC;

-- ================================================================
-- ✅ Done! 50 products, 15 customers, 15 orders loaded.
-- Built by TGNE Solutions — www.tgnesolutions.com
-- ================================================================
