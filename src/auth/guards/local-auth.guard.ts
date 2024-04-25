import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }

  handleRequest(err, user) {
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
