import { create } from "zustand";
import { IconName } from "@/shared/ui/IconRenderer";
import { DeleteItem } from "../types";

interface UIStore {
  editingSubId: string | null;
  amountValue: string;
  hiddenSubs: Set<string>;
  mainModalOpened: boolean;
  subModalOpened: boolean;
  deleteModalOpened: boolean;
  activeMainCatId: string | null;
  newName: string;
  selectedIcon: IconName;
  itemToDelete: DeleteItem | null;

  setEditingSubId: (id: string | null) => void;
  setAmountValue: (value: string) => void;
  setNewName: (value: string) => void;
  setSelectedIcon: (icon: IconName) => void;
  setActiveMainCatId: (id: string | null) => void;
  setItemToDelete: (item: DeleteItem | null) => void;
  toggleSubTransactions: (subId: string) => void;
  openMainModal: () => void;
  closeMainModal: () => void;
  openSubModal: (catId: string) => void;
  closeSubModal: () => void;
  openDeleteModal: () => void;
  closeDeleteModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  editingSubId: null,
  amountValue: "",
  hiddenSubs: new Set(),
  mainModalOpened: false,
  subModalOpened: false,
  deleteModalOpened: false,
  activeMainCatId: null,
  newName: "",
  selectedIcon: "food",
  itemToDelete: null,

  setEditingSubId: (id) => set({ editingSubId: id }),
  setAmountValue: (value) => set({ amountValue: value }),
  setNewName: (value) => set({ newName: value }),
  setSelectedIcon: (icon) => set({ selectedIcon: icon }),
  setActiveMainCatId: (id) => set({ activeMainCatId: id }),
  setItemToDelete: (item) => set({ itemToDelete: item }),

  toggleSubTransactions: (subId) =>
    set((state) => {
      const newSet = new Set(state.hiddenSubs);
      if (newSet.has(subId)) {
        newSet.delete(subId);
      } else {
        newSet.add(subId);
      }
      return { hiddenSubs: newSet };
    }),

  openMainModal: () => set({ mainModalOpened: true }),
  closeMainModal: () => set({ mainModalOpened: false, newName: "", selectedIcon: "food" }),
  openSubModal: (catId) => set({ subModalOpened: true, activeMainCatId: catId }),
  closeSubModal: () => set({ subModalOpened: false, newName: "", selectedIcon: "food" }),

  openDeleteModal: () => set({ deleteModalOpened: true }),
  closeDeleteModal: () => set({ deleteModalOpened: false, itemToDelete: null }),
}));