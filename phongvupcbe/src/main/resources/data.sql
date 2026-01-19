INSERT INTO categories (name, slug, description, status, created_at)
VALUES
    (N'Linh kiện máy tính', 'linh-kien-may-tinh', N'Các loại CPU, RAM, VGA, Mainboard chính hãng', 'active', SYSDATETIME()),
    (N'Màn hình đồ họa', 'man-hinh-do-hoa', N'Màn hình độ phân giải cao dành cho thiết kế', 'active', SYSDATETIME()),
    (N'Phụ kiện Gaming', 'phu-kien-gaming', N'Chuột, bàn phím cơ, tai nghe gaming cao cấp', 'inactive', SYSDATETIME());
-- Chèn dữ liệu mẫu cho bảng users
-- Mật khẩu mặc định cho tất cả là: 123456
INSERT INTO users (username, password, email, role, status, created_at)
VALUES
    (N'admin', '$2a$10$0Z.vmU62Xl3cou.pP0rSVO31T1COW1CGuX5mHCgrBK9oXTVm9scMS', 'admin@phongvupc.com', 'ADMIN', 'active', SYSDATETIME()),
    (N'nv_banhang', '$2a$10$0Z.vmU62Xl3cou.pP0rSVO31T1COW1CGuX5mHCgrBK9oXTVm9scMS', 'sales@phongvupc.com', 'SALES', 'active', SYSDATETIME()),
    (N'nv_kho', '$2a$10$0Z.vmU62Xl3cou.pP0rSVO31T1COW1CGuX5mHCgrBK9oXTVm9scMS', 'inventory@phongvupc.com', 'INVENTORY', 'active', SYSDATETIME());