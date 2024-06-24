import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsModule } from 'src/items/items.module';
import { Servico } from 'src/servicos/entities/servico.entity';
import { ServicosModule } from 'src/servicos/servicos.module';
import { User } from 'src/user/entities/user.entity';
import { UserModule } from 'src/user/user.module';
import { ReqServico } from './entities/req_servico.entity';
import { ReqServicoController } from './req_servico.controller';
import { ReqServicoService } from './req_servico.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReqServico, Item, Servico, User]),
    ItemsModule,
    ServicosModule,
    forwardRef(() => UserModule),
  ],
  controllers: [ReqServicoController],
  providers: [ReqServicoService],
  exports: [ReqServicoService],
})
export class ReqServicoModule {}
