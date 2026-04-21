import { TextInput } from "@mantine/core";
import { useSelectedMonth } from "../model/monthStore";

export function MonthPicker() {
  const { selectedMonth, setSelectedMonth } = useSelectedMonth();

  const year = selectedMonth.getFullYear();
  const month = String(selectedMonth.getMonth() + 1).padStart(2, "0");
  const monthValue = `${year}-${month}`;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [y, m] = e.currentTarget.value.split("-");
    if (y && m) {
      setSelectedMonth(new Date(parseInt(y), parseInt(m) - 1, 1));
    }
  };

  return (
    <TextInput
      type="month"
      value={monthValue}
      onChange={handleChange}
      placeholder="Выберите месяц"
      styles={{
        input: {
          fontWeight: 500,
        },
      }}
    />
  );
}