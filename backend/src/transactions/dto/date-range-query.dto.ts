import { IsOptional, IsString } from 'class-validator';

export class DateRangeQueryDto {
  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}