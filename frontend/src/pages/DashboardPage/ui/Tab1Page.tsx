import React, { useState } from "react";
import {
  Accordion,
  Group,
  Text,
  ActionIcon,
  TextInput,
  UnstyledButton,
  rem,
  Box,
  Modal,
  SimpleGrid,
  Button,
  Stack,
  Badge,
  Paper,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconPlus,
  IconToolsKitchen2,
  IconShoppingCart,
  IconCoffee,
  IconCurrencyRubel,
  IconCar,
  IconDeviceGamepad2,
  IconHeart,
  IconHome,
  IconShirt,
  IconStethoscope,
  IconGift,
  IconTools,
  IconTrash,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";

// --- Настройки и Типы ---
const AVAILABLE_ICONS = [
  { name: "food", component: IconToolsKitchen2 },
  { name: "coffee", component: IconCoffee },
  { name: "shop", component: IconShoppingCart },
  { name: "car", component: IconCar },
  { name: "game", component: IconDeviceGamepad2 },
  { name: "health", component: IconStethoscope },
  { name: "home", component: IconHome },
  { name: "clothes", component: IconShirt },
  { name: "gift", component: IconGift },
  { name: "work", component: IconTools },
];

interface Transaction {
  id: string;
  subCategoryId: string;
  amount: number;
  at: Date;
}

interface SubCategory {
  id: string;
  name: string;
  iconName: string;
}

interface MainCategory {
  id: string;
  name: string;
  iconName: string;
  subCategories: SubCategory[];
}

export function Tab1Page() {
  // --- Состояния ---
  const [categories, setCategories] = useState<MainCategory[]>([
    {
      id: "cat-1",
      name: "Еда",
      iconName: "food",
      subCategories: [
        { id: "sub-1", name: "Кафе", iconName: "coffee" },
        { id: "sub-2", name: "Магазин", iconName: "shop" },
      ],
    },
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  const [amountValue, setAmountValue] = useState("");

  // Состояние для скрытия списка транзакций
  const [hiddenSubs, setHiddenSubs] = useState<Set<string>>(new Set());

  // Модалки для добавления категорий
  const [mainModalOpened, mainModalActions] = useDisclosure(false);
  const [subModalOpened, subModalActions] = useDisclosure(false);

  const [activeMainCatId, setActiveMainCatId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("food");

  // --- Логика вычислений ---
  const getSubTotal = (subId: string) =>
    transactions
      .filter((t) => t.subCategoryId === subId)
      .reduce((sum, t) => sum + t.amount, 0);

  const getMainTotal = (mainCat: MainCategory) =>
    mainCat.subCategories.reduce((sum, sub) => sum + getSubTotal(sub.id), 0);

  // --- Обработчики ---
  const handleSaveAmount = (subId: string) => {
    const val = parseFloat(amountValue);
    if (!isNaN(val) && val > 0) {
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        subCategoryId: subId,
        amount: val,
        at: new Date(),
      };
      setTransactions([newTransaction, ...transactions]);
    }
    setEditingSubId(null);
    setAmountValue("");
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // Удаление основной категории (и всех её подкатегорий + транзакций)
  const deleteMainCategory = (catId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Находим все subCategoryIds, которые будут удалены
    const cat = categories.find((c) => c.id === catId);
    if (!cat) return;

    const subIdsToDelete = cat.subCategories.map((sub) => sub.id);

    // Удаляем категорию
    setCategories(categories.filter((c) => c.id !== catId));

    // Удаляем все транзакции, связанные с подкатегориями этой категории
    setTransactions(
      transactions.filter((t) => !subIdsToDelete.includes(t.subCategoryId)),
    );

    // Если сейчас редактируется подкатегория из удаляемой категории — сбрасываем
    if (subIdsToDelete.includes(editingSubId || "")) {
      setEditingSubId(null);
      setAmountValue("");
    }

    // Удаляем из hiddenSubs
    setHiddenSubs((prev) => {
      const newSet = new Set(prev);
      subIdsToDelete.forEach((id) => newSet.delete(id));
      return newSet;
    });
  };

  // Удаление подкатегории (и её транзакций)
  const deleteSubCategory = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();

    // Удаляем подкатегорию из категорий
    setCategories(
      categories.map((cat) => ({
        ...cat,
        subCategories: cat.subCategories.filter((sub) => sub.id !== subId),
      })),
    );

    // Удаляем транзакции этой подкатегории
    setTransactions(transactions.filter((t) => t.subCategoryId !== subId));

    // Если сейчас редактируется эта подкатегория — сбрасываем
    if (editingSubId === subId) {
      setEditingSubId(null);
      setAmountValue("");
    }

    // Удаляем из hiddenSubs
    setHiddenSubs((prev) => {
      const newSet = new Set(prev);
      newSet.delete(subId);
      return newSet;
    });
  };

  // Переключение видимости списка транзакций
  const toggleSubTransactions = (subId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHiddenSubs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(subId)) {
        newSet.delete(subId);
      } else {
        newSet.add(subId);
      }
      return newSet;
    });
  };

  // Добавление основной категории
  const handleAddMainCategory = () => {
    if (!newName.trim()) return;
    const newCat: MainCategory = {
      id: Date.now().toString(),
      name: newName,
      iconName: selectedIcon,
      subCategories: [],
    };
    setCategories([...categories, newCat]);
    setNewName("");
    setSelectedIcon("food");
    mainModalActions.close();
  };

  // Добавление подкатегории
  const handleAddSub = () => {
    if (!newName.trim() || !activeMainCatId) return;
    setCategories(
      categories.map((c) =>
        c.id === activeMainCatId
          ? {
              ...c,
              subCategories: [
                ...c.subCategories,
                {
                  id: Date.now().toString(),
                  name: newName,
                  iconName: selectedIcon,
                },
              ],
            }
          : c,
      ),
    );
    setNewName("");
    setSelectedIcon("food");
    subModalActions.close();
  };

  const getIcon = (name: string, size = 16) => {
    const Icon =
      AVAILABLE_ICONS.find((i) => i.name === name)?.component || IconPlus;
    return <Icon size={size} />;
  };

  return (
    <Box p="md" style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
      <Stack gap="lg">
        <Group justify="space-between">
          <Text size="xl" fw={700}>
            Мой Бюджет
          </Text>
          <Badge size="lg" variant="light" color="blue">
            Всего: {transactions.reduce((s, t) => s + t.amount, 0)} ₽
          </Badge>
        </Group>

        {/* Кнопка добавления основной категории */}
        <Button
          variant="light"
          leftSection={<IconPlus size={18} />}
          onClick={mainModalActions.open}
          fullWidth
        >
          Добавить категорию
        </Button>

        <Accordion variant="separated" radius="md">
          {categories.map((cat) => (
            <Accordion.Item key={cat.id} value={cat.id}>
              <Accordion.Control>
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    {getIcon(cat.iconName, 20)}
                    <Stack gap={0}>
                      <Text fw={600} size="sm">
                        {cat.name}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {getMainTotal(cat)} ₽
                      </Text>
                    </Stack>
                  </Group>
                  <Group gap="xs">
                    {/* Кнопка добавления подкатегории */}
                    <ActionIcon
                      variant="subtle"
                      color="gray"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMainCatId(cat.id);
                        subModalActions.open();
                      }}
                    >
                      <IconPlus size={18} />
                    </ActionIcon>

                    {/* Кнопка удаления категории */}
                    <Tooltip label="Удалить категорию" withArrow>
                      <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={(e) => deleteMainCategory(cat.id, e)}
                      >
                        <IconTrash size={18} />
                      </ActionIcon>
                    </Tooltip>
                  </Group>
                </Group>
              </Accordion.Control>

              <Accordion.Panel>
                <Stack gap="xs">
                  {cat.subCategories.map((sub) => {
                    const isHidden = hiddenSubs.has(sub.id);
                    const hasTransactions = getSubTotal(sub.id) > 0;

                    return (
                      <Paper
                        key={sub.id}
                        withBorder
                        p={0}
                        radius="sm"
                        style={{ overflow: "hidden" }}
                      >
                        {editingSubId === sub.id ? (
                          <TextInput
                            placeholder="0.00"
                            variant="filled"
                            autoFocus
                            type="number"
                            inputMode="decimal"
                            value={amountValue}
                            onChange={(e) =>
                              setAmountValue(e.currentTarget.value)
                            }
                            leftSection={<IconCurrencyRubel size={16} />}
                            onBlur={() => handleSaveAmount(sub.id)}
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleSaveAmount(sub.id)
                            }
                          />
                        ) : (
                          <UnstyledButton
                            onClick={() => setEditingSubId(sub.id)}
                            style={{ width: "100%", padding: rem(10) }}
                          >
                            <Group justify="space-between">
                              <Group gap="xs">
                                <Box opacity={0.6}>{getIcon(sub.iconName)}</Box>
                                <Text size="sm">{sub.name}</Text>
                              </Group>
                              <Group gap="xs">
                                <Text size="sm" fw={500}>
                                  {getSubTotal(sub.id)} ₽
                                </Text>
                                {/* Стрелка справа от суммы */}
                                {hasTransactions && (
                                  <ActionIcon
                                    variant="subtle"
                                    color="gray"
                                    size="xs"
                                    onClick={(e) =>
                                      toggleSubTransactions(sub.id, e)
                                    }
                                  >
                                    {isHidden ? (
                                      <IconChevronRight size={14} />
                                    ) : (
                                      <IconChevronDown size={14} />
                                    )}
                                  </ActionIcon>
                                )}
                              </Group>
                            </Group>
                          </UnstyledButton>
                        )}

                        {/* Кнопка удаления подкатегории */}
                        <Group justify="flex-end" px="xs" pb="xs" gap={4}>
                          <Tooltip label="Удалить подкатегорию" withArrow>
                            <ActionIcon
                              variant="subtle"
                              color="red"
                              size="xs"
                              onClick={(e) => deleteSubCategory(sub.id, e)}
                            >
                              <IconTrash size={12} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>

                        {/* Список последних транзакций внутри подкатегории */}
                        {!isHidden && (
                          <Stack gap={4} p={hasTransactions ? "xs" : 0}>
                            {transactions
                              .filter((t) => t.subCategoryId === sub.id)
                              .map((t) => (
                                <Group
                                  key={t.id}
                                  justify="space-between"
                                  wrap="nowrap"
                                >
                                  <Text size="xs" c="dimmed">
                                    {t.at.toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}{" "}
                                    — {t.amount} ₽
                                  </Text>
                                  <ActionIcon
                                    variant="subtle"
                                    color="red"
                                    size="xs"
                                    onClick={() => deleteTransaction(t.id)}
                                  >
                                    <IconTrash size={12} />
                                  </ActionIcon>
                                </Group>
                              ))}
                          </Stack>
                        )}
                      </Paper>
                    );
                  })}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      </Stack>

      {/* Модалка для добавления основной категории */}
      <Modal
        opened={mainModalOpened}
        onClose={() => {
          mainModalActions.close();
          setNewName("");
          setSelectedIcon("food");
        }}
        title="Новая категория"
        centered
      >
        <Stack>
          <TextInput
            label="Название"
            placeholder="Еда, Транспорт..."
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
          />
          <SimpleGrid cols={5} spacing="xs">
            {AVAILABLE_ICONS.map((icon) => (
              <ActionIcon
                key={icon.name}
                size="xl"
                variant={selectedIcon === icon.name ? "filled" : "light"}
                onClick={() => setSelectedIcon(icon.name)}
              >
                <icon.component size={20} />
              </ActionIcon>
            ))}
          </SimpleGrid>
          <Button fullWidth onClick={handleAddMainCategory}>
            Создать
          </Button>
        </Stack>
      </Modal>

      {/* Модалка для добавления подкатегории */}
      <Modal
        opened={subModalOpened}
        onClose={() => {
          subModalActions.close();
          setNewName("");
          setSelectedIcon("food");
        }}
        title="Новая подкатегория"
        centered
      >
        <Stack>
          <TextInput
            label="Название"
            placeholder="Кафе, Магазин..."
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
          />
          <SimpleGrid cols={5} spacing="xs">
            {AVAILABLE_ICONS.map((icon) => (
              <ActionIcon
                key={icon.name}
                size="xl"
                variant={selectedIcon === icon.name ? "filled" : "light"}
                onClick={() => setSelectedIcon(icon.name)}
              >
                <icon.component size={20} />
              </ActionIcon>
            ))}
          </SimpleGrid>
          <Button fullWidth onClick={handleAddSub}>
            Создать
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
