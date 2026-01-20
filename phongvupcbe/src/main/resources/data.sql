INSERT INTO users (username, password, email, role, status, created_at)
VALUES
    (N'admin', '$2a$10$0Z.vmU62Xl3cou.pP0rSVO31T1COW1CGuX5mHCgrBK9oXTVm9scMS', 'admin@phongvupc.com', 'ADMIN', 'active', SYSDATETIME()),
    (N'nv_banhang', '$2a$10$0Z.vmU62Xl3cou.pP0rSVO31T1COW1CGuX5mHCgrBK9oXTVm9scMS', 'sales@phongvupc.com', 'SALES', 'active', SYSDATETIME()),
    (N'nv_kho', '$2a$10$0Z.vmU62Xl3cou.pP0rSVO31T1COW1CGuX5mHCgrBK9oXTVm9scMS', 'inventory@phongvupc.com', 'INVENTORY', 'active', SYSDATETIME());

-- 1. INSERT CATEGORIES
INSERT INTO categories (name, slug, description, status,image_url) VALUES
                                                             (N'Linh kien may tinh', 'linh-kien-may-tinh', N'Các loại linh kiện PC chính hãng', 'active', '/uploads/categories/linhkienmaytinh.jfif'),
                                                             (N'Phu kien Gaming', 'phu-kien-gaming', N'Gear và phụ kiện cho game thủ', 'active', '/uploads/categories/phukiengaming.jpg');

-- 2. INSERT ATTRIBUTES
INSERT INTO attributes (name, code) VALUES
                                        (N'Vi xử lý', 'CPU'),
                                        (N'Bộ nhớ trong', 'RAM'),
                                        (N'Card đồ họa', 'VGA'),
                                        (N'Ổ cứng', 'SSD'),
                                        (N'Vỏ máy tính', 'CASE');

-- ========================================================
-- SẢN PHẨM 1: GIGABYTE AORUS MASTER
-- ========================================================

-- 3.1. Insert Product
INSERT INTO products (name, sku, slug, description, brand, status, is_new, is_best_seller, thumbnail_url, created_at)
VALUES (
           N'PC GAMING GIGABYTE AORUS MASTER',
           'PVPC-GIGA-AORUS',
           'pc-gaming-gigabyte-aorus-master',
           N'Cấu hình PC Gaming Cao Cấp (Hi-End) sử dụng full linh kiện Aorus.',
           'GIGABYTE',
           'active',
           1,
           0,
           '/uploads/products/GIGABYTE_AORUS_MASTER.webp',
           SYSDATETIME()
       );

-- 3.2. Link Product -> Category (Dùng Subquery thay vì biến)
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id
FROM products p, categories c
WHERE p.sku = 'PVPC-GIGA-AORUS' AND c.slug = 'linh-kien-may-tinh';

-- 3.3. Insert Variant
INSERT INTO product_variants (product_id, sku, price, quantity, status, created_at)
SELECT id, 'GIGA-V1-I9-4090', 120000000, 2, 'active', SYSDATETIME()
FROM products WHERE sku = 'PVPC-GIGA-AORUS';

-- 3.4. Insert Attributes & Link to Variant
-- CPU
INSERT INTO attribute_values (attribute_id, value)
SELECT id, N'Intel Core i9 14900K' FROM attributes WHERE code = 'CPU';

INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id
FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'GIGA-V1-I9-4090' AND av.value = N'Intel Core i9 14900K' AND av.attribute_id = a.id AND a.code = 'CPU';

-- RAM
INSERT INTO attribute_values (attribute_id, value)
SELECT id, N'64GB DDR5 6000MHz' FROM attributes WHERE code = 'RAM';

INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id
FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'GIGA-V1-I9-4090' AND av.value = N'64GB DDR5 6000MHz' AND av.attribute_id = a.id AND a.code = 'RAM';

-- VGA
INSERT INTO attribute_values (attribute_id, value)
SELECT id, N'NVIDIA RTX 4090 24GB' FROM attributes WHERE code = 'VGA';

INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id
FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'GIGA-V1-I9-4090' AND av.value = N'NVIDIA RTX 4090 24GB' AND av.attribute_id = a.id AND a.code = 'VGA';

-- SSD
INSERT INTO attribute_values (attribute_id, value)
SELECT id, N'2TB NVMe Gen4' FROM attributes WHERE code = 'SSD';

INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id
FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'GIGA-V1-I9-4090' AND av.value = N'2TB NVMe Gen4' AND av.attribute_id = a.id AND a.code = 'SSD';

-- CASE
INSERT INTO attribute_values (attribute_id, value)
SELECT id, N'Corsair 7000D Airflow' FROM attributes WHERE code = 'CASE';

INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id
FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'GIGA-V1-I9-4090' AND av.value = N'Corsair 7000D Airflow' AND av.attribute_id = a.id AND a.code = 'CASE';


-- ========================================================
-- SẢN PHẨM 2: ASUS ROG STRIX G15
-- ========================================================

-- 4.1 Insert Product
INSERT INTO products (name, sku, slug, description, brand, status, is_new, is_best_seller, thumbnail_url, created_at)
VALUES (
           N'PC GAMING ASUS ROG STRIX G15',
           'PVPC-ASUS-G15',
           'pc-gaming-asus-rog-strix-g15',
           N'Cấu hình PC Gaming Tầm Trung, tối ưu hiệu năng trên giá thành.',
           'ASUS',
           'active',
           0,
           1,
           '/uploads/products/ASUS_ROG_STRIX_G15.jpg',
           SYSDATETIME()
       );

-- 4.2 Link Categories
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'PVPC-ASUS-G15' AND c.slug IN ('linh-kien-may-tinh', 'phu-kien-gaming');

-- 4.3 Insert Variant
INSERT INTO product_variants (product_id, sku, price, quantity, status, created_at)
SELECT id, 'ASUS-V1-I5-3060', 22500000, 15, 'active', SYSDATETIME()
FROM products WHERE sku = 'PVPC-ASUS-G15';

-- 4.4 Attributes
-- CPU
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'Intel Core i5 13400F' FROM attributes WHERE code = 'CPU';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'ASUS-V1-I5-3060' AND av.value = N'Intel Core i5 13400F' AND av.attribute_id = a.id;

-- RAM
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'16GB DDR4 3200MHz' FROM attributes WHERE code = 'RAM';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'ASUS-V1-I5-3060' AND av.value = N'16GB DDR4 3200MHz' AND av.attribute_id = a.id;

-- VGA
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'NVIDIA RTX 3060 12GB' FROM attributes WHERE code = 'VGA';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'ASUS-V1-I5-3060' AND av.value = N'NVIDIA RTX 3060 12GB' AND av.attribute_id = a.id;

-- SSD
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'512GB NVMe Gen4' FROM attributes WHERE code = 'SSD';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'ASUS-V1-I5-3060' AND av.value = N'512GB NVMe Gen4' AND av.attribute_id = a.id;

-- CASE
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'Asus ROG Strix Case' FROM attributes WHERE code = 'CASE';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'ASUS-V1-I5-3060' AND av.value = N'Asus ROG Strix Case' AND av.attribute_id = a.id;


-- ========================================================
-- SẢN PHẨM 3: CUSTOM PC RYZEN
-- ========================================================

-- 5.1 Insert Product
INSERT INTO products (name, sku, slug, description, brand, status, is_new, is_best_seller, thumbnail_url, created_at)
VALUES (
           N'PC CUSTOM BUILD RYZEN SERIES',
           'PVPC-CUSTOM-R7',
           'pc-custom-build-ryzen-series',
           N'Cấu hình PC Custom theo yêu cầu, hỗ trợ Pre-order.',
           'CUSTOM PC',
           'preorder',
           1,
           0,
           '/uploads/products/CUSTOM_PC_RYZEN.webp',
           SYSDATETIME()
       );

-- 5.2 Link Category
INSERT INTO product_categories (product_id, category_id)
SELECT p.id, c.id FROM products p, categories c WHERE p.sku = 'PVPC-CUSTOM-R7' AND c.slug = 'linh-kien-may-tinh';

-- 5.3 Insert Variant
INSERT INTO product_variants (product_id, sku, price, quantity, status, created_at)
SELECT id, 'CUST-V1-R7-4070', 45000000, 5, 'active', SYSDATETIME()
FROM products WHERE sku = 'PVPC-CUSTOM-R7';

-- 5.4 Attributes
-- CPU
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'AMD Ryzen 7 7800X3D' FROM attributes WHERE code = 'CPU';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'CUST-V1-R7-4070' AND av.value = N'AMD Ryzen 7 7800X3D' AND av.attribute_id = a.id;

-- RAM
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'32GB DDR5 5600MHz' FROM attributes WHERE code = 'RAM';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'CUST-V1-R7-4070' AND av.value = N'32GB DDR5 5600MHz' AND av.attribute_id = a.id;

-- VGA
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'NVIDIA RTX 4070 Ti 12GB' FROM attributes WHERE code = 'VGA';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'CUST-V1-R7-4070' AND av.value = N'NVIDIA RTX 4070 Ti 12GB' AND av.attribute_id = a.id;

-- SSD
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'1TB NVMe Gen4' FROM attributes WHERE code = 'SSD';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'CUST-V1-R7-4070' AND av.value = N'1TB NVMe Gen4' AND av.attribute_id = a.id;

-- CASE
INSERT INTO attribute_values (attribute_id, value) SELECT id, N'Lian Li O11 Dynamic EVO' FROM attributes WHERE code = 'CASE';
INSERT INTO variant_attribute_values (variant_id, attribute_value_id)
SELECT v.id, av.id FROM product_variants v, attribute_values av, attributes a
WHERE v.sku = 'CUST-V1-R7-4070' AND av.value = N'Lian Li O11 Dynamic EVO' AND av.attribute_id = a.id;