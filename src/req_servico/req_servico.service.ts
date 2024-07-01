import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemsService } from 'src/items/items.service';
import { ServicosService } from 'src/servicos/servicos.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { DeepPartial, Repository } from 'typeorm';
import { CreateReqServicoDto } from './dto/create-req_servico.dto';
import { ReqServico } from './entities/req_servico.entity';
import { UpdateReqServicoDto } from './dto/update-req_servico.dto';

@Injectable()
export class ReqServicoService {
  constructor(
    @InjectRepository(ReqServico)
    private readonly reqServicoRepository: Repository<ReqServico>,
    private userService: UserService,
    private servicoService: ServicosService,
    private itemService: ItemsService,
  ) {}

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
          codigo: 400,
          texto: 'Serviço não encontrado.',
        },
      });
    }

    if (findItems.length === 0) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
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

  async findAllByUserId(user: User) {
    return await this.reqServicoRepository.find({
      where: { user: { id: user.id } },
      relations: ['servico', 'items'],
    });
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
          codigo: 400,
          texto: 'Você não tem permissão para atualizar esta ordem de serviço.',
        },
      });
    }

    if (!ordemServico) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
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
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Erro ao atualizar ordem de serviço.',
        },
      });
    }
  }

  async findPrestadorOrdemServicoById(ordemServicoId: string) {
    return await this.reqServicoRepository
      .createQueryBuilder('reqServico')
      .leftJoinAndSelect('reqServico.user', 'user')
      .leftJoinAndSelect('reqServico.servico', 'servico')
      .leftJoinAndSelect('reqServico.items', 'items')
      .where('reqServico.id = :id', { id: ordemServicoId })
      .select(['reqServico.id', 'servico', 'items', 'reqServico.descricao'])
      .getOne();
  }

  async findAllByCliente() {
    return await this.reqServicoRepository
      .createQueryBuilder('reqServico')
      .leftJoinAndSelect('reqServico.user', 'user')
      .leftJoinAndSelect('reqServico.servico', 'servico')
      .leftJoinAndSelect('reqServico.items', 'items')
      .select([
        'reqServico.id',
        'reqServico.descricao',
        'user.name',
        'user.email',
        'user.phone',
        'servico',
        'items',
      ])
      .getMany();
  }

  async findClientOrdemSevicoById(ordemServicoId: string) {
    return await this.reqServicoRepository
      .createQueryBuilder('reqServico')
      .leftJoinAndSelect('reqServico.user', 'user')
      .leftJoinAndSelect('reqServico.servico', 'servico')
      .leftJoinAndSelect('reqServico.items', 'items')
      .where('reqServico.id = :id', { id: ordemServicoId })
      .select([
        'reqServico.id',
        'reqServico.descricao',
        'user.name',
        'user.email',
        'user.phone',
        'servico',
        'items',
      ])
      .getOne();
  }
}
