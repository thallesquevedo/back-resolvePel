import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return await this.itemsService.findAllItems();
  }
}
