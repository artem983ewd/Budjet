import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGoalDto {
  @IsString()
  @IsNotEmpty({ message: 'Название цели обязательно' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  current_amount: number;

  @IsNumber()
  @IsNotEmpty()
  target_amount: number;
}
