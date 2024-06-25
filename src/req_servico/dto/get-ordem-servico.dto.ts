import { IsUUID } from 'class-validator';

export class GetOrdemServicoDto {
  @IsUUID()
  id: string;
}
