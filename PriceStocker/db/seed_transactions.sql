-- Sample rows for your user
insert into public.transactions (id, user_id, ticker, side, quantity, price, fee, effective_at, created_at, meta)
values
  (gen_random_uuid(), '3786bdb1-c9bc-4124-aee5-d249ebbd4dbc', 'BTCUSDT','buy', 0.10, 68000, 1.20, now() - interval '2 days', now() - interval '2 days', jsonb_build_object('exchange','Bitunix')),
  (gen_random_uuid(), '3786bdb1-c9bc-4124-aee5-d249ebbd4dbc', 'ETHUSDT','sell',0.50, 3400,  0.90, now() - interval '1 days', now() - interval '1 days', jsonb_build_object('exchange','Bitunix'));
