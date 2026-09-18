-- Seed sản phẩm mẫu. KHÔNG insert vào auth.users hay public.profiles ở đây.
-- Sau khi có user thật (đăng ký qua Supabase Auth), nâng quyền admin bằng:
--   update public.profiles set role = 'admin'
--   where id = (select id from auth.users where email = 'EMAIL_CUA_BAN');

insert into public.products (name, slug, category, base_price, short_description, image_url, customizable, colors, fonts, featured, stock) values
('Lược bỏ túi mini', 'luoc-bo-tui-mini', 'lược', 69000, 'Lược nhỏ tiện mang theo, khắc tên', '/sample-product.png', true, array['hồng'], array['Quicksand'], true, 45)
on conflict (slug) do update set
  name = excluded.name,
  category = excluded.category,
  base_price = excluded.base_price,
  short_description = excluded.short_description,
  image_url = excluded.image_url,
  customizable = excluded.customizable,
  colors = excluded.colors,
  fonts = excluded.fonts,
  featured = excluded.featured,
  stock = excluded.stock;
