import { create } from 'zustand';

export default create(set => ({
  open: false,
  setOpen: (v) => set({ open: v }),
}));
