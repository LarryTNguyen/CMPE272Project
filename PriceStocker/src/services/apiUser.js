import supabase from './superbase';

export const addFunds = async (amount) => {
  const { error } = await supabase.rpc('add_funds', {
    amount_to_add: amount,
  });

  if (error) throw error;
};
