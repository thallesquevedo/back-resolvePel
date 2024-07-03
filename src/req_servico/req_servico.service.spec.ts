import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemsService } from 'src/items/items.service';
import { ServicosService } from 'src/servicos/servicos.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { CreateReqServicoDto } from './dto/create-req_servico.dto';
import { ReqServico } from './entities/req_servico.entity';
import { ReqServicoService } from './req_servico.service';

const mockReqServicoRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn(),
  }),
});

const mockUserService = {
  findOne: jest.fn(),
};

const mockServicosService = {
  findOne: jest.fn(),
};

const mockItemsService = {
  findAllByIds: jest.fn(),
};

describe('ReqServicoService', () => {
  let service: ReqServicoService;
  let reqServicoRepository;
  let userService;
  let servicosService;
  let itemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReqServicoService,
        {
          provide: getRepositoryToken(ReqServico),
          useFactory: mockReqServicoRepository,
        },
        { provide: UserService, useValue: mockUserService },
        { provide: ServicosService, useValue: mockServicosService },
        { provide: ItemsService, useValue: mockItemsService },
      ],
    }).compile();

    service = module.get<ReqServicoService>(ReqServicoService);
    reqServicoRepository = module.get<Repository<ReqServico>>(
      getRepositoryToken(ReqServico),
    );
    userService = module.get<UserService>(UserService);
    servicosService = module.get<ServicosService>(ServicosService);
    itemsService = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createReqServico', () => {
    it('should throw an error if servicoId, itemIds, or descricao are missing', async () => {
      const user = new User();
      const createReqServicoDto: CreateReqServicoDto = {
        servicoId: null,
        itemIds: [],
        descricao: '',
      };

      await expect(
        service.createReqServico(user, createReqServicoDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should create a new ReqServico', async () => {
      const user = new User();
      user.id = 'userId';
      const createReqServicoDto: CreateReqServicoDto = {
        servicoId: 1,
        itemIds: [1, 2],
        descricao: 'descricao',
      };

      userService.findOne.mockResolvedValue(user);
      servicosService.findOne.mockResolvedValue({});
      itemsService.findAllByIds.mockResolvedValue([{}, {}]);
      reqServicoRepository.create.mockReturnValue({ id: 'reqServicoId' });
      reqServicoRepository.save.mockResolvedValue({ id: 'reqServicoId' });

      const result = await service.createReqServico(user, createReqServicoDto);

      expect(result).toEqual({ id: 'reqServicoId' });
      expect(userService.findOne).toHaveBeenCalledWith(user.id);
      expect(servicosService.findOne).toHaveBeenCalledWith('servicoId');
      expect(itemsService.findAllByIds).toHaveBeenCalledWith([
        'itemId1',
        'itemId2',
      ]);
      expect(reqServicoRepository.create).toHaveBeenCalled();
      expect(reqServicoRepository.save).toHaveBeenCalled();
    });
  });
});
