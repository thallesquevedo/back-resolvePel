import { Controller, Get, UseGuards } from '@nestjs/common';
import { ServicosService } from './servicos.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('servicos')
export class ServicosController {
  constructor(private readonly servicosService: ServicosService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return await this.servicosService.findAllServicos();
  }
}
