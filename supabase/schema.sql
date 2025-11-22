-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  updated_at timestamp with time zone,
  constraint username_length check (char_length(username) >= 3)
);

-- Create remixes table
create table public.remixes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  original_image_url text not null,
  generated_image_url text, -- Nullable until generation is complete
  prompt_used text,
  style_preset text,
  category text, -- 'headshot', 'wedding', etc.
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create moodboards table
create table public.moodboards (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create moodboard_items table (join table)
create table public.moodboard_items (
  id uuid default uuid_generate_v4() primary key,
  moodboard_id uuid references public.moodboards(id) on delete cascade not null,
  remix_id uuid references public.remixes(id) on delete cascade not null,
  added_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(moodboard_id, remix_id)
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.remixes enable row level security;
alter table public.moodboards enable row level security;
alter table public.moodboard_items enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Remixes policies
create policy "Public remixes are viewable by everyone."
  on remixes for select
  using ( is_public = true );

create policy "Users can view their own private remixes."
  on remixes for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own remixes."
  on remixes for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own remixes."
  on remixes for update
  using ( auth.uid() = user_id );

-- Moodboards policies
create policy "Public moodboards are viewable by everyone."
  on moodboards for select
  using ( is_public = true );

create policy "Users can insert their own moodboards."
  on moodboards for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own moodboards."
  on moodboards for update
  using ( auth.uid() = user_id );

-- Moodboard Items policies
create policy "Items in public moodboards are viewable."
  on moodboard_items for select
  using ( exists ( select 1 from moodboards where id = moodboard_items.moodboard_id and is_public = true ) );

create policy "Users can add items to their own moodboards."
  on moodboard_items for insert
  with check ( exists ( select 1 from moodboards where id = moodboard_items.moodboard_id and user_id = auth.uid() ) );

-- Storage Buckets Setup (You need to create these in the dashboard, but here's the policy logic)
-- Bucket: 'remixes'
-- Policy: Public Read, Authenticated Upload
