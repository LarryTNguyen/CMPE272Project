-- enable for gen_random_uuid()
create extension if not exists pgcrypto;

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  ticker text not null,
  side text not null check (side in ('buy','sell')),
  quantity numeric not null,
  price numeric not null,
  fee numeric not null default 0,
  effective_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  meta jsonb not null default '{}'::jsonb
);

-- fast paths for your doorway queries
create index if not exists idx_tx_user_created_id
  on public.transactions (user_id, created_at desc, id desc);

create index if not exists idx_tx_user_ticker_created_id
  on public.transactions (user_id, ticker, created_at desc, id desc);
