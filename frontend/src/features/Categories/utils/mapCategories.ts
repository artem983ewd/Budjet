import { CategoryApi } from "@/features/Categories/api";
import { MainCategory, SubCategory } from "@/entities/Category/model";
import { IconName } from "@/shared/ui/IconRenderer";

export function mapCategoriesToMain(
  categories: CategoryApi[],
  type: "income" | "expense"
): MainCategory[] {
  const filtered = categories.filter((c) => c.type === type && !c.parent);

  return filtered.map((cat) => ({
    id: cat.id.toString(),
    name: cat.name,
    iconName: (cat.icon as IconName) || "work",
    subCategories: mapSubCategories(categories, cat.id),
  }));
}

function mapSubCategories(categories: CategoryApi[], parentId: number): SubCategory[] {
  return categories
    .filter((c) => c.parent?.id === parentId)
    .map((sub) => ({
      id: sub.id.toString(),
      name: sub.name,
      iconName: (sub.icon as IconName) || "work",
    }));
}