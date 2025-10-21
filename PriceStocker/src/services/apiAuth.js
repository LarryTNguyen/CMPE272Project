import supabase from './superbase';

export const signup = async ({ username, email, password }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      username,
      avatar: '',
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

export const login = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};
