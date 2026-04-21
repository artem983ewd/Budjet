import { create } from "zustand";
import { DeleteItem } from "../types";

interface DeleteStore {
  itemToDelete: DeleteItem | null;
  setItemToDelete: (item: DeleteItem | null) => void;
}

export const useDeleteStore = create<DeleteStore>((set) => ({
  itemToDelete: null,
  setItemToDelete: (item) => set({ itemToDelete: item }),
}));