import { IconName } from "../../../shared/ui/IconRenderer";

export interface Debt {
  id: number;
  name: string;
  total_debt: number;
  remaining_debt: number;
  icon: IconName | null;
}

export interface CreateDebtDto {
  name: string;
  total_debt: number;
  remaining_debt?: number;
  icon?: IconName;
}

export interface UpdateDebtDto {
  name?: string;
  total_debt?: number;
  remaining_debt?: number;
  icon?: IconName;
}
