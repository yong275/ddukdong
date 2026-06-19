import { create } from 'zustand';

const DEFAULT_CHARS = [{ role: '주인공', name: '', gender: '여자' }];

const useGenerateStore = create((set) => ({
  step: 0,
  chars: DEFAULT_CHARS,
  age: '7-9',
  setting: '',
  settingEn: '',
  situation: '',
  moral: '',
  artStyle: '',
  artStyleEn: '',
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

  updateChar: (index, field, value) =>
    set((state) => ({
      chars: state.chars.map((c, i) => i === index ? { ...c, [field]: value } : c),
    })),

  setAge: (age) => set({ age }),

  setSetting: (setting, settingEn = '') => set({ setting, settingEn }),

  setSituation: (situation) => set({ situation }),

  setMoral: (moral) => set({ moral }),

  setArtStyle: (artStyle, artStyleEn = '') => set({ artStyle, artStyleEn }),

  setInputMode: (input_mode) => set({ input_mode }),

  reset: () =>
    set({
      step: 0,
      chars: DEFAULT_CHARS,
      age: '7-9',
      setting: '',
      settingEn: '',
      situation: '',
      moral: '',
      artStyle: '',
      artStyleEn: '',
      input_mode: 'parent',
    }),
}));

export default useGenerateStore;
