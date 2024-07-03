import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { find } from 'rxjs';
import { Repository, In } from 'typeorm';

describe('ItemsService', () => {
  let service: ItemsService;
  let repository: Repository<Item>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService, 
        {
          provide: getRepositoryToken(Item),
          useValue: {
            findBy: jest.fn(),
            find: jest.fn(),
          }
        }],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    repository = module.get<Repository<Item>>(getRepositoryToken(Item));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByIds', () => {
    it('should find all items by IDs', async () => {
      const ids = [1, 2, 3];
      const items = [
        { id: 1, name: 'Item 1', created_at: new Date() },
        { id: 2, name: 'Item 2', created_at: new Date() },
      ];
      jest.spyOn(repository, 'findBy').mockResolvedValue(items);
  
      const result = await service.findAllByIds(ids);
      expect(result).toEqual(items);
      expect(repository.findBy).toHaveBeenCalledWith({ id: In(ids) });
    });

    it('should return an empty array if no items found for given IDs', async () => {
      const ids = [99, 100];
      jest.spyOn(repository, 'findBy').mockResolvedValue([]);
  
      const result = await service.findAllByIds(ids);
      expect(result).toEqual([]);
      expect(repository.findBy).toHaveBeenCalledWith({ id: In(ids) });
    });
  })

  describe('findAllItems', () => {
    it('should return all items', async () => {
      const items = [
        { id: 1, name: 'Item 1', created_at: new Date() },
        { id: 2, name: 'Item 2', created_at: new Date() },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(items);
  
      const result = await service.findAllItems();
      expect(result).toEqual(items);
      expect(repository.find).toHaveBeenCalled();
    });

    it('should return an empty array if no items found', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([]);
  
      const result = await service.findAllItems();
      expect(result).toEqual([]);
      expect(repository.find).toHaveBeenCalled();
    }); 
  })
});
