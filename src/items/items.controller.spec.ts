import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { create } from 'domain';

describe('ItemsController', () => {
  let itemsController: ItemsController;
  let itemsService: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            findAllItems: jest.fn(),
          },
        }
      ],
    }).compile();

    itemsController = module.get<ItemsController>(ItemsController);
    itemsService = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(itemsController).toBeDefined();
    expect(itemsService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = [{ id: 1, name: 'Item 1', created_at: new Date()}];

      jest.spyOn(itemsService, 'findAllItems').mockResolvedValue(result);

      expect(await itemsController.findAll()).toBe(result);
    });

      it('should call the findAllItems method of the service', async () => {
        const findAllItemsSpy = jest.spyOn(itemsService, 'findAllItems').mockResolvedValue([]);
        await itemsController.findAll();
        expect(findAllItemsSpy).toBeCalledTimes(1);
      });
  })

});
