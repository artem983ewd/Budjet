import {
  Modal,
  Stack,
  Text,
  Group,
  Alert,
  Button,
} from "@mantine/core";
import { IconAlertTriangle } from "@tabler/icons-react";
import { useUIStore } from "../../../features/BudgetUI";
import { DomainStore } from "../../../features/BudgetUI/types/store";

interface DeleteConfirmationModalProps {
  store: DomainStore;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ store }) => {
  const deleteModalOpened = useUIStore((s) => s.deleteModalOpened);
  const closeDeleteModal = useUIStore((s) => s.closeDeleteModal);
  const itemToDelete = store.itemToDelete;

  const handleDelete = () => {
    store.handleDeleteConfirmed();
    closeDeleteModal();
  };

  return (
    <Modal
      opened={deleteModalOpened}
      onClose={closeDeleteModal}
      title={
        <Group gap="sm">
          <IconAlertTriangle color="red" />
          <Text fw={600}>Подтверждение удаления</Text>
        </Group>
      }
      centered
      radius="md"
    >
      <Stack gap="md">
        <Alert
          variant="light"
          color="red"
          radius="md"
          icon={<IconAlertTriangle size={20} />}
        >
          <Text size="sm">
            {itemToDelete?.type === "category"
              ? `Вы уверены, что хотите удалить категорию "${itemToDelete?.name}"?`
              : `Вы уверены, что хотите удалить подкатегорию "${itemToDelete?.name}"?`}
          </Text>
        </Alert>

        {itemToDelete && itemToDelete.transactionsCount > 0 && (
          <Text size="sm" c="dimmed">
            Будет удалено {itemToDelete.transactionsCount} транзакция(ий).
          </Text>
        )}

        <Text size="sm" c="dimmed">
          Это действие нельзя отменить.
        </Text>

        <Group justify="flex-end" gap="xs" mt="md">
          <Button variant="default" onClick={closeDeleteModal}>
            Отмена
          </Button>
          <Button
            variant="filled"
            color="red"
            onClick={handleDelete}
            leftSection={<IconAlertTriangle size={16} />}
          >
            Удалить
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
