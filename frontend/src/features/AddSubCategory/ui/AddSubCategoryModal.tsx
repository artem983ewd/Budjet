import {
  Modal,
  Stack,
  TextInput,
  Button,
} from "@mantine/core";
import { IconSelector, IconName, useUIStore } from "@/shared/lib/stores";

interface AddSubCategoryModalProps {
  addSubCategory: (name: string, icon: IconName, catId: string) => void;
}

export const AddSubCategoryModal: React.FC<AddSubCategoryModalProps> = ({ addSubCategory }) => {
  const {
    subModalOpened,
    closeSubModal,
    newName,
    setNewName,
    selectedIcon,
    setSelectedIcon,
    activeMainCatId,
  } = useUIStore();

  const handleCreate = () => {
    if (activeMainCatId) {
      addSubCategory(newName, selectedIcon, activeMainCatId);
    }
    closeSubModal();
  };

  return (
    <Modal
      opened={subModalOpened}
      onClose={closeSubModal}
      title="Новая подкатегория"
      centered
    >
      <Stack>
        <TextInput
          label="Название"
          placeholder="Кафе, Магазин..."
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
