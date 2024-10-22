import { Body, Controller, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/auth/dto/auth-request';
import { CheckEmailRegisterDto } from './dto/check-email-register.dto';
import { CheckPhoneRegisterDto } from './dto/check-phone-register.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserInfoDto } from './dto/update-user-info.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('/me')
  @UseGuards(AuthGuard('jwt'))
  async updateMe(
    @Req() req: AuthRequest,
    @Body() updateUserDto: UpdateUserInfoDto,
  ) {
    return await this.userService.updateUserInfos(req.user, updateUserDto);
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
