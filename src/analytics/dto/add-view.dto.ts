import { IsNotEmpty, IsString } from 'class-validator';

export class AddViewDto {
  @IsNotEmpty()
  @IsString()
  reqServicoId: string;
}
