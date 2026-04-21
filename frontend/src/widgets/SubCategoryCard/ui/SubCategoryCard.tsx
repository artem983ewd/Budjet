import {
  Paper,
  Group,
  Text,
  UnstyledButton,
  TextInput,
  Stack,
  ActionIcon,
  Tooltip,
  rem,
  Box,
} from "@mantine/core";
import { IconCurrencyRubel, IconTrash, IconChevronDown, IconChevronRight } from "@tabler/icons-react";
import { SubCategory } from "../../../entities/Category/model";
import { IconRenderer } from "../../../shared/ui/IconRenderer";
import { useUIStore, type DomainStore } from "@/shared/lib/stores";

interface SubCategoryCardProps {
  sub: SubCategory;
  store: DomainStore;
}

export const SubCategoryCard: React.FC<SubCategoryCardProps> = ({ sub, store }) => {
  const {
    editingSubId,
    amountValue,
    setEditingSubId,
    setAmountValue,
    hiddenSubs,
    toggleSubTransactions,
  } = useUIStore();

  const openDeleteModal = useUIStore((s) => s.openDeleteModal);

  const isEditing = editingSubId === sub.id;
  const isHidden = hiddenSubs.has(sub.id);
  const hasTransactions = store.getSubTotal(sub.id) > 0;

  const handleSaveAmount = () => {
    const val = parseFloat(amountValue);
    if (!isNaN(val) && val > 0) {
      store.addTransaction(sub.id, val);
    }
    setEditingSubId(null);
    setAmountValue("");
  };

  const handleDeleteSubCategory = () => {
    store.confirmDeleteSubCategory(sub.id);
    openDeleteModal();
  };

  return (
    <Paper withBorder p={0} radius="sm" style={{ overflow: "hidden" }}>
      {isEditing ? (
        <TextInput
          placeholder="0.00"
          variant="filled"
          autoFocus
          type="number"
          inputMode="decimal"
          value={amountValue}
          onChange={(e) => setAmountValue(e.currentTarget.value)}
          leftSection={<IconCurrencyRubel size={16} />}
          onBlur={handleSaveAmount}
          onKeyDown={(e) => e.key === "Enter" && handleSaveAmount()}
        />
      ) : (
        <UnstyledButton
          onClick={() => setEditingSubId(sub.id)}
          style={{ width: "100%", padding: rem(10) }}
        >
          <Group justify="space-between">
            <Group gap="xs">
              <Box opacity={0.6}>
                <IconRenderer name={sub.iconName} />
              </Box>
              <Text size="sm">{sub.name}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" fw={500}>
                {store.getSubTotal(sub.id)} ₽
              </Text>
              {hasTransactions && (
                <UnstyledButton
                  component="span"
                  size="xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubTransactions(sub.id);
                  }}
                  style={{ color: "var(--mantine-color-gray-6)", padding: 2 }}
                >
                  {isHidden ? <IconChevronRight size={14} /> : <IconChevronDown size={14} />}
                </UnstyledButton>
              )}
            </Group>
          </Group>
        </UnstyledButton>
      )}

      <Group justify="flex-end" px="xs" pb="xs" gap={4}>
        <Tooltip label="Удалить подкатегорию" withArrow>
          <UnstyledButton
            component="span"
            size="xs"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSubCategory();
            }}
            style={{ color: "var(--mantine-color-gray-6)", padding: 2 }}
          >
            <IconTrash size={12} />
          </UnstyledButton>
        </Tooltip>
      </Group>

      {!isHidden && (
        <Stack gap={4} p={hasTransactions ? "xs" : 0}>
          {store.transactions
            .filter((t) => t.subCategoryId === sub.id)
            .map((t) => (
              <Group key={t.id} justify="space-between" wrap="nowrap">
                <Text size="xs" c="dimmed">
                  {t.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} —{" "}
                  {t.amount} ₽
                </Text>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="xs"
                  onClick={() => store.deleteTransaction(t.id)}
                >
                  <IconTrash size={12} />
                </ActionIcon>
              </Group>
            ))}
        </Stack>
      )}
    </Paper>
  );
};
