import { create } from 'zustand';

const STORAGE_KEY = 'tt-user';

function loadUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const useAuthStore = create((set) => ({
  user: loadUser(),

  setUser: (userData) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    set({ user: userData });
  },

  clearUser: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({ user: null });
  },
}));

export default useAuthStore;
