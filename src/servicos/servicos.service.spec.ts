import { Test, TestingModule } from '@nestjs/testing';
import { ServicosService } from './servicos.service';
import { Servico } from './entities/servico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('ServicosService', () => {
  let service: ServicosService;
  let repository: Repository<Servico>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicosService, { 
        provide: getRepositoryToken(Servico),
        useValue: {
          findOneBy: jest.fn(),
          find: jest.fn(),
        } }],
    }).compile();

    service = module.get<ServicosService>(ServicosService);
    repository = module.get<Repository<Servico>>(getRepositoryToken(Servico));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne and findAllService', () => {
    it('should return an array of servicos when findAllServicos is called', async () => {
      const mockServicos = [
        { id: 1, name: 'Serviço 1', created_at: new Date(), req_servico: []},
        { id: 2, name: 'Serviço 2', created_at: new Date(), req_servico: [] },
      ];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(mockServicos);
  
      const result = await service.findAllServicos();
  
      expect(result).toEqual(mockServicos);
    });
  
    it('should find a servico by id', async () => {
      const mockServico = { id: 1, name: 'Serviço 1', created_at: new Date(), req_servico: []};
      jest.spyOn(repository, 'findOneBy').mockResolvedValueOnce(mockServico);
    
      const result = await service.findOne(1);
      expect(result).toEqual(mockServico);
      expect(repository.findOneBy).toBeCalledWith({ id: 1 });
    });
  });
  
});
