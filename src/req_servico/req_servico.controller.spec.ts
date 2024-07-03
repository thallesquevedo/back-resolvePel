import { Test, TestingModule } from '@nestjs/testing';
import { ReqServicoController } from './req_servico.controller';
import { ReqServicoService } from './req_servico.service';

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
    }).compile();

    reqServiceController = module.get<ReqServicoController>(ReqServicoController);
    reqServicoService = module.get<ReqServicoService>(ReqServicoService);
  });

  it('should be defined', () => {
    expect(reqServiceController).toBeDefined();
    expect(reqServicoService).toBeDefined();
  });
});
