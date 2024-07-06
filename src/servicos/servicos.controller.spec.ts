import { Test, TestingModule } from '@nestjs/testing';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';
import { Servico } from './entities/servico.entity';

describe('ServicosController', () => {
  let controller: ServicosController;
  let servicosService: ServicosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicosController],
      providers: [
        {
          provide: ServicosService,
          useValue: {
            findAllServicos: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ServicosController>(ServicosController);
    servicosService = module.get<ServicosService>(ServicosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(servicosService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all services', async () => {
      const mockServicos: Servico[] = [
        { id: 1, name: 'Serviço 1', created_at: new Date(), req_servico: [] },
        { id: 2, name: 'Serviço 2', created_at: new Date(), req_servico: [] },
      ];

      jest.spyOn(servicosService, 'findAllServicos').mockResolvedValue(mockServicos);

      const result = await controller.findAll();

      expect(result).toEqual(mockServicos);
    });
  });

});