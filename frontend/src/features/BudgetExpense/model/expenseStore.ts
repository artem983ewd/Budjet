import { create } from "zustand";
import { MainCategory } from "../../../entities/Category/model";
import { Transaction } from "../../../entities/Transaction/model";
import { IconName } from "../../../shared/ui/IconRenderer";

interface DeleteItem {
  type: "category" | "subcategory";
  id: string;
  name: string;
  transactionsCount: number;
}

interface DomainStore {
  categories: MainCategory[];
  transactions: Transaction[];
  itemToDelete: DeleteItem | null;

  getSubTotal: (subId: string) => number;
  getMainTotal: (mainCat: MainCategory) => number;

  addTransaction: (subId: string, amount: number) => void;
  deleteTransaction: (id: string) => void;

  addMainCategory: (name: string, icon: IconName) => void;
  addSubCategory: (name: string, icon: IconName, catId: string) => void;

  confirmDeleteMainCategory: (catId: string) => DeleteItem | null;
  confirmDeleteSubCategory: (subId: string) => DeleteItem | null;
  setItemToDelete: (item: DeleteItem | null) => void;
  handleDeleteConfirmed: () => void;
}

export const useExpenseStore = create<DomainStore>((set, get) => ({
  categories: [
    {
      id: "cat-exp-1",
      name: "Расходы",
      iconName: "work",
      subCategories: [],
    },
  ],
  transactions: [],
  itemToDelete: null,

  getSubTotal: (subId: string) =>
    get()
      .transactions.filter((t) => t.subCategoryId === subId)
      .reduce((sum, t) => sum + t.amount, 0),

  getMainTotal: (mainCat: MainCategory) =>
    mainCat.subCategories.reduce((sum, sub) => sum + get().getSubTotal(sub.id), 0),

  addTransaction: (subId, amount) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      subCategoryId: subId,
      amount,
      at: new Date(),
    };
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
  },

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  addMainCategory: (name, icon) => {
    if (!name.trim()) { return; }
    const newCat: MainCategory = {
      id: Date.now().toString(),
      name,
      iconName: icon,
      subCategories: [],
    };
    set((state) => ({ categories: [...state.categories, newCat] }));
  },

  addSubCategory: (name, icon, catId) => {
    if (!name.trim() || !catId) { return; }
    set({
      categories: get().categories.map((c) =>
        c.id === catId
          ? {
              ...c,
              subCategories: [
                ...c.subCategories,
                {
                  id: Date.now().toString(),
                  name,
                  iconName: icon,
                },
              ],
            }
          : c,
      ),
    });
  },

  confirmDeleteMainCategory: (catId) => {
    const { categories, transactions } = get();
    const cat = categories.find((c) => c.id === catId);
    if (!cat) { return null; }
    const subIds = cat.subCategories.map((sub) => sub.id);
    const transactionsCount = transactions.filter((t) =>
      subIds.includes(t.subCategoryId),
    ).length;
    const item: DeleteItem = { type: "category", id: catId, name: cat.name, transactionsCount };
    set({ itemToDelete: item });
    return item;
  },

  confirmDeleteSubCategory: (subId) => {
    const { categories, transactions } = get();
    let subName = "";
    for (const cat of categories) {
      const sub = cat.subCategories.find((s) => s.id === subId);
      if (sub) {
        subName = sub.name;
        break;
      }
    }
    const transactionsCount = transactions.filter((t) => t.subCategoryId === subId).length;
    const item: DeleteItem = { type: "subcategory", id: subId, name: subName, transactionsCount };
    set({ itemToDelete: item });
    return item;
  },

  setItemToDelete: (item) => set({ itemToDelete: item }),

  handleDeleteConfirmed: () => {
    const { itemToDelete, categories, transactions } = get();
    if (!itemToDelete) { return; }

    if (itemToDelete.type === "category") {
      const cat = categories.find((c) => c.id === itemToDelete.id);
      if (!cat) { return; }
      const subIdsToDelete = cat.subCategories.map((sub) => sub.id);

      set({ categories: categories.filter((c) => c.id !== itemToDelete.id) });
      set({
        transactions: transactions.filter((t) => !subIdsToDelete.includes(t.subCategoryId)),
      });
    } else {
      const subId = itemToDelete.id;
      set({
        categories: categories.map((cat) => ({
          ...cat,
          subCategories: cat.subCategories.filter((sub) => sub.id !== subId),
        })),
        transactions: transactions.filter((t) => t.subCategoryId !== subId),
      });
    }

    set({ itemToDelete: null });
  },
}));
