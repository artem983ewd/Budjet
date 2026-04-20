import { SimpleGrid, ActionIcon, Group, Text, Box } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { AVAILABLE_ICONS, IconName } from "./IconRenderer";
import { useState } from "react";

const ICONS_PER_PAGE = 20;

interface IconSelectorProps {
  value: IconName;
  onChange: (icon: IconName) => void;
}

export function IconSelector({ value, onChange }: IconSelectorProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(AVAILABLE_ICONS.length / ICONS_PER_PAGE);
  const startIndex = page * ICONS_PER_PAGE;
  const endIndex = startIndex + ICONS_PER_PAGE;
  const visibleIcons = AVAILABLE_ICONS.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <Box>
      <SimpleGrid cols={5} spacing="xs">
        {visibleIcons.map((icon) => (
          <ActionIcon
            key={icon.name}
            size="xl"
            variant={value === icon.name ? "filled" : "light"}
            onClick={() => onChange(icon.name as IconName)}
          >
            <icon.component size={20} />
          </ActionIcon>
        ))}
      </SimpleGrid>

      {totalPages > 1 && (
        <Group justify="center" mt="xs" gap="xs">
          <ActionIcon
            variant="subtle"
            onClick={handlePrev}
            disabled={page === 0}
          >
            <IconChevronLeft size={18} />
          </ActionIcon>
          <Text size="sm" c="dimmed">
            {page + 1} / {totalPages}
          </Text>
          <ActionIcon
            variant="subtle"
            onClick={handleNext}
            disabled={page === totalPages - 1}
          >
            <IconChevronRight size={18} />
          </ActionIcon>
        </Group>
      )}
    </Box>
  );
}