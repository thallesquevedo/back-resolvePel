import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';
import { User } from 'src/user/entities/user.entity';
import { AddViewDto } from './dto/add-view.dto';
import { ReqServico } from 'src/req_servico/entities/req_servico.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  async addView(user: User, addViewDto: AddViewDto) {
    const analytics = await this.analyticsRepository
      .createQueryBuilder('analytics')
      .innerJoin('analytics.user', 'user')
      .innerJoin('analytics.reqServico', 'reqServico')
      .where('user.id = :userId', { userId: user.id })
      .andWhere('reqServico.id = :reqServicoId', {
        reqServicoId: addViewDto.reqServicoId,
      })
      .getOne();

    if (analytics) {
      analytics.count += 1;
      await this.analyticsRepository.save(analytics);
    } else {
      const create = this.analyticsRepository.create({
        user: user,
        reqServico: { id: addViewDto.reqServicoId } as ReqServico,
        count: 1,
      });
      await this.analyticsRepository.save(create);
    }
  }
}
