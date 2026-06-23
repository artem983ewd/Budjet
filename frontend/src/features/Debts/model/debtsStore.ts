import { create } from "zustand";
import { IconName } from "../../../shared/ui/IconRenderer";
import { Debt } from "../../../entities/Debt";

interface DebtsStore {
  // Create modal state
  createModalOpened: boolean;
  newDebtName: string;
  newDebtTotal: number;
  newDebtRemaining: number;
  selectedIcon: IconName;

  // Edit modal state
  editModalOpened: boolean;
  editingDebt: Debt | null;
  editDebtName: string;
  editDebtTotal: number;
  editDebtRemaining: number;
  editSelectedIcon: IconName;

  // Create modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setNewDebtName: (name: string) => void;
  setNewDebtTotal: (total: number) => void;
  setNewDebtRemaining: (remaining: number) => void;
  setSelectedIcon: (icon: IconName) => void;
  resetCreateForm: () => void;

  // Edit modal actions
  openEditModal: (debt: Debt) => void;
  closeEditModal: () => void;
  setEditDebtName: (name: string) => void;
  setEditDebtTotal: (total: number) => void;
  setEditDebtRemaining: (remaining: number) => void;
  setEditSelectedIcon: (icon: IconName) => void;
}

const DEFAULT_ICON: IconName = "gift";

export const useDebtsStore = create<DebtsStore>((set) => ({
  // Initial create modal state
  createModalOpened: false,
  newDebtName: "",
  newDebtTotal: 0,
  newDebtRemaining: 0,
  selectedIcon: DEFAULT_ICON,

  // Initial edit modal state
  editModalOpened: false,
  editingDebt: null,
  editDebtName: "",
  editDebtTotal: 0,
  editDebtRemaining: 0,
  editSelectedIcon: DEFAULT_ICON,

  // Create modal actions
  openCreateModal: () => set({ createModalOpened: true }),
  closeCreateModal: () =>
    set({
      createModalOpened: false,
      newDebtName: "",
      newDebtTotal: 0,
      newDebtRemaining: 0,
      selectedIcon: DEFAULT_ICON,
    }),
  setNewDebtName: (name) => set({ newDebtName: name }),
  setNewDebtTotal: (total) => set({ newDebtTotal: total }),
  setNewDebtRemaining: (remaining) => set({ newDebtRemaining: remaining }),
  setSelectedIcon: (icon) => set({ selectedIcon: icon }),
  resetCreateForm: () =>
    set({
      newDebtName: "",
      newDebtTotal: 0,
      newDebtRemaining: 0,
      selectedIcon: DEFAULT_ICON,
    }),

  // Edit modal actions
  openEditModal: (debt) =>
    set({
      editModalOpened: true,
      editingDebt: debt,
      editDebtName: debt.name,
      editDebtTotal: Number(debt.total_debt),
      editDebtRemaining: Number(debt.remaining_debt),
      editSelectedIcon: (debt.icon as IconName) || DEFAULT_ICON,
    }),
  closeEditModal: () =>
    set({
      editModalOpened: false,
      editingDebt: null,
      editDebtName: "",
      editDebtTotal: 0,
      editDebtRemaining: 0,
      editSelectedIcon: DEFAULT_ICON,
    }),
  setEditDebtName: (name) => set({ editDebtName: name }),
  setEditDebtTotal: (total) => set({ editDebtTotal: total }),
  setEditDebtRemaining: (remaining) => set({ editDebtRemaining: remaining }),
  setEditSelectedIcon: (icon) => set({ editSelectedIcon: icon }),
}));