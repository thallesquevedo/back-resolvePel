import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReqServico } from 'src/req_servico/entities/req_servico.entity';
import { ReqServicoModule } from 'src/req_servico/req_servico.module';
import { User } from 'src/user/entities/user.entity';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { UserModule } from 'src/user/user.module';
import { Comentario } from './entities/comentario.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReqServico, User, Comentario]),
    ReqServicoModule,
    UserModule,
  ],
  controllers: [ComentariosController],
  providers: [ComentariosService],
})
export class ComentariosModule {}
