-- Run once in Supabase → SQL Editor.
-- Creates a public bucket for menu item images.
-- Uploads happen server-side with the service-role key (gated to admins in code),
-- so no upload policy is needed here. `public = true` makes the images readable.

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;
