import supabase from './supabase';

export const placeOrder = async ({ ticker, quantity, limitPrice }) => {
  const { data, error } = await supabase.rpc('place_buy_order', {
    p_ticker: ticker,
    p_quantity: quantity,
    p_limit_price: limitPrice,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
