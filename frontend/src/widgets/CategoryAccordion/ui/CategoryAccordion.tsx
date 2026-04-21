import { Accordion, Stack, Text, Group, UnstyledButton, Tooltip } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { MainCategory } from "../../../entities/Category/model";
import { IconRenderer } from "../../../shared/ui/IconRenderer";
import { SubCategoryCard } from "../../SubCategoryCard";
import { useUIStore } from "../../../features/BudgetUI";
import { DomainStore } from "../../../features/BudgetUI/types/store";

interface CategoryAccordionProps {
  cat: MainCategory;
  store: DomainStore;
}

export const CategoryAccordion: React.FC<CategoryAccordionProps> = ({ cat, store }) => {
  const openSubModal = useUIStore((s) => s.openSubModal);
  const openDeleteModal = useUIStore((s) => s.openDeleteModal);

  const handleDeleteCategory = () => {
    store.confirmDeleteMainCategory(cat.id);
    openDeleteModal();
  };

  return (
    <Accordion.Item key={cat.id} value={cat.id}>
      <Accordion.Control>
        <Group justify="space-between" wrap="nowrap">
          <Group gap="sm">
            <IconRenderer name={cat.iconName} size={20} />
            <Stack gap={0}>
              <Text fw={600} size="sm">
                {cat.name}
              </Text>
              <Text size="xs" c="dimmed">
                {store.getMainTotal(cat)} ₽
              </Text>
            </Stack>
          </Group>
          <Group gap="xs">
            <UnstyledButton
              component="span"
              onClick={(e) => {
                e.stopPropagation();
                openSubModal(cat.id);
              }}
              style={{ color: "var(--mantine-color-gray-6)", padding: 4 }}
            >
              <IconPlus size={18} />
            </UnstyledButton>
            <Tooltip label="Удалить категорию" withArrow>
              <UnstyledButton
                component="span"
                onClick={handleDeleteCategory}
                style={{ color: "var(--mantine-color-gray-6)", padding: 4 }}
              >
                <IconTrash size={18} />
              </UnstyledButton>
            </Tooltip>
          </Group>
        </Group>
      </Accordion.Control>

      <Accordion.Panel>
        <Stack gap="xs">
          {cat.subCategories.map((sub) => (
            <SubCategoryCard key={sub.id} sub={sub} store={store} />
          ))}
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  );
};
