import { useState, useMemo } from "react";
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
  SimpleGrid,
  ThemeIcon,
} from "@mantine/core";
import { IconChartBar, IconTrendingUp, IconCategory } from "@tabler/icons-react";
import { DateRangeSelector } from "@/features/Analytics/ui/DateRangeSelector";
import { useTransactionsByDateRange } from "@/features/Transactions/hooks";
import { TransactionApi } from "@/features/Transactions/api";

type AnalyticsType = "weekly" | "byCategory" | "incomeVsExpense" | "monthly";

interface ChartDataItem {
  label: string;
  value: number;
}

const analyticsOptions = [
  { value: "weekly", label: "Средняя трата за неделю" },
  { value: "byCategory", label: "Траты по категориям" },
  { value: "incomeVsExpense", label: "Доходы vs Расходы" },
  { value: "monthly", label: "Динамика за месяц" },
];

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getDefaultDateRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 7);
  return {
    startDate: toLocalDateString(start),
    endDate: toLocalDateString(end),
  };
}

function BarChart({ data, type }: { data: ChartDataItem[]; type: AnalyticsType }) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);

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

function aggregateByDay(transactions: TransactionApi[]): ChartDataItem[] {
  const dayMap = new Map<string, number>();
  const dayNames = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

  transactions
    .filter((t) => t.category.type === "expense")
    .forEach((t) => {
      const date = new Date(t.transactionDate);
      const dayLabel = dayNames[date.getDay()];
      dayMap.set(dayLabel, (dayMap.get(dayLabel) || 0) + Number(t.amount));
    });

  return dayNames.map((day) => ({
    label: day,
    value: Math.round(dayMap.get(day) || 0),
  }));
}

function aggregateByCategory(transactions: TransactionApi[]): ChartDataItem[] {
  const catMap = new Map<string, number>();

  transactions
    .filter((t) => t.category.type === "expense")
    .forEach((t) => {
      const name = t.category.name;
      catMap.set(name, (catMap.get(name) || 0) + Number(t.amount));
    });

  return Array.from(catMap.entries())
    .map(([label, value]) => ({ label, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function aggregateIncomeVsExpense(transactions: TransactionApi[]): ChartDataItem[] {
  let income = 0;
  let expense = 0;

  transactions.forEach((t) => {
    if (t.category.type === "income") {
      income += Number(t.amount);
    } else {
      expense += Number(t.amount);
    }
  });

  return [
    { label: "Доходы", value: Math.round(income) },
    { label: "Расходы", value: Math.round(expense) },
  ];
}

function aggregateByWeek(transactions: TransactionApi[]): ChartDataItem[] {
  const weekMap = new Map<string, number>();

  transactions
    .filter((t) => t.category.type === "expense")
    .forEach((t) => {
      const date = new Date(t.transactionDate);
      const weekNum = getWeekNumber(date);
      const label = `Нед ${weekNum}`;
      weekMap.set(label, (weekMap.get(label) || 0) + Number(t.amount));
    });

  return Array.from(weekMap.entries())
    .map(([label, value]) => ({ label, value: Math.round(value) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

export function AnalyticsPage() {
  const [analyticsType, setAnalyticsType] = useState<AnalyticsType>("weekly");
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const { data: transactions, isLoading } = useTransactionsByDateRange(
    dateRange.startDate,
    dateRange.endDate,
  );

  const totalExpenses = useMemo(() => {
    if (!transactions) return 0;
    return transactions
      .filter((t) => t.category.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);
  }, [transactions]);

  const topCategories = useMemo(() => {
    if (!transactions) return [];
    return aggregateByCategory(transactions).slice(0, 5);
  }, [transactions]);

  const chartData = useMemo(() => {
    if (!transactions) {
      return {
        weekly: [],
        byCategory: [],
        incomeVsExpense: [],
        monthly: [],
      };
    }

    return {
      weekly: aggregateByDay(transactions),
      byCategory: aggregateByCategory(transactions),
      incomeVsExpense: aggregateIncomeVsExpense(transactions),
      monthly: aggregateByWeek(transactions),
    };
  }, [transactions]);

  const data = chartData[analyticsType];

  return (
    <Box p="md" style={{ width: "100%", maxWidth: "800px", margin: "auto" }}>
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            <IconChartBar size={24} color="var(--mantine-color-blue-5)" />
            <Title order={2}>Аналитика</Title>
          </Group>
        </Group>

        <DateRangeSelector onRangeChange={setDateRange} initialRange={dateRange} />

        <SimpleGrid cols={2}>
          <Paper shadow="xs" p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon variant="light" color="red" size="sm">
                  <IconTrendingUp size={14} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">Расходы за период</Text>
              </Group>
              <Text size="xl" fw={700}>
                {Math.round(totalExpenses).toLocaleString()} ₽
              </Text>
            </Stack>
          </Paper>
          <Paper shadow="xs" p="md" radius="md" withBorder>
            <Stack gap="xs">
              <Group gap="xs">
                <ThemeIcon variant="light" color="blue" size="sm">
                  <IconCategory size={14} />
                </ThemeIcon>
                <Text size="sm" c="dimmed">Топ категория</Text>
              </Group>
              <Text size="xl" fw={700}>
                {topCategories[0]?.label || "—"}
              </Text>
            </Stack>
          </Paper>
        </SimpleGrid>

        <Select
          label="Тип аналитики"
          placeholder="Выберите тип аналитики"
          data={analyticsOptions}
          value={analyticsType}
          onChange={(value) => setAnalyticsType(value as AnalyticsType)}
          size="md"
        />

        {isLoading ? (
          <Center p="xl">
            <Loader />
          </Center>
        ) : (
          <Paper shadow="xs" p="xl" radius="md" withBorder>
            <Stack gap="md">
              <Text fw={600} size="lg">
                {analyticsOptions.find((o) => o.value === analyticsType)?.label}
              </Text>
              {data.length > 0 ? (
                <BarChart data={data} type={analyticsType} />
              ) : (
                <Text c="dimmed" ta="center">Нет данных за выбранный период</Text>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}