import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
  ) {}
  async findAllByIds(ids: number[]) {
    const items = await this.itemRepository.findBy({ id: In(ids) });
    return items;
  }

  async findAllItems() {
    try {
      const items = await this.itemRepository.find();
      return items;
    } catch (error) {
      console.log(error);
    }
  }
}
