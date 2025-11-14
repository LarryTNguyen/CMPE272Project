import { useEffect, useState } from 'react';
import supabase from '../../services/superbase';

export function useUser() {
  const [user, setUser] = useState(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!mounted) return;
      setUser(session?.user ?? null);
      setIsPending(false);
    })();

    const { data: { subscription } } =
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, isPending, isAuthenticated: !!user };
}
