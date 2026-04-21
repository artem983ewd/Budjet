import { IconName } from "../../../shared/ui/IconRenderer";

export interface Account {
  id: number;
  name: string;
  balance: number;
  icon: IconName | null;
  target_amount: number | null;
}

export interface CreateAccountDto {
  name: string;
  balance?: number;
  icon?: IconName;
  target_amount?: number;
}

export interface UpdateAccountDto {
  name?: string;
  balance?: number;
  icon?: IconName;
  target_amount?: number;
}
