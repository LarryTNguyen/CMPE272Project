import supabase from './superbase';

export const placeBuyOrder = async ({ ticker, quantity, limitPrice }) => {
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

export const placeSellOrder = async ({ ticker, quantity, limitPrice }) => {
  const { data, error } = await supabase.rpc('place_sell_order', {
    p_ticker: ticker,
    p_quantity: quantity,
    p_limit_price: limitPrice,
  });
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const getPositions = async () => {
  const { data, error } = await supabase.rpc('get_user_positions');

  if (error) {
    console.error('Error fetching portfolio:', error);
    throw new Error(error.message);
  }
  console.log(data);
  return data;
};
