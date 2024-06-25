import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateReqServicoDto {
  @IsNotEmpty()
  @IsNumber()
  servicoId: number;

  @IsNotEmpty()
  @IsArray()
  itemIds: number[];

  @IsNotEmpty()
  @IsString()
  descricao: string;
}
