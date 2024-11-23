import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
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
import { PaginationDTO } from './dto/pagination.dto';
import { CreateReqServicoDto } from './dto/create-req_servico.dto';

describe('ReqServicoService', () => {
  let service: ReqServicoService;
  let reqServicoRepository;
  let userService: jest.Mocked<UserService>;
  let servicoService: jest.Mocked<ServicosService>;
  let itemService: jest.Mocked<ItemsService>;

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
            findAndCount: jest.fn(),
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
    userService = module.get(UserService);
    servicoService = module.get(ServicosService);
    itemService = module.get(ItemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

  describe('deleteOrdemServico', () => {
    it('should delete an existing service order', async () => {
      const ordemServicoId = '1';
      const user = { id: '1' } as User;
      const ordemServico = { id: ordemServicoId, user } as any;
    
      jest.spyOn(reqServicoRepository, 'findOne').mockResolvedValue(ordemServico);
      jest.spyOn(reqServicoRepository, 'delete').mockResolvedValue({ affected: 1 } as any);
    
      await service.deleteOrdemServico(ordemServicoId, user);
    
      expect(reqServicoRepository.findOne).toHaveBeenCalledWith({
        where: { id: ordemServicoId },
        relations: ['user', 'servico', 'items', 'comentarios'],
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
    it('should return all services by client with pagination and no search filter', async () => {
      const resultData = [{ id: 1, descricao: 'test' }];
      const totalCount = 1;
      const paginationDTO = { page: 1, skip: 1, limit: 10, search: "" };
  
      const queryBuilderMock = {
        andWhere: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([resultData, totalCount]),
      };
  
      jest.spyOn(reqServicoRepository, 'createQueryBuilder').mockReturnValue(queryBuilderMock as any);

      const serviceResult = await service.findAllByCliente(paginationDTO);

      expect(serviceResult).toEqual({
        data: resultData,
        count: totalCount,
        page: paginationDTO.page,
        limit: paginationDTO.limit,
      });
      expect(reqServicoRepository.createQueryBuilder).toHaveBeenCalled();
      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith('reqServico.user', 'user');
      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith('reqServico.servico', 'servico');
      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledWith('reqServico.items', 'items');
      expect(queryBuilderMock.skip).toHaveBeenCalledWith((paginationDTO.page - 1) * paginationDTO.limit);
      expect(queryBuilderMock.take).toHaveBeenCalledWith(paginationDTO.limit);
      expect(queryBuilderMock.andWhere).not.toHaveBeenCalled();
    });
  });
 
  describe('PaginationDTO', () => {
    it('should transform skip and limit to numbers', async () => {
      const dto = plainToInstance(PaginationDTO, { skip: '5', limit: '10' });
      
      expect(dto.skip).toBe(5); // Verifica que o skip foi convertido para número
      expect(dto.limit).toBe(10); // Verifica que o limit foi convertido para número
    });
  
    it('should pass validation when skip and limit are positive numbers', async () => {
      const dto = plainToInstance(PaginationDTO, { skip: 5, limit: 10 });
      const errors = await validate(dto);
  
      expect(errors.length).toBe(0); // Nenhum erro significa que a validação passou
    });
  
    it('should fail validation when skip or limit are not positive numbers', async () => {
      const dto = plainToInstance(PaginationDTO, { skip: -5, limit: 0 });
      const errors = await validate(dto);
  
      expect(errors.length).toBeGreaterThan(0); // Deve haver erros para valores negativos ou zero
      expect(errors.map(e => e.property)).toEqual(expect.arrayContaining(['skip', 'limit']));
    });
  });
  describe('findAllByUserId', () => {
    it('should return paginated reqServico for a user', async () => {
    
      const paginatedData = {
        data: [{ id: 1, name: 'Teste'}],
        count: 1,
        limit: 5,
        page: 1,
      };
  
      reqServicoRepository.findAndCount = jest.fn().mockResolvedValue([paginatedData.data, paginatedData.count]);
  
      const result = await service.findAllByUserId({ id: '1' } as User, {} as PaginationDTO);
  
      expect(result).toStrictEqual(paginatedData);
      expect(reqServicoRepository.findAndCount).toHaveBeenCalledWith(expect.anything());
    });
  });

  describe('findPrestadorOrdemServicoById e CreateReqServico', () => {
    it('should return reqServico if user has access', async () => {
      const reqServicoId = 'someServicoId';
      const user = { id: 1, name: 'Test User' } as unknown as User;
      const expectedReqServico = new ReqServico();
      expectedReqServico.id = reqServicoId; 
      expectedReqServico.user = new User(); 
      expectedReqServico.user.id = user.id;
    
      jest.spyOn(reqServicoRepository, 'findOne').mockResolvedValueOnce({
        id: reqServicoId,
        user: { id: user.id },
        servico: {},
        items: [],
        comentarios: [],
      } as any);
      
      const queryBuilderMock = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValueOnce(expectedReqServico),
      };
    
      jest.spyOn(reqServicoRepository, 'createQueryBuilder').mockImplementation(() => queryBuilderMock as any);
    
      const result = await service.findPrestadorOrdemServicoById(reqServicoId, user);
    
      expect(result).toStrictEqual(expectedReqServico);
      expect(reqServicoRepository.findOne).toHaveBeenCalledWith({
        where: { id: reqServicoId },
        relations: ['user', 'servico', 'items', 'comentarios'],
      });
      expect(queryBuilderMock.leftJoinAndSelect).toHaveBeenCalledTimes(4); // Verifica se todos os joins foram aplicados
      expect(queryBuilderMock.getOne).toHaveBeenCalled();
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

    it('should create a new service request', async () => {
      const user = { id: 'userId', name: 'Test User' } as User;
      const createReqServicoDto: CreateReqServicoDto = {
        servicoId: 1,
        itemIds: [1, 2],
        descricao: 'desc',
      };
      const findServico = {
        id: createReqServicoDto.servicoId,
        name: 'Servico Test',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [] 
      };
      const findItems = [
        { id: 1, name: 'Item Test 1', created_at: new Date() },
        { id: 2, name: 'Item Test 2', created_at: new Date() },
      ];
      const createdReqServico = {
        id: 'reqServicoId',
        user,
        servico: findServico,
        descricao: createReqServicoDto.descricao,
        items: findItems,
      };
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest.spyOn(servicoService, 'findOne').mockResolvedValue(findServico);
      jest.spyOn(itemService, 'findAllByIds').mockResolvedValue(findItems);
      jest.spyOn(reqServicoRepository, 'create').mockReturnValue(createdReqServico as any);
      jest.spyOn(reqServicoRepository, 'save').mockResolvedValue(createdReqServico as any);

      const result = await service.createReqServico(user, createReqServicoDto);

      expect(result).toStrictEqual(createdReqServico);
      expect(userService.findOne).toHaveBeenCalledWith(user.id);
      expect(servicoService.findOne).toHaveBeenCalledWith(createReqServicoDto.servicoId);
      expect(itemService.findAllByIds).toHaveBeenCalledWith(createReqServicoDto.itemIds);
      expect(reqServicoRepository.create).toHaveBeenCalledWith({
        user,
        servico: findServico,
        descricao: createReqServicoDto.descricao,
        items: findItems,
      });
      expect(reqServicoRepository.save).toHaveBeenCalledWith(createdReqServico);
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
      itemService.findAllByIds.mockResolvedValue([]);

      await expect(
        service.createReqServico(user, createReqServicoDto),
      ).rejects.toThrow(BadRequestException);
    });

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
      servicoService.findOne.mockResolvedValue({
         id: 1, 
         name: 'Servico Test',
         created_at: new Date(),
         req_servico: []});
      itemService.findAllByIds.mockResolvedValue([
        { id: 1, name: 'Item Test 1', created_at: new Date() },
        { id: 2, name: 'Item Test 2', created_at: new Date() },
      ]);
      reqServicoRepository.save.mockResolvedValue(ordemServico);

      const updatedOrdemServico = await service.updateOrdemServico(
        reqServicoId,
        user,
        updateReqServicoDto,
      );

      expect(updatedOrdemServico).toEqual({
        ...ordemServico,
        updated_at: expect.any(Date),
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
});
