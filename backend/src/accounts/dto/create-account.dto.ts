import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty({ message: 'Название счета обязательно' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  balance: number;
}
