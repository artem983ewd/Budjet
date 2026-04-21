import { useState } from "react";
import {
  Box,
  Stack,
  Text,
  Group,
  Paper,
  Select,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import { IconChartBar } from "@tabler/icons-react";

type AnalyticsType = "weekly" | "byCategory" | "incomeVsExpense" | "monthly";

interface ChartDataItem {
  label: string;
  value: number;
}

const mockData: Record<AnalyticsType, ChartDataItem[]> = {
  weekly: [
    { label: "Пн", value: 2500 },
    { label: "Вт", value: 3200 },
    { label: "Ср", value: 1800 },
    { label: "Чт", value: 4100 },
    { label: "Пт", value: 2900 },
    { label: "Сб", value: 4500 },
    { label: "Вс", value: 3600 },
  ],
  byCategory: [
    { label: "Продукты", value: 12500 },
    { label: "Транспорт", value: 3800 },
    { label: "Развлечения", value: 7200 },
    { label: "Коммуналка", value: 9500 },
    { label: "Здоровье", value: 4100 },
  ],
  incomeVsExpense: [
    { label: "Доходы", value: 85000 },
    { label: "Расходы", value: 52000 },
  ],
  monthly: [
    { label: "Нед 1", value: 18500 },
    { label: "Нед 2", value: 22300 },
    { label: "Нед 3", value: 16800 },
    { label: "Нед 4", value: 24100 },
  ],
};

const analyticsOptions = [
  { value: "weekly", label: "Средняя трата за неделю" },
  { value: "byCategory", label: "Траты по категориям" },
  { value: "incomeVsExpense", label: "Доходы vs Расходы" },
  { value: "monthly", label: "Динамика за месяц" },
];

function BarChart({ data, type }: { data: ChartDataItem[]; type: AnalyticsType }) {
  const maxValue = Math.max(...data.map((d) => d.value));

  const getBarColor = (index: number) => {
    if (type === "incomeVsExpense") {
      return index === 0 ? "green" : "red";
    }
    return "blue";
  };

  return (
    <Box>
      <Stack gap="sm">
        {data.map((item, index) => {
          const barWidth = (item.value / maxValue) * 100;
          const color = getBarColor(index);

          return (
            <Group key={item.label} gap="md" align="center">
              <Text size="sm" fw={500} w={100} ta="right">
                {item.label}
              </Text>
              <Box
                style={{
                  flex: 1,
                  height: 32,
                  width: `${barWidth}%`,
                  backgroundColor: `var(--mantine-color-${color}-5)`,
                  borderRadius: "0 4px 4px 0",
                  minWidth: 4,
                  transition: "width 0.3s ease",
                }}
              />
              <Text size="sm" fw={500} w={90} ta="left">
                {item.value.toLocaleString()} ₽
              </Text>
            </Group>
          );
        })}
      </Stack>
    </Box>
  );
}

export function AnalyticsPage() {
  const [analyticsType, setAnalyticsType] = useState<AnalyticsType>("weekly");

  const data = mockData[analyticsType];

  return (
    <Box p="md" style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconChartBar size={24} color="var(--mantine-color-blue-5)" />
            <Title order={2}>Аналитика</Title>
          </Group>
        </Group>

        <Select
          label="Тип аналитики"
          placeholder="Выберите тип аналитики"
          data={analyticsOptions}
          value={analyticsType}
          onChange={(value) => setAnalyticsType(value as AnalyticsType)}
          size="md"
        />

        <Paper shadow="xs" p="xl" radius="md" withBorder>
          <Stack gap="md">
            <Text fw={600} size="lg">
              {analyticsOptions.find((o) => o.value === analyticsType)?.label}
            </Text>
            <BarChart data={data} type={analyticsType} />
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
