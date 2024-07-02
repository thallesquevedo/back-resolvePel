import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateReqServicoDto } from './dto/create-req_servico.dto';
import { ReqServicoService } from './req_servico.service';
import { AuthRequest } from 'src/auth/dto/auth-request';
import { AuthGuard } from '@nestjs/passport';
import { GetOrdemServicoDto } from './dto/get-ordem-servico.dto';
import { UpdateReqServicoDto } from './dto/update-req_servico.dto';

@Controller('req-servico')
export class ReqServicoController {
  constructor(private readonly reqServicoService: ReqServicoService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllByUser(@Req() req: AuthRequest) {
    return await this.reqServicoService.findAllByUserId(req.user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findPrestadorOrdemServicoById(
    @Param() getOrderServicoDto: GetOrdemServicoDto,
    @Req() req: AuthRequest,
  ) {
    return await this.reqServicoService.findPrestadorOrdemServicoById(
      getOrderServicoDto.id,
      req.user,
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Req() req: AuthRequest,
    @Body() createReqServicoDto: CreateReqServicoDto,
  ) {
    return await this.reqServicoService.createReqServico(
      req.user,
      createReqServicoDto,
    );
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Req() req: AuthRequest,
    @Param('id') reqServicoId: string,
    @Body() updateReqServicoDto: UpdateReqServicoDto,
  ) {
    return await this.reqServicoService.updateOrdemServico(
      reqServicoId,
      req.user,
      updateReqServicoDto,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteOrdemServico(
    @Param('id') ordemServicoId: string,
    @Req() req: AuthRequest,
  ) {
    return await this.reqServicoService.deleteOrdemServico(
      ordemServicoId,
      req.user,
    );
  }

  @Get('cliente/all')
  async findAllByCliente() {
    return await this.reqServicoService.findAllByCliente();
  }

  @Get('cliente/:id')
  async findClientOrdemSevicoById(
    @Param() getOrdemServicoDto: GetOrdemServicoDto,
  ) {
    return await this.reqServicoService.findClientOrdemSevicoById(
      getOrdemServicoDto.id,
    );
  }
}
