import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ReqServicoService } from './req_servico.service';
import { ReqServico } from './entities/req_servico.entity';
import { UserService } from 'src/user/user.service';
import { ServicosService } from 'src/servicos/servicos.service';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/user/entities/user.entity';

describe('ReqServicoService', () => {
  let service: ReqServicoService;
  let reqServicoRepository;
  let userService;
  let servicoService;
  let itemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReqServicoService,
        {
          provide: getRepositoryToken(ReqServico),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            create: jest.fn().mockReturnValue({}),
            createQueryBuilder: jest.fn().mockReturnValue({
              leftJoinAndSelect: jest.fn().mockReturnThis(),
              where: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              getMany: jest.fn(),
              getOne: jest.fn(),
            }),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ServicosService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ItemsService,
          useValue: {
            findAllByIds: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReqServicoService>(ReqServicoService);
    reqServicoRepository = module.get(getRepositoryToken(ReqServico));
    userService = module.get<UserService>(UserService);
    servicoService = module.get<ServicosService>(ServicosService);
    itemService = module.get<ItemsService>(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAllByUserId', () => {
    it('should return all services for a user', async () => {
      const user = { id: '1' } as User;
      const result = [{ id: 1, descricao: 'test' }];
      reqServicoRepository.find.mockResolvedValue(result);

      expect(await service.findAllByUserId(user)).toBe(result);
      expect(reqServicoRepository.find).toHaveBeenCalledWith({
        where: { user: { id: user.id } },
        relations: ['servico', 'items'],
        order: { created_at: 'DESC' },
      });
    });
  });

  describe('findPrestadorOrdemServicoById', () => {
    it('should return the service order for a user', async () => {
      const ordemServicoId = '1';
      const user = { id: '1' } as User;
      const ordemServico = { id: ordemServicoId, user } as any;
      reqServicoRepository.findOne.mockResolvedValue(ordemServico);
      reqServicoRepository
        .createQueryBuilder()
        .getOne.mockResolvedValue(ordemServico);

      expect(
        await service.findPrestadorOrdemServicoById(ordemServicoId, user),
      ).toBe(ordemServico);
      expect(reqServicoRepository.findOne).toHaveBeenCalledWith({
        where: { id: ordemServicoId },
        relations: ['user', 'servico', 'items'],
      });
      expect(reqServicoRepository.createQueryBuilder).toHaveBeenCalled();
    });

    it('should throw BadRequestException if user does not match', async () => {
      const ordemServicoId = '1';
      const user = { id: '1' } as User;
      const ordemServico = { id: ordemServicoId, user: { id: 2 } } as any;
      reqServicoRepository.findOne.mockResolvedValue(ordemServico);

      await expect(
        service.findPrestadorOrdemServicoById(ordemServicoId, user),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('createReqServico', () => {
    it('should create a new service request', async () => {
      const user = { id: '1' } as User;
      const createReqServicoDto = {
        servicoId: 1,
        itemIds: [1, 2],
        descricao: 'desc',
      };
      const reqServico = { id: 1, ...createReqServicoDto } as any;
      userService.findOne.mockResolvedValue(user);
      servicoService.findOne.mockResolvedValue({ id: 1 });
      itemService.findAllByIds.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      reqServicoRepository.create.mockReturnValue(reqServico);
      reqServicoRepository.save.mockResolvedValue(reqServico);

      expect(await service.createReqServico(user, createReqServicoDto)).toBe(
        reqServico,
      );
      expect(userService.findOne).toHaveBeenCalledWith(user.id);
      expect(servicoService.findOne).toHaveBeenCalledWith(
        createReqServicoDto.servicoId,
      );
      expect(itemService.findAllByIds).toHaveBeenCalledWith(
        createReqServicoDto.itemIds,
      );
      expect(reqServicoRepository.create).toHaveBeenCalledWith({
        user,
        servico: { id: 1 },
        descricao: 'desc',
        items: [{ id: 1 }, { id: 2 }],
      });
      expect(reqServicoRepository.save).toHaveBeenCalledWith(reqServico);
    });

    it('should throw BadRequestException if data is missing', async () => {
      const user = { id: '1' } as User;
      const createReqServicoDto = {
        servicoId: null,
        itemIds: [1, 2],
        descricao: 'desc',
      };

      await expect(
        service.createReqServico(user, createReqServicoDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if servico not found', async () => {
      const user = { id: '1' } as User;
      const createReqServicoDto = {
        servicoId: 1,
        itemIds: [1, 2],
        descricao: 'desc',
      };
      userService.findOne.mockResolvedValue(user);
      servicoService.findOne.mockResolvedValue(null);

      await expect(
        service.createReqServico(user, createReqServicoDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if items not found', async () => {
      const user = { id: '1' } as User;
      const createReqServicoDto = {
        servicoId: 1,
        itemIds: [1, 2],
        descricao: 'desc',
      };
      userService.findOne.mockResolvedValue(user);
      servicoService.findOne.mockResolvedValue({ id: 1 });
      itemService.findAllByIds.mockResolvedValue([]);

      await expect(
        service.createReqServico(user, createReqServicoDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateReqServico', () => {
    it('should update an existing service order', async () => {
      const reqServicoId = '1';
      const user = { id: '1' } as User;
      const updateReqServicoDto = {
        servicoId: 1,
        itemIds: [1, 2],
        descricao: 'new desc',
      };
      const ordemServico = {
        id: reqServicoId,
        user,
        ...updateReqServicoDto,
        updated_at: new Date(),
      } as any;

      reqServicoRepository.findOne.mockResolvedValue(ordemServico);
      servicoService.findOne.mockResolvedValue({ id: 1 });
      itemService.findAllByIds.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      reqServicoRepository.save.mockResolvedValue(ordemServico);

      const updatedOrdemServico = await service.updateOrdemServico(
        reqServicoId,
        user,
        updateReqServicoDto,
      );

      expect(updatedOrdemServico).toEqual({
        ...ordemServico,
        updated_at: expect.any(Date), // Verifica se updated_at é uma instância de Date
      });
      expect(reqServicoRepository.findOne).toHaveBeenCalledWith({
        where: { id: reqServicoId },
        relations: ['user', 'servico', 'items'],
      });
      expect(servicoService.findOne).toHaveBeenCalledWith(
        updateReqServicoDto.servicoId,
      );
      expect(itemService.findAllByIds).toHaveBeenCalledWith(
        updateReqServicoDto.itemIds,
      );
      expect(reqServicoRepository.save).toHaveBeenCalledWith(ordemServico);
    });

    it('should throw BadRequestException if user does not match', async () => {
      const reqServicoId = '1';
      const user = { id: '1' } as User;
      const updateReqServicoDto = {
        descricao: 'new desc',
        itemIds: [1, 2],
        servicoId: 1,
      };
      const ordemServico = { id: reqServicoId, user: { id: 2 } } as any;
      reqServicoRepository.findOne.mockResolvedValue(ordemServico);

      await expect(
        service.updateOrdemServico(reqServicoId, user, updateReqServicoDto),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw InternalServerErrorException on error', async () => {
      const reqServicoId = '1';
      const user = { id: '1' } as User;
      const updateReqServicoDto = {
        descricao: 'new desc',
        itemIds: [1, 2],
        servicoId: 1,
      };
      const ordemServico = { id: reqServicoId, user } as any;
      reqServicoRepository.findOne.mockResolvedValue(ordemServico);
      servicoService.findOne.mockRejectedValue(new Error());

      await expect(
        service.updateOrdemServico(reqServicoId, user, updateReqServicoDto),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('deleteOrdemServico', () => {
    it('should delete an existing service order', async () => {
      const ordemServicoId = '1';
      const user = { id: '1' } as User;
      const ordemServico = { id: ordemServicoId, user } as any;
      reqServicoRepository.findOne.mockResolvedValue(ordemServico);

      await service.deleteOrdemServico(ordemServicoId, user);

      expect(reqServicoRepository.findOne).toHaveBeenCalledWith({
        where: { id: ordemServicoId },
        relations: ['user', 'servico', 'items'],
      });
      expect(reqServicoRepository.delete).toHaveBeenCalledWith(ordemServicoId);
    });

    it('should throw BadRequestException if user does not match', async () => {
      const ordemServicoId = '1';
      const user = { id: '1' } as User;
      const ordemServico = { id: ordemServicoId, user: { id: 2 } } as any;
      reqServicoRepository.findOne.mockResolvedValue(ordemServico);

      await expect(
        service.deleteOrdemServico(ordemServicoId, user),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAllByCliente', () => {
    it('should return all services by client', async () => {
      const result = [{ id: 1, descricao: 'test' }];
      reqServicoRepository
        .createQueryBuilder()
        .getMany.mockResolvedValue(result);

      expect(await service.findAllByCliente()).toBe(result);
      expect(reqServicoRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findClientOrdemSevicoById', () => {
    it('should return a specific service order by client', async () => {
      const ordemServicoId = '1';
      const result = { id: ordemServicoId, descricao: 'test' };
      reqServicoRepository
        .createQueryBuilder()
        .getOne.mockResolvedValue(result);

      expect(await service.findClientOrdemSevicoById(ordemServicoId)).toBe(
        result,
      );
      expect(reqServicoRepository.createQueryBuilder).toHaveBeenCalled();
    });
  });
});
