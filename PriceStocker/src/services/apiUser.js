import supabase from './superbase';

export const addFunds = async (amount) => {
  const { error } = await supabase.rpc('add_funds', {
    amount_to_add: amount,
  });

  if (error) throw error;
};
export const getTransactions = async (userId) => {
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true });
  if (error) throw error;
  return transactions;
};
