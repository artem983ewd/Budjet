import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsOptional()
  parentId?: number;

  @IsString()
  @IsNotEmpty({ message: 'Название обязательно' })
  name: string;

  @IsEnum(['income', 'expense'], {
    message: 'Тип должен быть income или expense',
  })
  type: 'income' | 'expense';

  @IsString()
  @IsOptional()
  icon?: string;
}
