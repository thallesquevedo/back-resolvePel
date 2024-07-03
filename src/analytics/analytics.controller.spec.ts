import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

describe('AnalyticsController', () => {
  let analyticsController: AnalyticsController;
  let analyticsService: AnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnalyticsController],
      providers: [
        {
          provide: AnalyticsService,
          useValue: {
            addView: jest.fn(),
          },
        }
      ],
    }).compile();

    analyticsController = module.get<AnalyticsController>(AnalyticsController);
    analyticsService = module.get<AnalyticsService>(AnalyticsService);
  });

  it('should be defined', () => {
    expect(analyticsController).toBeDefined();
  });

  describe('addView', () => {
    it('should call addView method of analyticsService', async () => {
      await analyticsController.addView();
      expect(analyticsService.addView).toHaveBeenCalledTimes(1);
    });

    it('should handle error when addView method of analyticsService throws an error', async () => {
      const errorMessage = 'Error adding view';
      jest.spyOn(analyticsService, 'addView').mockRejectedValue(new Error(errorMessage));

      await expect(analyticsController.addView()).rejects.toThrow(errorMessage);
    });
  });
});
