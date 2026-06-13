-- ════════════════════════════════════════════════════════════════
--  Chai Pe Charcha — Supabase schema, RLS, and secure functions
--  Run this in Supabase → SQL Editor (once).
-- ════════════════════════════════════════════════════════════════

-- ── PROFILES (role lives here; linked to Supabase auth.users) ──
create table if not exists profiles (
  id         uuid primary key references auth.users on delete cascade,
  name       text,
  phone      text,
  role       text not null default 'staff',         -- 'admin' | 'staff'
  created_at timestamptz default now()
);

-- Auto-create a profile row when a new auth user signs up.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, name) values (new.id, new.raw_user_meta_data->>'name');
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function handle_new_user();

-- helper: is the current user an admin?
create or replace function is_admin()
returns boolean language sql security definer set search_path = public stable as $$
  select exists (select 1 from profiles where id = auth.uid() and role = 'admin');
$$;

-- ── CATEGORIES ──
create table if not exists categories (
  id          text primary key,                      -- 'karhai', 'pizza', ...
  label       text not null,
  description text default '',
  image_url   text,
  sort_order  int default 0
);

-- ── MENU ITEMS ──
create table if not exists menu_items (
  id          bigint generated always as identity primary key,
  category_id text references categories on delete cascade,
  name        text not null,
  price       numeric(10,2) not null check (price >= 0),
  image_url   text,
  variants    jsonb,                                 -- [{label,price_offset}]
  dine_in     boolean not null default true,
  takeaway    boolean not null default true,
  delivery    boolean not null default true,
  is_active   boolean not null default true,
  sold_out    boolean not null default false,
  is_featured boolean not null default false,
  sort_order  int default 0,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- ── ORDERS ──
create table if not exists orders (
  id               bigint generated always as identity primary key,
  guest_name       text not null,
  guest_phone      text not null,
  delivery_address text,
  service          text not null default 'delivery', -- delivery | takeaway | dinein
  status           text not null default 'Pending',  -- Pending | Accepted | Rejected
  payment_method   text not null default 'cod',
  payment_status   text not null default 'unpaid',
  total_price      numeric(10,2) not null default 0,
  created_at       timestamptz default now()
);

create table if not exists order_items (
  id        bigint generated always as identity primary key,
  order_id  bigint references orders on delete cascade,
  item_id   bigint references menu_items,
  item_name text not null,
  quantity  int not null check (quantity between 1 and 50),
  price     numeric(10,2) not null
);

-- ── BANNERS ──
create table if not exists banners (
  id         bigint generated always as identity primary key,
  image_url  text, title text, link text,
  is_active  boolean default true, sort_order int default 0
);

-- ════════════════════════════════════════════════════════════════
--  ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════
alter table profiles    enable row level security;
alter table categories  enable row level security;
alter table menu_items  enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;
alter table banners     enable row level security;

-- Profiles: a user sees their own; admins see all.
create policy "own profile"      on profiles for select using (id = auth.uid() or is_admin());
create policy "admin writes profiles" on profiles for all using (is_admin()) with check (is_admin());

-- Categories & menu: public can READ active items; only admins write.
create policy "public reads categories" on categories for select using (true);
create policy "admin writes categories" on categories for all using (is_admin()) with check (is_admin());

create policy "public reads active items" on menu_items
  for select using (is_active = true or is_admin());
create policy "admin writes items" on menu_items
  for all using (is_admin()) with check (is_admin());

-- Banners: public reads active; admin writes.
create policy "public reads banners" on banners for select using (is_active or is_admin());
create policy "admin writes banners" on banners for all using (is_admin()) with check (is_admin());

-- Orders: only admins can read/update. Customers place orders ONLY through the
-- place_order() function below (no direct insert policy on purpose).
create policy "admin reads orders" on orders for select using (is_admin());
create policy "admin updates orders" on orders for update using (is_admin()) with check (is_admin());
create policy "admin reads order_items" on order_items for select using (is_admin());

-- ════════════════════════════════════════════════════════════════
--  SECURE ORDER PLACEMENT (anti-tampering)
--  Prices are read from the DB here — the client can NEVER set a price.
-- ════════════════════════════════════════════════════════════════
create or replace function place_order(
  p_name text, p_phone text, p_address text, p_service text, p_items jsonb
) returns bigint
language plpgsql security definer set search_path = public as $$
declare
  v_order_id bigint;
  v_total numeric := 0;
  v_item jsonb; v_menu menu_items%rowtype; v_variant jsonb;
  v_unit numeric; v_qty int; v_label text;
begin
  if coalesce(trim(p_name), '') = '' then raise exception 'Name is required'; end if;
  if coalesce(trim(p_phone), '') = '' then raise exception 'Phone is required'; end if;
  if p_items is null or jsonb_array_length(p_items) = 0 then raise exception 'Cart is empty'; end if;

  insert into orders (guest_name, guest_phone, delivery_address, service, total_price)
  values (trim(p_name), trim(p_phone), nullif(trim(p_address), ''), coalesce(p_service,'delivery'), 0)
  returning id into v_order_id;

  for v_item in select value from jsonb_array_elements(p_items) loop
    v_qty   := (v_item->>'quantity')::int;
    v_label := nullif(v_item->>'variant', '');
    if v_qty is null or v_qty < 1 or v_qty > 50 then raise exception 'Invalid quantity'; end if;

    select * into v_menu from menu_items where id = (v_item->>'item_id')::bigint;
    if not found or not v_menu.is_active then raise exception 'An item is unavailable'; end if;
    if v_menu.sold_out then raise exception '% is sold out', v_menu.name; end if;

    v_unit := v_menu.price;
    if v_menu.variants is not null and jsonb_array_length(v_menu.variants) > 0 then
      if v_label is null then raise exception '% needs a size/variant', v_menu.name; end if;
      select elem into v_variant
        from jsonb_array_elements(v_menu.variants) elem
        where elem->>'label' = v_label limit 1;
      if v_variant is null then raise exception 'Invalid variant for %', v_menu.name; end if;
      v_unit := v_unit + coalesce((v_variant->>'price_offset')::numeric, 0);
    end if;

    insert into order_items (order_id, item_id, item_name, quantity, price)
    values (v_order_id, v_menu.id,
            case when v_label is not null then v_menu.name || ' (' || v_label || ')' else v_menu.name end,
            v_qty, v_unit);
    v_total := v_total + v_unit * v_qty;
  end loop;

  update orders set total_price = round(v_total, 2) where id = v_order_id;
  return v_order_id;
end; $$;
grant execute on function place_order(text, text, text, text, jsonb) to anon, authenticated;

-- Public order tracking: returns details only if the phone matches (no enumeration).
create or replace function get_order(p_id bigint, p_phone text)
returns jsonb language plpgsql security definer set search_path = public stable as $$
declare v_order orders%rowtype; v_items jsonb;
begin
  select * into v_order from orders where id = p_id;
  if not found then return null; end if;
  if regexp_replace(coalesce(p_phone,''), '\D', '', 'g') <> regexp_replace(v_order.guest_phone, '\D', '', 'g')
  then
    return jsonb_build_object('id', v_order.id, 'status', v_order.status, 'created_at', v_order.created_at);
  end if;
  select jsonb_agg(jsonb_build_object('item_name', item_name, 'quantity', quantity, 'price', price))
    into v_items from order_items where order_id = p_id;
  return jsonb_build_object(
    'id', v_order.id, 'guest_name', v_order.guest_name, 'status', v_order.status,
    'service', v_order.service, 'total_price', v_order.total_price,
    'delivery_address', v_order.delivery_address, 'created_at', v_order.created_at,
    'items', coalesce(v_items, '[]'::jsonb));
end; $$;
grant execute on function get_order(bigint, text) to anon, authenticated;

-- ════════════════════════════════════════════════════════════════
--  SEED — categories (items can be added in the admin panel, or import
--  the full set from the old seed_menu.py in a follow-up script).
-- ════════════════════════════════════════════════════════════════
insert into categories (id, label, description, sort_order) values
  ('karhai','Karhai','Rich, slow-cooked karahis made fresh every day',0),
  ('burger','Burgers','Juicy, stacked burgers — loaded with flavour',1),
  ('pizza','Pizza','Stone-baked pizzas with bold Pakistani twists',2),
  ('tikka','Tikka','Charcoal-grilled tikkas, smoky & tender',3),
  ('boti','Boti','Tender grilled boti pieces packed with spice',4),
  ('rolls','Rolls','Hot, stuffed rolls — perfect street food bite',5),
  ('sandwiches','Sandwiches','Fresh, loaded sandwiches toasted to perfection',6),
  ('paratha','Paratha','Crispy, buttery parathas — a desi staple',7),
  ('pasta','Pasta','Creamy & spicy pastas with a Pakistani soul',8),
  ('fries','Fries','Golden, crispy fries — plain or loaded',9),
  ('wings','Wings','Crispy, saucy chicken wings',10),
  ('chai','Chai','The soul of every gathering — perfectly brewed',11),
  ('beverage','Beverages','Cool, refreshing drinks for every meal',12),
  ('soup','Soup','Warm, hearty soups for every season',13),
  ('kids-menu','Kids Menu','Fun, tasty bites for little ones',14),
  ('salad','Salad','Fresh, crunchy salads — light & healthy',15),
  ('side-items','Side Items','Perfect accompaniments to your meal',16)
on conflict (id) do nothing;

-- A couple of starter items so the menu isn't empty (variants demo on karahi/pizza):
insert into menu_items (category_id, name, price, variants, sort_order) values
  ('karhai','Chicken Karahi',850,'[{"label":"Half","price_offset":0},{"label":"Full","price_offset":400}]',0),
  ('karhai','Mutton Karahi',1100,'[{"label":"Half","price_offset":0},{"label":"Full","price_offset":400}]',1),
  ('pizza','Chicken Fajita Pizza',650,'[{"label":"Small","price_offset":0},{"label":"Medium","price_offset":150},{"label":"Large","price_offset":300}]',0),
  ('chai','Doodh Patti',60,null,0),
  ('chai','Karak Chai',80,null,1)
on conflict do nothing;
