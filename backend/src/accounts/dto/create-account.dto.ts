import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'Название счета обязательно' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  balance: number;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsNumber()
  @IsOptional()
  target_amount?: number;
}
