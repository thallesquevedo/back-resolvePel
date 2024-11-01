import { Type } from 'class-transformer';
import { IsOptional, IsPositive, IsString } from 'class-validator';

export class PaginationDTO {
  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  skip: number;

  @IsPositive()
  @IsOptional()
  @Type(() => Number)
  limit: number;

  @IsString()
  @IsOptional()
  search: string;
}
