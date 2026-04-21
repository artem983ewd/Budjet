import {
  Group,
  ActionIcon,
  Text,
  Box,
  Popover,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useSelectedMonth } from "../model/monthStore";
import { useState } from "react";

const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export function MonthPicker() {
  const { selectedMonth, setSelectedMonth } = useSelectedMonth();
  const [opened, setOpened] = useState(false);

  const year = selectedMonth.getFullYear();
  const month = selectedMonth.getMonth();

  const goToPrevMonth = () => {
    setSelectedMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedMonth(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const now = new Date();
    setSelectedMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    setOpened(false);
  };

  const selectMonth = (m: number) => {
    setSelectedMonth(new Date(year, m, 1));
    setOpened(false);
  };

  return (
    <Popover
      opened={opened}
      onChange={setOpened}
      position="bottom-start"
      withArrow
      shadow="md"
    >
      <Popover.Target>
        <Box
          onClick={() => setOpened((o) => !o)}
          style={{
            cursor: "pointer",
            padding: "8px 16px",
            borderRadius: "8px",
            border: "1px solid var(--mantine-color-gray-3)",
          }}
        >
          <Group justify="space-between" gap="md">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={(e) => {
                e.stopPropagation();
                goToPrevMonth();
              }}
            >
              <IconChevronLeft size={18} />
            </ActionIcon>
            <Text fw={500}>
              {MONTHS[month]} {year}
            </Text>
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={(e) => {
                e.stopPropagation();
                goToNextMonth();
              }}
            >
              <IconChevronRight size={18} />
            </ActionIcon>
          </Group>
        </Box>
      </Popover.Target>
      <Popover.Dropdown>
        <Stack gap="xs">
          <Group justify="space-between" mb="xs">
            <ActionIcon
              variant="subtle"
              onClick={() => setSelectedMonth(new Date(year - 1, month, 1))}
            >
              <IconChevronLeft size={16} />
            </ActionIcon>
            <Text fw={600}>{year}</Text>
            <ActionIcon
              variant="subtle"
              onClick={() => setSelectedMonth(new Date(year + 1, month, 1))}
            >
              <IconChevronRight size={16} />
            </ActionIcon>
          </Group>
          <SimpleGrid cols={3} spacing="xs">
            {MONTHS.map((name, index) => (
              <Box
                key={name}
                onClick={() => selectMonth(index)}
                style={{
                  padding: "8px 4px",
                  textAlign: "center",
                  borderRadius: "6px",
                  cursor: "pointer",
                  backgroundColor:
                    month === index
                      ? "var(--mantine-color-blue-1)"
                      : "transparent",
                  color:
                    month === index ? "var(--mantine-color-blue-6)" : "inherit",
                  fontWeight: month === index ? 600 : 400,
                }}
              >
                {name.slice(0, 3)}
              </Box>
            ))}
          </SimpleGrid>
          <Text
            size="sm"
            c="blue"
            ta="center"
            style={{ cursor: "pointer" }}
            onClick={goToToday}
          >
            Сегодня
          </Text>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
}
