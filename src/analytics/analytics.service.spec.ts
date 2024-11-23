import { Test, TestingModule } from '@nestjs/testing';
import { AnalyticsService } from './analytics.service';
import { Analytics } from './entities/analytics.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddViewDto } from './dto/add-view.dto';
import { User } from 'src/user/entities/user.entity';

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
            createQueryBuilder: jest.fn().mockReturnValue({
              innerJoin: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              andWhere: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            }),
            save: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    analyticsService = module.get<AnalyticsService>(AnalyticsService);
    repository = module.get<Repository<Analytics>>(getRepositoryToken(Analytics));
  });

  it('should be defined', () => {
    expect(analyticsService).toBeDefined();
  });

  describe('addView', () => {
    const mockUser: User = { id: 'user-id' } as User;
    const mockAddViewDto: AddViewDto = { reqServicoId: 'service-id' };

    it('should add a new view when there are no existing analytics', async () => {
      const createQueryBuilderSpy = jest
        .spyOn(repository, 'createQueryBuilder')
        .mockReturnValueOnce({
          innerJoin: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          getOne: jest.fn().mockResolvedValueOnce(undefined),
        } as any);

      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce({ id: 1, count: 1 } as Analytics);
      const createSpy = jest.spyOn(repository, 'create').mockReturnValueOnce({
        user: mockUser,
        reqServico: { id: mockAddViewDto.reqServicoId },
        count: 1,
      } as Analytics);

      await analyticsService.addView(mockUser, mockAddViewDto);

      expect(createQueryBuilderSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith({
        user: mockUser,
        reqServico: { id: mockAddViewDto.reqServicoId },
        count: 1,
      });
      expect(saveSpy).toHaveBeenCalledTimes(1);
    });

    it('should update view count when analytics data exists', async () => {
      const existingAnalytics = { id: 1, count: 5, save: jest.fn() } as any;

      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(existingAnalytics),
      } as any);

      const saveSpy = jest.spyOn(repository, 'save').mockResolvedValueOnce(existingAnalytics);

      await analyticsService.addView(mockUser, mockAddViewDto);

      expect(existingAnalytics.count).toBe(6); // Contador incrementado corretamente
      expect(saveSpy).toHaveBeenCalledTimes(1);
      expect(saveSpy).toHaveBeenCalledWith(existingAnalytics);
    });

    it('should handle error when saving analytics data', async () => {
      jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(undefined),
      } as any);

      const errorMessage = 'Failed to save analytics data';
      jest.spyOn(repository, 'save').mockRejectedValueOnce(new Error(errorMessage));

      await expect(analyticsService.addView(mockUser, mockAddViewDto)).rejects.toThrowError(errorMessage);
    });
  });
});
