import supabase from './superbase';

export const signup = async ({ username, email, password, fullName }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username,
        avatar: '',
      },
    },
  });

  if (error) throw new Error(error.message);
  return data;
};

export const signin = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);
  return data;
};
