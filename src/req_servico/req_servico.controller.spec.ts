import { Test, TestingModule } from '@nestjs/testing';
import { ReqServicoController } from './req_servico.controller';
import { ReqServicoService } from './req_servico.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateReqServicoDto } from './dto/create-req_servico.dto';
import { AuthRequest } from 'src/auth/dto/auth-request';
import { GetOrdemServicoDto } from './dto/get-ordem-servico.dto';
import { UpdateReqServicoDto } from './dto/update-req_servico.dto'; 

describe('ReqServicoController', () => {
  let reqServiceController: ReqServicoController;
  let reqServicoService: ReqServicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReqServicoController],
      providers: [
        {
          provide: ReqServicoService,
          useValue: {
            findAllByUserId: jest.fn(),
            findPrestadorOrdemServicoById: jest.fn(),
            createReqServico: jest.fn(),
            updateOrdemServico: jest.fn(),
            deleteOrdemServico: jest.fn(),
            findAllByClienteId: jest.fn(),
            findClientOrdemSevicoById: jest.fn(),
          },
        }
      ],
    })
    .overrideGuard(AuthGuard('jwt'))
    .useValue({
      canActivate: jest.fn(() => true),
    })
    .compile();

    reqServiceController = module.get<ReqServicoController>(ReqServicoController);
    reqServicoService = module.get<ReqServicoService>(ReqServicoService);
  });

  it('should be defined', () => {
    expect(reqServiceController).toBeDefined();
    expect(reqServicoService).toBeDefined();
  });

                               
  describe('findAllByUser', () => {
    it('should return a list of services for an authenticated user', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const mockServices = [{ id: 'service1' }, { id: 'service2' }];
      (reqServicoService.findAllByUserId as jest.Mock).mockResolvedValue(mockServices);
  
      const result = await reqServiceController.findAllByUser({ user: mockUser } as AuthRequest);
  
      expect(result).toBe(mockServices);
      expect(reqServicoService.findAllByUserId).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findPrestadorOrdemServicoById', () => {
    it('should throw an exception if the service method throws an error', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const getOrderServicoDto: GetOrdemServicoDto = { id: 'order1' };
      const errorMessage = 'An error occurred';
      (reqServicoService.findPrestadorOrdemServicoById as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
      await expect(reqServiceController.findPrestadorOrdemServicoById(getOrderServicoDto, { user: mockUser } as AuthRequest)).rejects.toThrow(errorMessage);
      expect(reqServicoService.findPrestadorOrdemServicoById).toHaveBeenCalledWith(getOrderServicoDto.id, mockUser);
    });
  });

  describe('create', () => {
    it('should create a new service request and return the result', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const createReqServicoDto: CreateReqServicoDto = { servicoId: 1, itemIds: [1, 2], descricao: 'Service Description'};
      const mockResult = { id: 'service1', ...createReqServicoDto };
      (reqServicoService.createReqServico as jest.Mock).mockResolvedValue(mockResult);
  
      const result = await reqServiceController.create({ user: mockUser } as AuthRequest, createReqServicoDto);
  
      expect(result).toBe(mockResult);
      expect(reqServicoService.createReqServico).toHaveBeenCalledWith(mockUser, createReqServicoDto);
    });
  
    it('should throw an exception if the service method throws an error', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const createReqServicoDto: CreateReqServicoDto = { servicoId: 1, itemIds: [1, 2], descricao: 'Service Description' };
      const errorMessage = 'An error occurred';
      (reqServicoService.createReqServico as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
      await expect(reqServiceController.create({ user: mockUser } as AuthRequest, createReqServicoDto)).rejects.toThrow(errorMessage);
      expect(reqServicoService.createReqServico).toHaveBeenCalledWith(mockUser, createReqServicoDto);
    });
  });

  describe('update', () => {
    it('should update a service request and return the result', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const reqServicoId = 'service1';
      const updateReqServicoDto: UpdateReqServicoDto = { servicoId: 1, itemIds: [1, 2], descricao: 'Service Description'};
      const mockResult = { id: 'service1', ...updateReqServicoDto };
      (reqServicoService.updateOrdemServico as jest.Mock).mockResolvedValue(mockResult);
  
      const result = await reqServiceController.update({ user: mockUser } as AuthRequest, reqServicoId, updateReqServicoDto);
  
      expect(result).toBe(mockResult);
      expect(reqServicoService.updateOrdemServico).toHaveBeenCalledWith(reqServicoId, mockUser, updateReqServicoDto);
    });
  
    it('should throw an exception if the service method throws an error', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const reqServicoId = 'service1';
      const updateReqServicoDto: UpdateReqServicoDto = { servicoId: 1, itemIds: [1, 2], descricao: 'Service Description'};
      const errorMessage = 'An error occurred';
      (reqServicoService.updateOrdemServico as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
      await expect(reqServiceController.update({ user: mockUser }  as AuthRequest, reqServicoId, updateReqServicoDto)).rejects.toThrow(errorMessage);
      expect(reqServicoService.updateOrdemServico).toHaveBeenCalledWith(reqServicoId, mockUser, updateReqServicoDto);
    });
  });

  describe('delete', () => {
    it('should delete an order service and return the result', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const ordemServicoId = 'service1';
      const mockResult = { success: true };
      (reqServicoService.deleteOrdemServico as jest.Mock).mockResolvedValue(mockResult);
  
      const result = await reqServiceController.deleteOrdemServico(ordemServicoId, { user: mockUser } as AuthRequest);
  
      expect(result).toBe(mockResult);
      expect(reqServicoService.deleteOrdemServico).toHaveBeenCalledWith(ordemServicoId, mockUser);
    });
  
    it('should throw an exception if the delete service method throws an error', async () => {
      const mockUser = {
        id: 'user123',
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
        created_at: new Date(),
        updated_at: new Date(),
        req_servico: [],
      };
      const ordemServicoId = 'service1';
      const errorMessage = 'An error occurred';
      (reqServicoService.deleteOrdemServico as jest.Mock).mockRejectedValue(new Error(errorMessage));
  
      await expect(reqServiceController.deleteOrdemServico(ordemServicoId, { user: mockUser } as AuthRequest)).rejects.toThrow(errorMessage);
      expect(reqServicoService.deleteOrdemServico).toHaveBeenCalledWith(ordemServicoId, mockUser);
    });

    it('should return a specific client order by id', async () => {
      const getOrdemServicoDto: GetOrdemServicoDto = { id: 'order1' };
      const mockOrder = { id: 'order1', title: 'Service 1' };
      (reqServicoService.findClientOrdemSevicoById as jest.Mock).mockResolvedValue(mockOrder);
  
      const result = await reqServiceController.findClientOrdemSevicoById(getOrdemServicoDto);
  
      expect(result).toBe(mockOrder);
      expect(reqServicoService.findClientOrdemSevicoById).toHaveBeenCalledWith(getOrdemServicoDto.id);
    });
  });
});
