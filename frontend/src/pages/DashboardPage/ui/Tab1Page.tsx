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
} from "@tabler/icons-react";

// 1. Доступные иконки для выбора
const AVAILABLE_ICONS = [
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

interface SubCategory {
  id: string;
  name: string;
  iconName: string; // Храним только имя иконки
}

export function Tab1Page() {
  // --- Состояния для списка и ввода ---
  const [subCategories, setSubCategories] = useState<SubCategory[]>([
    { id: "1", name: "Кафе", iconName: "coffee" },
    { id: "2", name: "Магазин", iconName: "shop" },
  ]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amountValue, setAmountValue] = useState("");

  // --- Состояния для Модального окна (новая категория) ---
  const [opened, { open, close }] = useDisclosure(false);
  const [newCatName, setNewCatName] = useState("");
  const [selectedIconName, setSelectedIconName] = useState("coffee");

  // Функция сохранения суммы
  const handleSaveAmount = (id: string) => {
    if (amountValue.trim() !== "") {
      console.log(`Записано: ${amountValue} руб. в категорию ${id}`);
      // Тут логика сохранения транзакции
    }
    setEditingId(null);
    setAmountValue("");
  };

  // Функция добавления новой категории
  const handleAddCategory = () => {
    if (newCatName.trim() === "") return;

    const newCategory: SubCategory = {
      id: Date.now().toString(),
      name: newCatName,
      iconName: selectedIconName,
    };

    setSubCategories([...subCategories, newCategory]);
    setNewCatName("");
    close();
  };

  // Поиск иконки по имени
  const getIcon = (name: string) => {
    const IconData =
      AVAILABLE_ICONS.find((i) => i.name === name) || AVAILABLE_ICONS[0];
    return <IconData.component size={16} />;
  };

  return (
    <Box p="md">
      <Accordion variant="separated" radius="md">
        <Accordion.Item value="food">
          <Accordion.Control>
            <Group justify="space-between">
              <Group gap="sm">
                <IconToolsKitchen2 size={20} stroke={1.5} color="blue" />
                <Text fw={500}>Еда</Text>
              </Group>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation();
                  open(); // Открываем модалку создания
                }}
              >
                <IconPlus size={18} />
              </ActionIcon>
            </Group>
          </Accordion.Control>

          <Accordion.Panel>
            <Box pl="md">
              {subCategories.map((item) => (
                <Box key={item.id} mb={8}>
                  {editingId === item.id ? (
                    <TextInput
                      placeholder="0.00"
                      variant="filled"
                      size="md"
                      autoFocus
                      type="number"
                      inputMode="decimal"
                      value={amountValue}
                      onChange={(e) => setAmountValue(e.currentTarget.value)}
                      leftSection={<IconCurrencyRubel size={16} />}
                      onBlur={() => handleSaveAmount(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveAmount(item.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      styles={{ input: { fontSize: rem(16), fontWeight: 500 } }}
                    />
                  ) : (
                    <UnstyledButton
                      onClick={() => setEditingId(item.id)}
                      style={{
                        width: "100%",
                        padding: `${rem(10)} ${rem(12)}`,
                        borderRadius: "var(--mantine-radius-sm)",
                        transition: "background-color 0.2s ease",
                      }}
                      sx={(theme: any) => ({
                        "&:hover": { backgroundColor: theme.colors.gray[0] },
                      })}
                    >
                      <Group gap="xs">
                        <Box opacity={0.6}>{getIcon(item.iconName)}</Box>
                        <Text size="sm">{item.name}</Text>
                      </Group>
                    </UnstyledButton>
                  )}
                </Box>
              ))}
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>

      {/* --- МОДАЛЬНОЕ ОКНО СОЗДАНИЯ --- */}
      <Modal
        opened={opened}
        onClose={close}
        title="Новая подкатегория"
        centered
        radius="md"
      >
        <Stack gap="md">
          <TextInput
            label="Название"
            placeholder="Например: Доставка"
            value={newCatName}
            onChange={(e) => setNewCatName(e.currentTarget.value)}
          />

          <Text size="sm" fw={500} mb={-10}>
            Иконка
          </Text>
          <SimpleGrid cols={5} spacing="xs">
            {AVAILABLE_ICONS.map((icon) => (
              <ActionIcon
                key={icon.name}
                size="xl"
                variant={selectedIconName === icon.name ? "filled" : "light"}
                color={selectedIconName === icon.name ? "blue" : "gray"}
                onClick={() => setSelectedIconName(icon.name)}
              >
                <icon.component size={22} />
              </ActionIcon>
            ))}
          </SimpleGrid>

          <Button fullWidth onClick={handleAddCategory} mt="sm">
            Создать
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}
