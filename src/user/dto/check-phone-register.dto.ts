import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CheckPhoneRegisterDto {
  @IsString()
  @Length(14)
  @IsNotEmpty()
  phone: string;
}
