import { Test, TestingModule } from '@nestjs/testing';
import { ComentariosService } from './comentarios.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Comentario } from './entities/comentario.entity';
import { Repository } from 'typeorm';
import { ReqServicoService } from 'src/req_servico/req_servico.service';
import { UserService } from 'src/user/user.service';
import { BadRequestException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';

describe('ComentariosService', () => {
  let service: ComentariosService;
  let comentarioRepository: Repository<Comentario>;
  let reqServicoService: ReqServicoService;
  let userService: UserService;

  const mockComentarioRepository = {
    save: jest.fn(),
  };

  const mockReqServicoService = {
    findClientOrdemSevicoById: jest.fn(),
  };

  const mockUserService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComentariosService,
        {
          provide: getRepositoryToken(Comentario),
          useValue: mockComentarioRepository,
        },
        {
          provide: ReqServicoService,
          useValue: mockReqServicoService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<ComentariosService>(ComentariosService);
    comentarioRepository = module.get<Repository<Comentario>>(
      getRepositoryToken(Comentario),
    );
    reqServicoService = module.get<ReqServicoService>(ReqServicoService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createComentarioDto: CreateComentarioDto = {
      comentario: 'Ótimo serviço!',
      reqServicoId: 'req1',
      rating: 5,
    };

    const user = { id: 'user1', name: 'Test User' } as any;

    it('should throw an exception if required fields are missing', async () => {
      const incompleteDto = { ...createComentarioDto, reqServicoId: undefined };
      await expect(service.create(user, incompleteDto)).rejects.toThrow(
        new BadRequestException({
          status: false,
          mensagem: {
            codigo: 400,
            texto:
              'É necessário informar o id da requisição de serviço, o id do usuário e o comentário.',
          },
        }),
      );
    });

    it('should throw an exception if reqServico is not found', async () => {
      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(reqServicoService, 'findClientOrdemSevicoById')
        .mockResolvedValue(null);

      await expect(service.create(user, createComentarioDto)).rejects.toThrow(
        new BadRequestException({
          status: false,
          mensagem: {
            codigo: 404,
            texto: 'Requisição de serviço não encontrada.',
          },
        }),
      );
    });

    it('should save the comentario successfully', async () => {
      const reqServico = { id: 'req1' } as any;

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(reqServicoService, 'findClientOrdemSevicoById')
        .mockResolvedValue(reqServico);
      jest.spyOn(comentarioRepository, 'save').mockResolvedValue({
        id: 1,
        comentario: 'Ótimo serviço!',
        user,
        reqServico,
        rating: 5,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const result = await service.create(user, createComentarioDto);

      expect(comentarioRepository.save).toHaveBeenCalledWith({
        comentario: 'Ótimo serviço!',
        user,
        reqServico,
        rating: 5,
      });

      expect(result).toEqual({
        status: true,
        mensagem: {
          codigo: 201,
          texto: 'Comentário criado com sucesso.',
        },
      });
    });

    it('should handle repository save errors', async () => {
      const reqServico = { id: 'req1' } as any;

      jest.spyOn(userService, 'findOne').mockResolvedValue(user);
      jest
        .spyOn(reqServicoService, 'findClientOrdemSevicoById')
        .mockResolvedValue(reqServico);
      jest.spyOn(comentarioRepository, 'save').mockRejectedValue(new Error());

      await expect(service.create(user, createComentarioDto)).rejects.toThrow(
        new BadRequestException({
          status: false,
          mensagem: {
            codigo: 400,
            texto: 'Erro ao criar comentário.',
          },
        }),
      );
    });
  });
});
