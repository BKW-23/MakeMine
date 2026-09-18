-- Seed sản phẩm mẫu. KHÔNG insert vào auth.users hay public.profiles ở đây.
-- Sau khi có user thật (đăng ký qua Supabase Auth), nâng quyền admin bằng:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'EMAIL_CUA_BAN');

insert into public.products (name, slug, category, base_price, short_description, image_url, customizable, colors, fonts, featured, stock) values
('Móc khoá tên bé Gấu', 'moc-khoa-ten-be-gau', 'móc khoá', 89000, 'Móc khoá da khắc tên, hình gấu dễ thương', '', true, array['hồng','be','trắng'], array['Quicksand','Pacifico'], true, 50),
('Gương cầm tay hoa cúc', 'guong-cam-tay-hoa-cuc', 'gương', 149000, 'Gương bỏ túi khắc tên viền hoa cúc', '', true, array['hồng','lilac'], array['Quicksand'], true, 30),
('Lược gỗ khắc tên', 'luoc-go-khac-ten', 'lược', 99000, 'Lược gỗ tự nhiên khắc tên hoặc lời chúc', '', true, array['nâu gỗ'], array['Pacifico','Quicksand'], false, 40),
('Kẹp tóc nơ pastel', 'kep-toc-no-pastel', 'kẹp tóc', 59000, 'Kẹp tóc nơ có thể khắc tên nhỏ', '', true, array['hồng','xanh mint','vàng'], array['Quicksand'], true, 60),
('Móc khoá đôi couple', 'moc-khoa-doi-couple', 'móc khoá', 129000, 'Bộ 2 móc khoá khắc tên cho cặp đôi', '', true, array['đen','trắng'], array['Pacifico'], false, 25),
('Gương mini bỏ túi', 'guong-mini-bo-tui', 'gương', 79000, 'Gương nhỏ gọn khắc tên tối giản', '', true, array['trong suốt','hồng'], array['Quicksand'], false, 35),
('Lược bỏ túi mini', 'luoc-bo-tui-mini', 'lược', 69000, 'Lược nhỏ tiện mang theo, khắc tên', '', true, array['be'], array['Quicksand'], false, 45),
('Kẹp tóc hình sao', 'kep-toc-hinh-sao', 'kẹp tóc', 49000, 'Kẹp tóc hình sao lấp lánh', '', false, array['bạc','vàng'], array[]::text[], false, 70);
