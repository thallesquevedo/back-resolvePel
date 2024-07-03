import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { Analytics } from './entities/analytics.entity';
import { getRepositoryToken } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm';

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;
  let repository: Repository<Analytics>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService, 
        {
          provide: getRepositoryToken(Analytics),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          }
        }],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
    repository = module.get<Repository<Analytics>>(getRepositoryToken(Analytics));

  });

  it('should be defined', () => {
    expect(analyticsService).toBeDefined();
  });

  describe('save', () => {
    it('should add a new view when there are no existing analytics', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1, count: 1 } as Analytics);
  
      await analyticsService.addView();
  
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith({ count: 1 });
    });
  
    it('should update view count when analytics data exists', async () => {
      const existingAnalytics = { id: 1, count: 5 } as Analytics;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(existingAnalytics);
      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce(existingAnalytics);
  
      await analyticsService.addView();
  
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(existingAnalytics.count).toEqual(6); // Verifica se o contador foi incrementado corretamente
    });
  });
  

  describe('findOne', () => {
    it('should handle error when saving analytics data', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      const errorMessage = 'Failed to save analytics data';
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error(errorMessage));
  
      await expect(analyticsService.addView()).rejects.toThrowError(errorMessage);
    });
  });

});
