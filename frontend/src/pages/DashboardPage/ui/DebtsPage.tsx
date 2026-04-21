import {
  Box,
  Stack,
  Text,
  Group,
  Button,
  Loader,
  Center,
  Paper,
  ActionIcon,
  Modal,
  NumberInput,
  TextInput,
  SimpleGrid,
  Progress,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconTrash, IconEdit, IconCurrencyRubel } from "@tabler/icons-react";
import {
  useDebts,
  useCreateDebt,
  useUpdateDebt,
  useDeleteDebt,
  useDebtsStore,
} from "@/features/Debts";
import { IconRenderer, IconSelector, IconName } from "@/shared/ui/IconRenderer";
import { useState } from "react";

function DebtIcon({
  name,
  size = 24,
}: {
  name: IconName | null;
  size?: number;
}) {
  if (!name) {
    return <IconRenderer name="gift" size={size} />;
  }
  return <IconRenderer name={name} size={size} />;
}

interface DebtCardProps {
  debt: {
    id: number;
    name: string;
    total_debt: number;
    remaining_debt: number;
    icon: IconName | null;
  };
  paid: number;
  progress: number;
  onEdit: () => void;
  onDelete: () => void;
  onPay: (amount: number) => void;
}

function DebtCard({ debt, paid, progress, onEdit, onDelete, onPay }: DebtCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const remaining = Number(debt.remaining_debt);
  const total = Number(debt.total_debt);

  const handleSaveAmount = () => {
    const val = parseFloat(payAmount);
    if (!isNaN(val) && val > 0 && val <= remaining) {
      onPay(val);
    }
    setIsEditing(false);
    setPayAmount("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPayAmount("");
  };

  const handleQuickPay = () => {
    if (remaining > 0) {
      onPay(remaining);
    }
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb="sm">
        <Group gap="sm">
          <DebtIcon name={debt.icon as IconName | null} />
          <Text fw={600}>{debt.name}</Text>
        </Group>
        <Group gap="xs">
          <Tooltip label="Удалить" withArrow>
            <ActionIcon variant="subtle" color="gray" onClick={onDelete}>
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Редактировать" withArrow>
            <ActionIcon variant="subtle" color="gray" onClick={onEdit}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>

      <Progress value={progress} size="lg" radius="sm" mb="md" color="blue" />

      <Group justify="space-between" align="flex-end">
        <Stack gap={4}>
          <Text size="xs" c="dimmed">Осталось</Text>
          <Text size="lg" fw={700} c="blue">{remaining.toLocaleString()} ₽</Text>
        </Stack>
        
        {isEditing ? (
          <Group gap="xs" align="flex-end">
            <TextInput
              placeholder="0.00"
              variant="filled"
              autoFocus
              size="sm"
              type="number"
              inputMode="decimal"
              value={payAmount}
              onChange={(e) => setPayAmount(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSaveAmount();
                if (e.key === "Escape") handleCancel();
              }}
              leftSection={<IconCurrencyRubel size={14} />}
              style={{ width: 100 }}
            />
            <Button size="sm" onClick={handleSaveAmount}>OK</Button>
            <Button size="sm" variant="subtle" onClick={handleCancel}>✕</Button>
          </Group>
        ) : (
          <Group gap="xs">
            <Button 
              size="sm" 
              variant="light" 
              color="green"
              onClick={() => setIsEditing(true)}
            >
              Погасить
            </Button>
            {remaining === total && remaining > 0 && (
              <Button size="sm" color="green" onClick={handleQuickPay}>
                Полностью
              </Button>
            )}
          </Group>
        )}
      </Group>

      <Group justify="space-between" mt="sm">
        <Text size="xs" c="dimmed">
          Погашено: {paid.toLocaleString()} ₽
        </Text>
        <Text size="xs" c="dimmed">
          из {total.toLocaleString()} ₽
        </Text>
      </Group>
    </Paper>
  );
}

export function DebtsPage() {
  const { data: debts = [], isLoading } = useDebts();
  const createDebt = useCreateDebt();
  const updateDebt = useUpdateDebt();
  const deleteDebt = useDeleteDebt();

  const {
    createModalOpened,
    newDebtName,
    newDebtTotal,
    newDebtRemaining,
    selectedIcon,
    editModalOpened,
    editingDebt,
    editDebtName,
    editDebtTotal,
    editDebtRemaining,
    editSelectedIcon,
    openCreateModal,
    closeCreateModal,
    setNewDebtName,
    setNewDebtTotal,
    setNewDebtRemaining,
    setSelectedIcon,
    openEditModal,
    closeEditModal,
    setEditDebtName,
    setEditDebtTotal,
    setEditDebtRemaining,
    setEditSelectedIcon,
  } = useDebtsStore();

  const handleCreateDebt = () => {
    if (!newDebtName || !newDebtTotal) return;
    createDebt.mutate({
      name: newDebtName,
      total_debt: Number(newDebtTotal),
      remaining_debt: Number(newDebtRemaining) || Number(newDebtTotal),
      icon: selectedIcon,
    });
    closeCreateModal();
  };

  const handleUpdateDebt = () => {
    if (!editingDebt || !editDebtName) return;
    updateDebt.mutate({
      id: editingDebt.id,
      data: {
        name: editDebtName,
        total_debt: Number(editDebtTotal),
        remaining_debt: Number(editDebtRemaining),
        icon: editSelectedIcon,
      },
    });
    closeEditModal();
  };

  const handlePayDebt = (debtId: number, amount: number) => {
    const debt = debts.find((d) => d.id === debtId);
    if (!debt) return;
    const newRemaining = Math.max(0, Number(debt.remaining_debt) - amount);
    updateDebt.mutate({
      id: debtId,
      data: { remaining_debt: newRemaining },
    });
  };

  const handleDelete = (debtId: number) => {
    deleteDebt.mutate(debtId);
  };

  const totalDebt = debts.reduce((sum, d) => sum + Number(d.total_debt), 0);
  const totalRemaining = debts.reduce(
    (sum, d) => sum + Number(d.remaining_debt),
    0
  );
  const totalPaid = totalDebt - totalRemaining;

  if (isLoading) {
    return (
      <Center style={{ height: "100%" }}>
        <Loader />
      </Center>
    );
  }

  return (
    <Box
      p="md"
      style={{ width: "100%", maxWidth: "600px", margin: "auto" }}
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Text size="xl" fw={700}>
            Долги
          </Text>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={openCreateModal}
          >
            Добавить долг
          </Button>
        </Group>

        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Общая сумма долга</Text>
              <Text fw={700} c="red">
                {totalDebt.toLocaleString()} ₽
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Осталось погасить</Text>
              <Text fw={700} c="red.5">
                {totalRemaining.toLocaleString()} ₽
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fw={500}>Погашено</Text>
              <Text fw={500} c="green">
                {totalPaid.toLocaleString()} ₽
              </Text>
            </Group>
          </Stack>
        </Paper>

        {debts.length === 0 ? (
          <Paper withBorder p="xl" radius="md" ta="center">
            <Text c="dimmed">Нет долгов</Text>
            <Text c="dimmed" size="sm">
              Добавьте долг для учёта
            </Text>
          </Paper>
        ) : (
          debts.map((debt) => {
            const paid =
              Number(debt.total_debt) - Number(debt.remaining_debt);
            const progress =
              Number(debt.total_debt) > 0
                ? (paid / Number(debt.total_debt)) * 100
                : 0;

            return (
              <DebtCard
                key={debt.id}
                debt={debt}
                paid={paid}
                progress={progress}
                onEdit={() => openEditModal(debt)}
                onDelete={() => handleDelete(debt.id)}
                onPay={(amount) => handlePayDebt(debt.id, amount)}
              />
            );
          })
        )}
      </Stack>

      {/* Create Modal */}
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Добавить долг"
        centered
      >
        <Stack>
          <TextInput
            label="Название"
            placeholder="Кредит, Долг другу..."
            value={newDebtName}
            onChange={(e) => setNewDebtName(e.currentTarget.value)}
          />
          <NumberInput
            label="Общая сумма"
            placeholder="50000"
            value={newDebtTotal}
            onChange={(val) => setNewDebtTotal(val as number | "")}
            prefix="₽ "
          />
          <NumberInput
            label="Оставшаяся сумма"
            placeholder="50000"
            value={newDebtRemaining}
            onChange={(val) => setNewDebtRemaining(val as number | "")}
            prefix="₽ "
          />
          <Text fw={500} size="sm">
            Иконка
          </Text>
          <IconSelector value={selectedIcon} onChange={setSelectedIcon} />
          <Button fullWidth onClick={handleCreateDebt}>
            Добавить
          </Button>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Редактировать долг"
        centered
      >
        <Stack>
          <TextInput
            label="Название"
            placeholder="Кредит, Долг другу..."
            value={editDebtName}
            onChange={(e) => setEditDebtName(e.currentTarget.value)}
          />
          <NumberInput
            label="Общая сумма"
            placeholder="50000"
            value={editDebtTotal}
            onChange={(val) => setEditDebtTotal(val as number | "")}
            prefix="₽ "
          />
          <NumberInput
            label="Оставшаяся сумма"
            placeholder="50000"
            value={editDebtRemaining}
            onChange={(val) => setEditDebtRemaining(val as number | "")}
            prefix="₽ "
          />
          <Text fw={500} size="sm">
            Иконка
          </Text>
          <IconSelector value={editSelectedIcon} onChange={setEditSelectedIcon} />
          <Button fullWidth onClick={handleUpdateDebt}>
            Сохранить
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}