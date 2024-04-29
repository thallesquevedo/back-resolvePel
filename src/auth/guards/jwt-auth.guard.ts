// NestJS
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw (
        err ||
        new UnauthorizedException({
          status: false,
          mensagem: {
            codigo: 401,
            texto: 'Não autorizado',
          },
        })
      );
    }
    return user;
  }
}
