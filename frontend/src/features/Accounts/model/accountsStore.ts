import { create } from "zustand";
import { IconName } from "../../../shared/ui/IconRenderer";
import { Account } from "../../../entities/Account";

interface AccountsStore {
  // Create modal state
  createModalOpened: boolean;
  newAccountName: string;
  newAccountBalance: number;
  newAccountTarget: number;
  selectedIcon: IconName;

  // Edit modal state
  editModalOpened: boolean;
  editingAccount: Account | null;
  editAccountName: string;
  editAccountBalance: number;
  editAccountTarget: number;
  editSelectedIcon: IconName;

  // Create modal actions
  openCreateModal: () => void;
  closeCreateModal: () => void;
  setNewAccountName: (name: string) => void;
  setNewAccountBalance: (balance: number) => void;
  setNewAccountTarget: (target: number) => void;
  setSelectedIcon: (icon: IconName) => void;
  resetCreateForm: () => void;

  // Edit modal actions
  openEditModal: (account: Account) => void;
  closeEditModal: () => void;
  setEditAccountName: (name: string) => void;
  setEditAccountBalance: (balance: number) => void;
  setEditAccountTarget: (target: number) => void;
  setEditSelectedIcon: (icon: IconName) => void;
}

const DEFAULT_ICON: IconName = "home";

export const useAccountsStore = create<AccountsStore>((set) => ({
  // Initial create modal state
  createModalOpened: false,
  newAccountName: "",
  newAccountBalance: 0,
  newAccountTarget: 0,
  selectedIcon: DEFAULT_ICON,

  // Initial edit modal state
  editModalOpened: false,
  editingAccount: null,
  editAccountName: "",
  editAccountBalance: 0,
  editAccountTarget: 0,
  editSelectedIcon: DEFAULT_ICON,

  // Create modal actions
  openCreateModal: () => set({ createModalOpened: true }),
  closeCreateModal: () =>
    set({
      createModalOpened: false,
      newAccountName: "",
      newAccountBalance: 0,
      newAccountTarget: 0,
      selectedIcon: DEFAULT_ICON,
    }),
  setNewAccountName: (name) => set({ newAccountName: name }),
  setNewAccountBalance: (balance) => set({ newAccountBalance: balance }),
  setNewAccountTarget: (target) => set({ newAccountTarget: target }),
  setSelectedIcon: (icon) => set({ selectedIcon: icon }),
  resetCreateForm: () =>
    set({
      newAccountName: "",
      newAccountBalance: 0,
      newAccountTarget: 0,
      selectedIcon: DEFAULT_ICON,
    }),

  // Edit modal actions
  openEditModal: (account) =>
    set({
      editModalOpened: true,
      editingAccount: account,
      editAccountName: account.name,
      editAccountBalance: Number(account.balance),
      editAccountTarget: Number(account.target_amount) || 0,
      editSelectedIcon: (account.icon as IconName) || DEFAULT_ICON,
    }),
  closeEditModal: () =>
    set({
      editModalOpened: false,
      editingAccount: null,
      editAccountName: "",
      editAccountBalance: 0,
      editAccountTarget: 0,
      editSelectedIcon: DEFAULT_ICON,
    }),
  setEditAccountName: (name) => set({ editAccountName: name }),
  setEditAccountBalance: (balance) => set({ editAccountBalance: balance }),
  setEditAccountTarget: (target) => set({ editAccountTarget: target }),
  setEditSelectedIcon: (icon) => set({ editSelectedIcon: icon }),
}));