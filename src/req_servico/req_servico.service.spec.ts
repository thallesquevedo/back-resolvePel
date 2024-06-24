import { Test, TestingModule } from '@nestjs/testing';
import { ReqServicoService } from './req_servico.service';

describe('ReqServicoService', () => {
  let service: ReqServicoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReqServicoService],
    }).compile();

    service = module.get<ReqServicoService>(ReqServicoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
