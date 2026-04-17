import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDate,
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

  @IsDate()
  @IsNotEmpty({ message: 'Дата операции обязательна' })
  transactionDate: Date;
}
