import { IsNotEmpty, IsString } from 'class-validator';

export class CheckEmailRegisterDto {
  @IsString()
  @IsNotEmpty()
  email: string;
}
