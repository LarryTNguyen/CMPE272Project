// src/hooks/usePositions2.js
import { useEffect, useState } from 'react';
import supabase from '../services/superbase';

export default function usePositions2() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('positions_2')
      .select('id, ticker, quantity, average_price, status, closed_at')
      .eq('status', 'open')
      .order('updated_at', { ascending: false });
    if (error) setError(error);
    else setData(data || []);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, []);
  return { data, loading, error, refresh };
}
