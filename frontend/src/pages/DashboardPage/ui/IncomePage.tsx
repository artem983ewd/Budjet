import { Box, Stack, Group, Text, Badge, Button, Accordion, Loader, Center } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/features/Categories";
import { useTransactions, useCreateTransaction, useDeleteTransaction } from "@/features/Transactions/hooks";
import { useUIStore } from "@/features/BudgetUI";
import { CategoryAccordion } from "../../../widgets/CategoryAccordion";
import { AddSubCategoryModal } from "@/features/AddSubCategory";
import { DeleteConfirmationModal } from "@/features/DeleteConfirmation";
import { mapCategoriesToMain } from "@/features/Categories/utils/mapCategories";
import { MainCategory } from "@/entities/Category/model";
import { IconName } from "@/shared/ui/IconRenderer";
import { DomainStore, Transaction } from "@/features/BudgetUI/types/store";

export function IncomePage() {
  const { data: categoriesData = [], isLoading: isLoadingCategories } = useCategories();
  const { data: transactionsData = [], isLoading: isLoadingTransactions } = useTransactions();
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();
  const createTransaction = useCreateTransaction();
  const deleteTransaction = useDeleteTransaction();
  const openMainModal = useUIStore((s) => s.openMainModal);
  const setItemToDelete = useUIStore((s) => s.setItemToDelete);
  const itemToDelete = useUIStore((s) => s.itemToDelete);

  const categories = mapCategoriesToMain(categoriesData, "income");
  const transactions: Transaction[] = transactionsData
    .filter((t) => t.category.type === "income")
    .map((t) => ({
      id: String(t.id),
      subCategoryId: String(t.category.id),
      amount: Number(t.amount),
      at: new Date(t.transactionDate),
    }));
  const total = transactions.reduce((sum, t) => sum + t.amount, 0);

  const getSubTotal = (subId: string) =>
    transactions
      .filter((t) => t.subCategoryId === subId)
      .reduce((sum, t) => sum + t.amount, 0);

  const getMainTotal = (mainCat: MainCategory) =>
    mainCat.subCategories.reduce((sum, sub) => sum + getSubTotal(sub.id), 0);

  const store: DomainStore = {
    categories,
    transactions,
    itemToDelete,
    getSubTotal,
    getMainTotal,
    addTransaction: (subCategoryId: string, amount: number) => {
      createTransaction.mutate({
        categoryId: parseInt(subCategoryId),
        amount,
        transactionDate: new Date(),
      });
    },
    deleteTransaction: (id: string) => {
      deleteTransaction.mutate(parseInt(id));
    },
    addMainCategory: (name: string, icon: IconName) => {
      createCategory.mutate({ name, type: "income", icon });
    },
    addSubCategory: (name: string, icon: IconName, catId: string) => {
      createCategory.mutate({ name, type: "income", icon, parentId: parseInt(catId) });
    },
    confirmDeleteMainCategory: (catId: string) => {
      const cat = categories.find((c) => c.id === catId);
      if (!cat) return null;
      const subIds = cat.subCategories.map((s) => s.id);
      const transactionsCount = transactions.filter((t) => subIds.includes(t.subCategoryId)).length;
      const item = { type: "category" as const, id: catId, name: cat.name, transactionsCount };
      setItemToDelete(item);
      return item;
    },
    confirmDeleteSubCategory: (subId: string) => {
      let subName = "";
      for (const cat of categories) {
        const sub = cat.subCategories.find((s) => s.id === subId);
        if (sub) { subName = sub.name; break; }
      }
      const transactionsCount = transactions.filter((t) => t.subCategoryId === subId).length;
      const item = { type: "subcategory" as const, id: subId, name: subName, transactionsCount };
      setItemToDelete(item);
      return item;
    },
    setItemToDelete,
    handleDeleteConfirmed: () => {
      const item = useUIStore.getState().itemToDelete;
      if (!item) return;
      if (item.type === "category") {
        deleteCategory.mutate(parseInt(item.id));
      } else {
        deleteCategory.mutate(parseInt(item.id));
      }
    },
  };

  if (isLoadingCategories || isLoadingTransactions) {
    return (
      <Center style={{ height: "100%" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Box p="md" style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
      <Stack gap="lg">
        <Group justify="space-between">
          <Text size="xl" fw={700}>
            Доходы
          </Text>
          <Badge size="lg" variant="light" color="blue">
            Всего: {total} ₽
          </Badge>
        </Group>

        <Button
          variant="light"
          leftSection={<IconPlus size={18} />}
          onClick={openMainModal}
          fullWidth
        >
          Добавить категорию
        </Button>

        <Accordion variant="separated" radius="md">
          {store.categories.map((cat) => (
            <CategoryAccordion key={cat.id} cat={cat} store={store} />
          ))}
        </Accordion>
      </Stack>

      <AddSubCategoryModal addSubCategory={store.addSubCategory} />
      <DeleteConfirmationModal store={store} />
    </Box>
  );
}
