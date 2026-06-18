import instance, { supabase } from './axios.js';

export async function signup({ email, nickname, password }) {
  const { data } = await instance.post('/v1/auth/signup', { email, nickname, password });
  return data;
}

export async function login({ email, password }) {
  const { data } = await instance.post('/v1/auth/login', { email, password });
  return data;
}

export async function loginWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${import.meta.env.BASE_URL}`,
    },
  });
  if (error) throw error;
}

export async function logout() {
  await supabase.auth.signOut();
}
