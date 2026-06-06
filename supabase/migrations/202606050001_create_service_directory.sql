create extension if not exists pg_trgm;

create table if not exists public.service_providers (
  id text primary key,
  name text not null,
  category text not null check (category in ('Mechanic', 'Cleaning', 'Lawn care', 'Plumber', 'Electrician')),
  provider_type text not null check (provider_type in ('chain', 'local')),
  market text not null default 'Austin, TX',
  service text not null,
  service_aliases text[] not null default '{}',
  starting_price numeric,
  rating numeric,
  review_count integer,
  price_status text not null default 'needs-research',
  source_note text,
  source_url text,
  contact_url text,
  email text,
  address text,
  latitude numeric,
  longitude numeric,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_providers_category_idx on public.service_providers(category);
create index if not exists service_providers_market_idx on public.service_providers(market);
create index if not exists service_providers_search_idx
  on public.service_providers
  using gin ((name || ' ' || service || ' ' || coalesce(source_note, '')) gin_trgm_ops);

create table if not exists public.provider_price_quotes (
  id bigint generated always as identity primary key,
  provider_id text not null references public.service_providers(id) on delete cascade,
  price numeric,
  price_min numeric,
  price_max numeric,
  service_scope text,
  source text not null,
  source_date date not null default current_date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.service_providers enable row level security;
alter table public.provider_price_quotes enable row level security;

drop policy if exists "Public can read service providers" on public.service_providers;
create policy "Public can read service providers"
  on public.service_providers for select
  using (true);

drop policy if exists "Public can read provider price quotes" on public.provider_price_quotes;
create policy "Public can read provider price quotes"
  on public.provider_price_quotes for select
  using (true);
