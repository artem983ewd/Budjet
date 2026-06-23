import { useState, useEffect } from "react";
import { Group, SegmentedControl, TextInput, Stack } from "@mantine/core";

type Preset = "week" | "month" | "custom";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangeSelectorProps {
  onRangeChange: (range: DateRange) => void;
  initialRange?: DateRange;
}

function getPresetRange(preset: Preset): DateRange {
  const end = new Date();
  const start = new Date();

  if (preset === "week") {
    start.setDate(end.getDate() - 7);
  } else if (preset === "month") {
    start.setDate(end.getDate() - 30);
  }

  return {
    startDate: toLocalDateString(start),
    endDate: toLocalDateString(end),
  };
}

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DateRangeSelector({ onRangeChange, initialRange }: DateRangeSelectorProps) {
  const [preset, setPreset] = useState<Preset>("week");
  const [startInput, setStartInput] = useState(initialRange?.startDate || toLocalDateString(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
  const [endInput, setEndInput] = useState(initialRange?.endDate || toLocalDateString(new Date()));

  useEffect(() => {
    if (preset !== "custom") {
      const range = getPresetRange(preset);
      setStartInput(range.startDate);
      setEndInput(range.endDate);
      onRangeChange(range);
    }
  }, [preset]);

  const handleStartChange = (value: string) => {
    setStartInput(value);
    if (value && endInput) {
      onRangeChange({ startDate: value, endDate: endInput });
    }
  };

  const handleEndChange = (value: string) => {
    setEndInput(value);
    if (startInput && value) {
      onRangeChange({ startDate: startInput, endDate: value });
    }
  };

  return (
    <Stack gap="sm">
      <SegmentedControl
        value={preset}
        onChange={(value) => setPreset(value as Preset)}
        data={[
          { value: "week", label: "Неделя" },
          { value: "month", label: "Месяц" },
          { value: "custom", label: "Произвольный" },
        ]}
      />
      {preset === "custom" && (
        <Group gap="md">
          <TextInput
            type="date"
            label="От"
            value={startInput}
            onChange={(e) => handleStartChange(e.currentTarget.value)}
            w={160}
          />
          <TextInput
            type="date"
            label="До"
            value={endInput}
            onChange={(e) => handleEndChange(e.currentTarget.value)}
            w={160}
          />
        </Group>
      )}
    </Stack>
  );
}