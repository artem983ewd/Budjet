import { IconName } from "../../../shared/ui/IconRenderer";

export interface SubCategory {
  id: string;
  name: string;
  iconName: IconName;
}

export interface MainCategory {
  id: string;
  name: string;
  iconName: IconName;
  subCategories: SubCategory[];
}
