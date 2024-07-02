import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Analytics } from './entities/analytics.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Analytics)
    private readonly analyticsRepository: Repository<Analytics>,
  ) {}

  async addView() {
    const analytics = await this.analyticsRepository.findOne({
      where: { id: 1 },
    });

    if (analytics) {
      analytics.count += 1;
      await this.analyticsRepository.save(analytics);
    } else {
      await this.analyticsRepository.save({ count: 1 });
    }
  }
}
