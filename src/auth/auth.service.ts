import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserPayload } from './dto/user-payload';
import { JwtService } from '@nestjs/jwt';
import { ResponseModel } from 'src/utils/models';
import { UserToken } from './dto/user-token';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  login(user: User): ResponseModel<UserToken> {
    const payload: UserPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    const jwtToken = this.jwtService.sign(payload);

    return {
      status: true,
      mensagem: {
        codigo: 201,
        texto: 'Usuário logado com sucesso',
      },
      conteudo: {
        name: user.name,
        email: user.email,
        token: jwtToken,
      },
    };
  }
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password);
      if (isPasswordMatching) return { ...user, password: undefined };
    }

    throw new UnauthorizedException({
      status: false,
      mensagem: {
        codigo: 401,
        texto: 'Email e/ou senha inválidos',
      },
      conteudo: null,
    });
  }
}
