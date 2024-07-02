import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { typeormConfig } from './config/typeorm.config';
import { ItemsModule } from './items/items.module';
import { ReqServicoModule } from './req_servico/req_servico.module';
import { ServicosModule } from './servicos/servicos.module';
import { UserModule } from './user/user.module';
import { AnalyticsModule } from './analytics/analytics.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormConfig),
    UserModule,
    AuthModule,
    ReqServicoModule,
    ServicosModule,
    ItemsModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
