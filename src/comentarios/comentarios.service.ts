import { BadRequestException, Injectable } from '@nestjs/common';
import { ReqServicoService } from 'src/req_servico/req_servico.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectRepository(Comentario)
    private comentarioRepository: Repository<Comentario>,
    private reqServicoService: ReqServicoService,
    private userService: UserService,
  ) {}

  async create(user: User, createComentarioDto: CreateComentarioDto) {
    const { comentario, reqServicoId, userId } = createComentarioDto;
    if (!comentario || !reqServicoId || !userId) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto:
            'É necessário informar o id da requisição de serviço, o id do usuário e o comentário.',
        },
      });
    }
    const findUser = await this.userService.findOne(user.id);
    const findReqServico =
      await this.reqServicoService.findClientOrdemSevicoById(reqServicoId);

    if (!findReqServico) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Requisição de serviço não encontrada.',
        },
      });
    }

    try {
      await this.comentarioRepository.save({
        comentario,
        user: findUser,
        reqServico: findReqServico,
        rating: createComentarioDto.rating,
      });

      return {
        status: true,
        mensagem: {
          codigo: 201,
          texto: 'Comentário criado com sucesso.',
        },
      };
    } catch (error) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Erro ao criar comentário.',
        },
      });
    }
  }
}
