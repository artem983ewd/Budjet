import { create } from "zustand";

interface MonthStore {
  selectedMonth: Date;
  setSelectedMonth: (date: Date) => void;
}

const now = new Date();

export const useSelectedMonth = create<MonthStore>((set) => ({
  selectedMonth: new Date(now.getFullYear(), now.getMonth(), 1),
  setSelectedMonth: (date) => set({ selectedMonth: date }),
}));