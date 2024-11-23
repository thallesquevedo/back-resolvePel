import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthRequest } from 'src/auth/dto/auth-request';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(
    @Req() req: AuthRequest,
    @Body() createComentarioDto: CreateComentarioDto,
  ) {
    return await this.comentariosService.create(req.user, createComentarioDto);
  }
}
