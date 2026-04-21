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
  UnstyledButton,
  Tooltip,
} from "@mantine/core";
import { IconPlus, IconTrash, IconEdit, IconCurrencyRubel } from "@tabler/icons-react";
import {
  useAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  useAccountsStore,
} from "@/features/Accounts";
import { IconRenderer, IconSelector, IconName } from "@/shared/ui/IconRenderer";
import { useState } from "react";

function AccountIcon({
  name,
  size = 24,
}: {
  name: IconName | null;
  size?: number;
}) {
  if (!name) {
    return <IconRenderer name="home" size={size} />;
  }
  return <IconRenderer name={name} size={size} />;
}

interface AccountCardProps {
  account: {
    id: number;
    name: string;
    balance: number;
    icon: IconName | null;
    target_amount: number | null;
  };
  target: number;
  balance: number;
  progress: number;
  onEdit: () => void;
  onDelete: () => void;
  onDeposit: (amount: number) => void;
}

function AccountCard({
  account,
  target,
  balance,
  progress,
  onEdit,
  onDelete,
  onDeposit,
}: AccountCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");

  const handleSaveAmount = () => {
    const val = parseFloat(depositAmount);
    if (!isNaN(val) && val > 0) {
      onDeposit(val);
    }
    setIsEditing(false);
    setDepositAmount("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setDepositAmount("");
  };

  return (
    <Paper withBorder p="md" radius="md">
      <Group justify="space-between" mb={target > 0 ? "xs" : 0}>
        <Group gap="sm">
          <AccountIcon name={account.icon as IconName | null} />
          <Text fw={500}>{account.name}</Text>
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

      <Group justify="space-between" mb={target > 0 ? "xs" : 0}>
        {isEditing ? (
          <TextInput
            placeholder="0.00"
            variant="filled"
            autoFocus
            size="sm"
            type="number"
            inputMode="decimal"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.currentTarget.value)}
            onBlur={handleSaveAmount}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveAmount();
              if (e.key === "Escape") handleCancel();
            }}
            leftSection={<IconCurrencyRubel size={14} />}
            style={{ width: 150 }}
          />
        ) : (
          <UnstyledButton onClick={() => setIsEditing(true)}>
            <Text fw={600} size="lg" c="teal">
              {balance.toLocaleString()} ₽
            </Text>
          </UnstyledButton>
        )}
        {target > 0 && (
          <Text size="sm" c="dimmed">
            цел: {target.toLocaleString()} ₽
          </Text>
        )}
      </Group>

      {target > 0 && (
        <>
          <Progress
            value={progress}
            size="sm"
            radius="sm"
            color="teal"
            mb="xs"
          />
          <Text size="xs" c="dimmed" ta="right">
            {progress.toFixed(0)}% накоплено
          </Text>
        </>
      )}
    </Paper>
  );
}

export function AccountsPage() {
  const {
    data: accounts = [],
    isLoading,
  } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();

  const {
    createModalOpened,
    newAccountName,
    newAccountBalance,
    newAccountTarget,
    selectedIcon,
    editModalOpened,
    editingAccount,
    editAccountName,
    editAccountBalance,
    editAccountTarget,
    editSelectedIcon,
    openCreateModal,
    closeCreateModal,
    setNewAccountName,
    setNewAccountBalance,
    setNewAccountTarget,
    setSelectedIcon,
    openEditModal,
    closeEditModal,
    setEditAccountName,
    setEditAccountBalance,
    setEditAccountTarget,
    setEditSelectedIcon,
  } = useAccountsStore();

  const handleCreateAccount = () => {
    if (!newAccountName) return;
    createAccount.mutate({
      name: newAccountName,
      balance: Number(newAccountBalance) || 0,
      icon: selectedIcon,
      target_amount: Number(newAccountTarget) || 0,
    });
    closeCreateModal();
  };

  const handleUpdateAccount = () => {
    if (!editingAccount || !editAccountName) return;
    updateAccount.mutate({
      id: editingAccount.id,
      data: {
        name: editAccountName,
        balance: Number(editAccountBalance) || 0,
        icon: editSelectedIcon,
        target_amount: Number(editAccountTarget) || 0,
      },
    });
    closeEditModal();
  };

  const handleDelete = (accountId: number) => {
    deleteAccount.mutate(accountId);
  };

  const totalBalance = accounts.reduce(
    (sum, acc) => sum + Number(acc.balance),
    0
  );
  const totalTarget = accounts.reduce(
    (sum, acc) => sum + (Number(acc.target_amount) || 0),
    0
  );

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
            Счета
          </Text>
          <Button
            leftSection={<IconPlus size={18} />}
            onClick={openCreateModal}
          >
            Новый счёт
          </Button>
        </Group>

        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Group justify="space-between">
              <Text fw={500}>Общий баланс</Text>
              <Text size="xl" fw={700} c="teal">
                {totalBalance.toLocaleString()} ₽
              </Text>
            </Group>
            {totalTarget > 0 && (
              <>
                <Progress
                  value={totalBalance > 0 ? (totalBalance / totalTarget) * 100 : 0}
                  size="sm"
                  radius="sm"
                  color="teal"
                />
                <Group justify="space-between">
                  <Text fw={500}>Цель</Text>
                  <Text size="sm" c="dimmed">
                    {totalTarget.toLocaleString()} ₽
                  </Text>
                </Group>
              </>
            )}
          </Stack>
        </Paper>

        {accounts.length === 0 ? (
          <Paper withBorder p="xl" radius="md" ta="center">
            <Text c="dimmed">Нет счетов</Text>
            <Text c="dimmed" size="sm">
              Создайте счёт для учёта средств
            </Text>
          </Paper>
        ) : (
          accounts.map((account) => {
            const target = Number(account.target_amount) || 0;
            const balance = Number(account.balance);
            const progress =
              target > 0 ? Math.min((balance / target) * 100, 100) : 0;

            return (
              <AccountCard
                key={account.id}
                account={account}
                target={target}
                balance={balance}
                progress={progress}
                onEdit={() => openEditModal(account)}
                onDelete={() => handleDelete(account.id)}
                onDeposit={(amount) => {
                  updateAccount.mutate({
                    id: account.id,
                    data: { balance: balance + amount },
                  });
                }}
              />
            );
          })
        )}
      </Stack>

      {/* Create Modal */}
      <Modal
        opened={createModalOpened}
        onClose={closeCreateModal}
        title="Новый счёт"
        centered
      >
        <Stack>
          <TextInput
            label="Название"
            placeholder="На машину, Карта..."
            value={newAccountName}
            onChange={(e) => setNewAccountName(e.currentTarget.value)}
          />
          <NumberInput
            label="Начальный баланс"
            placeholder="0"
            value={newAccountBalance}
            onChange={(val) => setNewAccountBalance(val as number | "")}
            prefix="₽ "
          />
          <NumberInput
            label="Целевая сумма (необязательно)"
            placeholder="0"
            value={newAccountTarget}
            onChange={(val) => setNewAccountTarget(val as number | "")}
            prefix="₽ "
            min={0}
          />
          <Text fw={500} size="sm">
            Иконка
          </Text>
          <IconSelector
            value={selectedIcon}
            onChange={setSelectedIcon}
          />
          <Button fullWidth onClick={handleCreateAccount}>
            Создать
          </Button>
        </Stack>
      </Modal>

      {/* Edit Modal */}
      <Modal
        opened={editModalOpened}
        onClose={closeEditModal}
        title="Редактировать счёт"
        centered
      >
        <Stack>
          <TextInput
            label="Название"
            placeholder="На машину, Карта..."
            value={editAccountName}
            onChange={(e) => setEditAccountName(e.currentTarget.value)}
          />
          <NumberInput
            label="Баланс"
            placeholder="0"
            value={editAccountBalance}
            onChange={(val) => setEditAccountBalance(val as number | "")}
            prefix="₽ "
          />
          <NumberInput
            label="Целевая сумма"
            placeholder="0"
            value={editAccountTarget}
            onChange={(val) => setEditAccountTarget(val as number | "")}
            prefix="₽ "
            min={0}
          />
          <Text fw={500} size="sm">
            Иконка
          </Text>
          <IconSelector
            value={editSelectedIcon}
            onChange={setEditSelectedIcon}
          />
          <Button fullWidth onClick={handleUpdateAccount}>
            Сохранить
          </Button>
        </Stack>
      </Modal>
    </Box>
  );
}