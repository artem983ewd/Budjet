import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDebtDto {
  @IsString()
  @IsNotEmpty({ message: 'Название долга обязательно' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  total_debt: number;

  @IsNumber()
  @IsNotEmpty()
  remaining_debt: number;
}
