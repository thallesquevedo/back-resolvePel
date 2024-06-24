import { Test, TestingModule } from '@nestjs/testing';
import { ReqServicoController } from './req_servico.controller';
import { ReqServicoService } from './req_servico.service';

describe('ReqServicoController', () => {
  let controller: ReqServicoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReqServicoController],
      providers: [ReqServicoService],
    }).compile();

    controller = module.get<ReqServicoController>(ReqServicoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
