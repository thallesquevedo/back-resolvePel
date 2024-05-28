import { Body, Controller, Post } from '@nestjs/common';
import { CheckPhoneRegisterDto } from './dto/check-phone-register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { CheckEmailRegisterDto } from './dto/check-email-register.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('check-phone-register')
  checkPhoneRegister(@Body() checkPhoneRegisterDto: CheckPhoneRegisterDto) {
    return this.userService.checkPhoneRegister(checkPhoneRegisterDto);
  }

  @Post('check-email-register')
  checkEmailRegister(@Body() checkEmailRegisterDto: CheckEmailRegisterDto) {
    return this.userService.checkEmailRegister(checkEmailRegisterDto);
  }
}
