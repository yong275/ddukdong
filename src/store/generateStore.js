import { create } from 'zustand';

const DEFAULT_CHARS = [{ role: '주인공', name: '', gender: '여자' }];

const useGenerateStore = create((set) => ({
  step: 0,
  chars: DEFAULT_CHARS,
  age: '7-9',
  setting: '학교',
  situation: '',
  moral: '',
  artStyle: 'fairytale',
  input_mode: 'parent',

  setStep: (step) => set({ step }),

  setChars: (chars) => set({ chars }),

  addChar: () =>
    set((state) => {
      if (state.chars.length >= 3) return state;
      return {
        chars: [
          ...state.chars,
          { role: '친구', name: '', gender: '여자' },
        ],
      };
    }),

  removeChar: (index) =>
    set((state) => ({
      chars: state.chars.filter((_, i) => i !== index),
    })),

  setAge: (age) => set({ age }),

  setSetting: (setting) => set({ setting }),

  setSituation: (situation) => set({ situation }),

  setMoral: (moral) => set({ moral }),

  setArtStyle: (artStyle) => set({ artStyle }),

  setInputMode: (input_mode) => set({ input_mode }),

  reset: () =>
    set({
      step: 0,
      chars: DEFAULT_CHARS,
      age: '7-9',
      setting: '학교',
      situation: '',
      moral: '',
      artStyle: 'fairytale',
      input_mode: 'parent',
    }),
}));

export default useGenerateStore;
