import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  accountId?: number;

  @IsOptional()
  goalId?: number;

  @IsOptional()
  debtId?: number;

  @IsNotEmpty({ message: 'Категория обязательна' })
  categoryId: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Сумма обязательна' })
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty({ message: 'Дата операции обязательна' })
  transactionDate: string;
}
