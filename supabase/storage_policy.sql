-- Enable RLS on storage.objects if not already enabled (usually enabled by default)
-- alter table storage.objects enable row level security;

-- 1. Allow Public Read Access to the 'remixes' bucket
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'remixes' );

-- 2. Allow Authenticated Users to Upload to the 'remixes' bucket
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'remixes' and auth.role() = 'authenticated' );

-- 3. Allow Users to Update/Delete their own files
create policy "User Update Own Files"
on storage.objects for update
using ( bucket_id = 'remixes' and auth.uid() = owner );

create policy "User Delete Own Files"
on storage.objects for delete
using ( bucket_id = 'remixes' and auth.uid() = owner );
