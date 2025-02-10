import { create } from 'zustand';
import { ApiUsage } from '../types/business';

interface ApiUsageStore {
  usage: ApiUsage;
  incrementGoogle: () => void;
  incrementOutscrapper: () => void;
  resetUsage: () => void;
}

export const useApiUsage = create<ApiUsageStore>((set) => ({
  usage: {
    google: 0,
    outscrapper: 0
  },
  incrementGoogle: () => set((state) => ({
    usage: { ...state.usage, google: state.usage.google + 1 }
  })),
  incrementOutscrapper: () => set((state) => ({
    usage: { ...state.usage, outscrapper: state.usage.outscrapper + 1 }
  })),
  resetUsage: () => set({ usage: { google: 0, outscrapper: 0 } })
}));