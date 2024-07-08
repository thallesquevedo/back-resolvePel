import { IsString } from 'class-validator';

export class ResponseCreateUserDTO {
  @IsString()
  email: string;

  @IsString()
  token: string;

  @IsString()
  name: string;
}
