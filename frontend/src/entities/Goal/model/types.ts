export interface Goal {
  id: number;
  name: string;
  current_amount: number;
  target_amount: number;
}

export interface CreateGoalDto {
  name: string;
  target_amount: number;
  current_amount?: number;
}

export interface UpdateGoalDto {
  name?: string;
  current_amount?: number;
  target_amount?: number;
}
