create index if not exists idx_tx_user_created_id
  on public.transactions (user_id, created_at desc, id desc);

create index if not exists idx_tx_user_ticker_created_id
  on public.transactions (user_id, ticker, created_at desc, id desc);
