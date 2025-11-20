-- get_home_summary.sql
-- Returns totals for the currently authenticated user
create or replace function get_home_summary(uid uuid default auth.uid())
returns table (
  total_assets numeric,
  cash numeric,
  market_value numeric,
  total_profit numeric
)
language sql
stable
security invoker
as $$
  with
  -- Cash
  bal as (
    select coalesce(cash,0) as cash
    from profiles
    where id = uid
    limit 1
  ),
  -- Mark-to-market of open positions
  pos as (
    select p.ticker, p.quantity, coalesce(sd.current_price, 0) as px
    from positions p
    left join stock_data sd using(ticker)
    where p.user_id = uid
  ),
  mv as (
    select coalesce(sum(quantity * px), 0) as market_value
    from pos
  ),
  -- “Total profit” as you currently compute it in React:
  -- sum(sells) - sum(buys) across all transactions
  tp as (
    select coalesce(sum(case
      when type = 'buy'  then -quantity * price
      when type = 'sell' then  quantity * price
      else 0 end), 0) as total_profit
    from transactions
    where user_id = uid
  )
  select
    (mv.market_value + bal.cash) as total_assets,
    bal.cash,
    mv.market_value,
    tp.total_profit
  from mv, bal, tp;
$$;
