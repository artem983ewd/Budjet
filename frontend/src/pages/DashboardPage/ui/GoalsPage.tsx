import { Box, Stack, Text, Group, Progress, Button, Slider, NumberInput, Loader, Center, Paper, ActionIcon, Modal } from "@mantine/core";
import { IconPlus, IconTrash, IconTarget } from "@tabler/icons-react";
import { useGoals, useCreateGoal, useUpdateGoal, useDeleteGoal } from "@/features/Goals/hooks";
import { useState } from "react";
import { CreateGoalDto } from "@/entities/Goal";

export function GoalsPage() {
  const { data: goals = [], isLoading } = useGoals();
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  const [modalOpened, setModalOpened] = useState(false);
  const [newGoalName, setNewGoalName] = useState("");
  const [newGoalTarget, setNewGoalTarget] = useState<number | "">(10000);

  const handleCreateGoal = () => {
    if (!newGoalName || !newGoalTarget) return;
    createGoal.mutate({ name: newGoalName, target_amount: Number(newGoalTarget), current_amount: 0 });
    setNewGoalName("");
    setNewGoalTarget(10000);
    setModalOpened(false);
  };

  const handleContribution = (goalId: number, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    const newCurrent = Math.min(goal.current_amount + amount, goal.target_amount);
    updateGoal.mutate({ id: goalId, data: { current_amount: newCurrent } });
  };

  const handleDelete = (goalId: number) => {
    deleteGoal.mutate(goalId);
  };

  if (isLoading) {
    return (
      <Center style={{ height: "100%" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Box p="md" style={{ width: "100%", maxWidth: "600px", margin: "auto" }}>
      <Stack gap="lg">
        <Group justify="space-between">
          <Text size="xl" fw={700}>Накопления</Text>
          <Button leftSection={<IconPlus size={18} />} onClick={() => setModalOpened(true)}>
            Новая цель
          </Button>
        </Group>

        {goals.length === 0 ? (
          <Paper withBorder p="xl" radius="md" ta="center">
            <Text c="dimmed">Нет целей накоплений</Text>
            <Text c="dimmed" size="sm">Создайте цель и начните копить!</Text>
          </Paper>
        ) : (
          goals.map((goal) => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onContribute={handleContribution}
              onDelete={handleDelete}
            />
          ))
        )}
      </Stack>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Новая цель" centered>
        <Stack>
          <NumberInput
            label="Название"
            placeholder="На машину, Отпуск..."
            value={newGoalName}
            onChange={(val) => setNewGoalName(String(val))}
          />
          <NumberInput
            label="Целевая сумма"
            placeholder="10000"
            value={newGoalTarget}
            onChange={(val) => setNewGoalTarget(val as number | "")}
            min={100}
            prefix="₽ "
          />
          <Button fullWidth onClick={handleCreateGoal}>Создать</Button>
        </Stack>
      </Modal>
    </Box>
  );
}

interface GoalCardProps {
  goal: { id: number; name: string; current_amount: number; target_amount: number };
  onContribute: (goalId: number, amount: number) => void;
  onDelete: (goalId: number) => void;
}

function GoalCard({ goal, onContribute, onDelete }: GoalCardProps) {
  const [sliderValue, setSliderValue] = useState(0);
  const progress = (goal.current_amount / goal.target_amount) * 100;

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="xs">
        <Group gap="xs">
          <IconTarget size={20} color="var(--mantine-color-blue-6)" />
          <Text fw={600}>{goal.name}</Text>
        </Group>
        <ActionIcon variant="subtle" color="gray" onClick={() => onDelete(goal.id)}>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>

      <Progress value={progress} size="lg" radius="sm" mb="xs" color="blue" />
      
      <Group justify="space-between" mb="md">
        <Text size="sm" fw={500} c="blue">{goal.current_amount.toLocaleString()} ₽</Text>
        <Text size="sm" c="dimmed">{goal.target_amount.toLocaleString()} ₽</Text>
      </Group>

      <Stack gap="xs">
        <Slider
          value={sliderValue}
          onChange={setSliderValue}
          min={0}
          max={goal.target_amount - goal.current_amount}
          step={100}
          label={`${sliderValue} ₽`}
        />
        <Button 
          variant="light" 
          fullWidth
          disabled={sliderValue === 0}
          onClick={() => {
            onContribute(goal.id, sliderValue);
            setSliderValue(0);
          }}
        >
          Пополнить на {sliderValue} ₽
        </Button>
      </Stack>
    </Paper>
  );
}
