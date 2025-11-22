-- Create a function to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    -- Generate a default username from email or metadata, ensuring uniqueness is handled by app or subsequent updates
    -- For now, we'll just use the part before @ of email or a random string if not present
    coalesce(
      new.raw_user_meta_data->>'username',
      split_part(new.email, '@', 1)
    )
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create the trigger
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Backfill existing users who might be missing profiles
insert into public.profiles (id, username)
select id, split_part(email, '@', 1)
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;
