import { MainCategory } from "@/entities/Category/model";
import { IconName } from "@/shared/ui/IconRenderer";

export interface DeleteItem {
  type: "category" | "subcategory";
  id: string;
  name: string;
  transactionsCount: number;
}

export interface Transaction {
  id: string;
  subCategoryId: string;
  amount: number;
  at: Date;
}

export interface DomainStore {
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