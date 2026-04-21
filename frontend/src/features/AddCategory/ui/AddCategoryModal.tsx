import {
  Modal,
  Stack,
  TextInput,
  Button,
} from "@mantine/core";
import { IconSelector, IconName, useUIStore } from "@/shared/lib/stores";

interface AddCategoryModalProps {
  addMainCategory: (name: string, icon: IconName, type: "income" | "expense") => void;
  type: "income" | "expense";
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({ addMainCategory, type }) => {
  const {
    mainModalOpened,
    closeMainModal,
    newName,
    setNewName,
    selectedIcon,
    setSelectedIcon,
  } = useUIStore();

  const handleCreate = () => {
    addMainCategory(newName, selectedIcon, type);
    closeMainModal();
  };

  return (
    <Modal
      opened={mainModalOpened}
      onClose={closeMainModal}
      title="Новая категория"
      centered
    >
      <Stack>
        <TextInput
          label="Название"
          placeholder="Еда, Транспорт..."
          value={newName}
          onChange={(e) => setNewName(e.currentTarget.value)}
        />
        <IconSelector value={selectedIcon} onChange={setSelectedIcon} />
        <Button fullWidth onClick={handleCreate}>
          Создать
        </Button>
      </Stack>
    </Modal>
  );
};
