// src/lib/api.js
import  supabase  from '../services/superbase';

const FUNCTIONS_BASE = `https://${import.meta.env.VITE_SUPABASE_PROJECT_REF}.functions.supabase.co`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function getAccessTokenOrThrow() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (!session?.access_token) throw new Error('Not signed in');
  return session.access_token;
}

export async function getPositions() {
  const token = await getAccessTokenOrThrow();
  const res = await fetch(`${FUNCTIONS_BASE}/get-positions`, {
    headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getPendingOrders() {
  const token = await getAccessTokenOrThrow();
  const res = await fetch(`${FUNCTIONS_BASE}/get-pending-orders`, {
    headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function getWatchlist() {
  const token = await getAccessTokenOrThrow();
  const res = await fetch(`${FUNCTIONS_BASE}/get-watchlist`, {
    headers: { Authorization: `Bearer ${token}`, apikey: ANON_KEY }
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
