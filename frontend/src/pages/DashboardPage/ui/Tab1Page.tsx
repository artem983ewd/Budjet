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
} from "@mantine/core";
import {
  IconPlus,
  IconToolsKitchen2,
  IconShoppingCart,
  IconCoffee,
  IconCurrencyRubel,
} from "@tabler/icons-react";

// Типизация для данных (если используете TypeScript)
interface SubCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export function Tab1Page() {
  // Состояние: ID редактируемой подкатегории (например, 'cafe')
  const [editingId, setEditingId] = useState<string | null>(null);
  // Состояние для временного значения ввода
  const [value, setValue] = useState("");

  // Список подкатегорий (можно будет загружать из БД)
  const subCategories: SubCategory[] = [
    { id: "cafe", name: "Кафе", icon: <IconCoffee size={16} /> },
    { id: "shop", name: "Магазин", icon: <IconShoppingCart size={16} /> },
  ];

  const handleSave = (id: string) => {
    if (value.trim() !== "") {
      console.log(`Сохранение: Подкатегория ${id}, Сумма: ${value}`);
      // Здесь ваша логика отправки данных на бэкенд или в стейт
    }
    setEditingId(null);
    setValue("");
  };

  return (
    <Box p="md">
      <Accordion variant="separated" radius="md">
        <Accordion.Item value="food">
          <Accordion.Control>
            <Group justify="space-between">
              <Group gap="sm">
                <IconToolsKitchen2
                  size={20}
                  stroke={1.5}
                  color="var(--mantine-color-blue-filled)"
                />
                <Text fw={500}>Еда</Text>
              </Group>
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={(e) => {
                  e.stopPropagation(); // Чтобы аккордеон не закрылся
                  console.log("Добавить новую подкатегорию");
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
                    /* ИНПУТ ДЛЯ МОБИЛЬНЫХ */
                    <TextInput
                      placeholder="0.00"
                      variant="filled"
                      size="md"
                      autoFocus
                      type="number"
                      inputMode="decimal" // Числовая клавиатура на телефоне
                      value={value}
                      onChange={(e) => setValue(e.currentTarget.value)}
                      leftSection={<IconCurrencyRubel size={16} />}
                      // Сохраняем, если пользователь нажал Enter или кликнул в другое место
                      onBlur={() => handleSave(item.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave(item.id);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                      styles={{
                        input: { fontSize: rem(16), fontWeight: 500 },
                      }}
                    />
                  ) : (
                    /* ОБЫЧНАЯ КНОПКА КАТЕГОРИИ */
                    <UnstyledButton
                      onClick={() => setEditingId(item.id)}
                      style={{
                        width: "100%",
                        padding: `${rem(10)} ${rem(12)}`,
                        borderRadius: "var(--mantine-radius-sm)",
                        transition: "background-color 0.2s ease",
                      }}
                      // Эффект наведения (через встроенные стили Mantine)
                      sx={(theme: any) => ({
                        "&:hover": { backgroundColor: theme.colors.gray[0] },
                      })}
                    >
                      <Group gap="xs">
                        <Box opacity={0.6}>{item.icon}</Box>
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
    </Box>
  );
}
