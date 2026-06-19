import { create } from 'zustand';
import axios from '../api/axios';

const useOptionsStore = create((set, get) => ({
  options: null,
  loading: false,
  error: null,

  fetch: async () => {
    if (get().options) return;
    set({ loading: true });
    try {
      const res = await axios.get('/v1/options');
      set({ options: res.data, loading: false });
    } catch {
      set({ error: '선택지를 불러오지 못했어요.', loading: false });
    }
  },
}));

export default useOptionsStore;
