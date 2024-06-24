import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ReqServicoModule } from 'src/req_servico/req_servico.module';
import { ReqServico } from 'src/req_servico/entities/req_servico.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, ReqServico]),
    forwardRef(() => ReqServicoModule),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
