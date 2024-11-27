import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsService } from 'src/items/items.service';
import { ServicosService } from 'src/servicos/servicos.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DeepPartial, Repository } from 'typeorm';
import { CreateReqServicoDto } from './dto/create-req_servico.dto';
import { UpdateReqServicoDto } from './dto/update-req_servico.dto';
import { ReqServico } from './entities/req_servico.entity';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { PaginationDTO } from './dto/pagination.dto';

@Injectable()
export class ReqServicoService {
  constructor(
    @InjectRepository(ReqServico)
    private readonly reqServicoRepository: Repository<ReqServico>,
    private userService: UserService,
    private servicoService: ServicosService,
    private itemService: ItemsService,
  ) {}

  async findAllByUserId(user: User, paginationDTO: PaginationDTO) {
    const limit = paginationDTO.limit ?? DEFAULT_PAGE_SIZE;
    const page = paginationDTO.skip ?? 1;

    const [result, total] = await this.reqServicoRepository.findAndCount({
      where: { user: { id: user.id } },
      relations: ['servico', 'items', 'comentarios'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: result,
      count: total,
      page,
      limit,
    };
  }

  async findPrestadorOrdemServicoById(ordemServicoId: string, user: User) {
    const ordemServico = await this.reqServicoRepository.findOne({
      where: { id: ordemServicoId },
      relations: ['user', 'servico', 'items', 'comentarios'],
    });

    if (ordemServico.user.id !== user.id) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 401,
          texto:
            'Você não tem permissão para visualizar esta ordem de serviço.',
        },
      });
    }

    return await this.reqServicoRepository
      .createQueryBuilder('reqServico')
      .leftJoinAndSelect('reqServico.user', 'user')
      .leftJoinAndSelect('reqServico.servico', 'servico')
      .leftJoinAndSelect('reqServico.items', 'items')
      .leftJoinAndSelect('reqServico.comentarios', 'comentarios')
      .leftJoinAndSelect('comentarios.user', 'comentariosUser')
      .addSelect([])
      .where('reqServico.id = :id', { id: ordemServicoId })
      .select([
        'reqServico.id',
        'servico',
        'items',
        'reqServico.descricao',
        'comentarios',
        'comentariosUser.name',
      ])
      .getOne();
  }

  async createReqServico(user: User, createReqServicoDto: CreateReqServicoDto) {
    const { servicoId, itemIds, descricao } = createReqServicoDto;

    if (!servicoId || itemIds.length === 0 || !descricao) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto:
            'É necessário informar o id do serviço, o id do(s) item(s) e a descrição do serviço.',
        },
      });
    }

    const findUser = await this.userService.findOne(user.id);
    const findServico = await this.servicoService.findOne(servicoId);
    const findItems = await this.itemService.findAllByIds(itemIds);

    if (!findServico) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Serviço não encontrado.',
        },
      });
    }

    if (findItems.length === 0) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Item(s) não encontrado(s).',
        },
      });
    }

    const reqServico = this.reqServicoRepository.create({
      user: findUser,
      servico: findServico,
      descricao,
      items: findItems,
    } as DeepPartial<ReqServico>);

    return await this.reqServicoRepository.save(reqServico);
  }

  async updateOrdemServico(
    reqServicoId: string,
    user: User,
    updateReqServicoDto: UpdateReqServicoDto,
  ) {
    const { descricao, itemIds, servicoId } = updateReqServicoDto;

    const ordemServico = await this.reqServicoRepository.findOne({
      where: { id: reqServicoId },
      relations: ['user', 'servico', 'items'],
    });

    if (ordemServico.user.id !== user.id) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 401,
          texto: 'Você não tem permissão para atualizar esta ordem de serviço.',
        },
      });
    }

    if (!ordemServico) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Ordem de serviço não encontrada.',
        },
      });
    }

    try {
      const findServico = await this.servicoService.findOne(servicoId);
      const findItems = await this.itemService.findAllByIds(itemIds);
      ordemServico.items = findItems;
      ordemServico.descricao = descricao;
      ordemServico.servico = findServico;
      ordemServico.updated_at = new Date();

      return await this.reqServicoRepository.save(ordemServico);
    } catch (error) {
      throw new InternalServerErrorException({
        status: false,
        mensagem: {
          codigo: 500,
          texto: 'Erro ao atualizar ordem de serviço.',
        },
      });
    }
  }

  async deleteOrdemServico(ordemServicoId: string, user: User) {
    const ordemServico = await this.reqServicoRepository.findOne({
      where: { id: ordemServicoId },
      relations: ['user', 'servico', 'items', 'comentarios'],
    });

    if (ordemServico.user.id !== user.id) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 401,
          texto: 'Você não tem permissão para deletar esta ordem de serviço.',
        },
      });
    }

    if (!ordemServico) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 404,
          texto: 'Ordem de serviço não encontrada.',
        },
      });
    }

    return await this.reqServicoRepository.delete(ordemServicoId);
  }

  async findAllByCliente(paginationDTO: PaginationDTO) {
    const limit = paginationDTO.limit ?? DEFAULT_PAGE_SIZE;
    const page = paginationDTO.skip ?? 1;
    const search = paginationDTO.search;

    const query = await this.reqServicoRepository
      .createQueryBuilder('reqServico')
      .leftJoinAndSelect('reqServico.user', 'user')
      .leftJoinAndSelect('reqServico.servico', 'servico')
      .leftJoinAndSelect('reqServico.items', 'items')
      .leftJoinAndSelect('reqServico.comentarios', 'comentarios')
      .select([
        'reqServico.id',
        'reqServico.descricao',
        'user.name',
        'user.email',
        'user.phone',
        'servico',
        'items',
        'comentarios',
      ])
      .skip((page - 1) * limit)
      .take(limit);

    if (search && search !== 'Todos') {
      query.andWhere('servico.name = :search', { search });
    }

    const [result, total] = await query.getManyAndCount();

    return {
      data: result,
      count: total,
      page,
      limit,
    };
  }

  async findClientOrdemSevicoById(ordemServicoId: string) {
    return await this.reqServicoRepository
      .createQueryBuilder('reqServico')
      .leftJoinAndSelect('reqServico.user', 'user')
      .leftJoinAndSelect('reqServico.servico', 'servico')
      .leftJoinAndSelect('reqServico.items', 'items')
      .leftJoinAndSelect('reqServico.comentarios', 'comentarios')
      .where('reqServico.id = :id', { id: ordemServicoId })
      .select([
        'reqServico.id',
        'reqServico.descricao',
        'user.name',
        'user.email',
        'user.phone',
        'servico',
        'items',
        'comentarios',
      ])
      .getOne();
  }
}
