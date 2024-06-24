import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateReqServicoDto } from './dto/create-req_servico.dto';
import { ReqServicoService } from './req_servico.service';
import { AuthRequest } from 'src/auth/dto/auth-request';
import { AuthGuard } from '@nestjs/passport';

@Controller('req-servico')
export class ReqServicoController {
  constructor(private readonly reqServicoService: ReqServicoService) {}

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

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAllByUser(@Req() req: AuthRequest) {
    return await this.reqServicoService.findAllByUserId(req.user);
  }
}
