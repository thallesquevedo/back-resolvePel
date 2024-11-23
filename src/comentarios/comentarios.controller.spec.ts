import { Test, TestingModule } from '@nestjs/testing';
import { ComentariosController } from './comentarios.controller';
import { ComentariosService } from './comentarios.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { AuthRequest } from 'src/auth/dto/auth-request';
import { ExecutionContext } from '@nestjs/common';

describe('ComentariosController', () => {
  let controller: ComentariosController;
  let comentariosService: ComentariosService;

  const mockComentariosService = {
    create: jest.fn(),
  };

  const mockAuthGuard = {
    canActivate: jest.fn((context: ExecutionContext) => {
      const req = context.switchToHttp().getRequest();
      req.user = { id: 'user1', name: 'Test User' };
      return true;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComentariosController],
      providers: [
        {
          provide: ComentariosService,
          useValue: mockComentariosService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue(mockAuthGuard)
      .compile();

    controller = module.get<ComentariosController>(ComentariosController);
    comentariosService = module.get<ComentariosService>(ComentariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call comentariosService.create with the correct parameters', async () => {
      const createComentarioDto: CreateComentarioDto = {
        reqServicoId: 'req1',
        comentario: 'Ótimo serviço!',
        userId: 'user1',
        rating: 5,
      };
      const req: AuthRequest = {
        user: { id: 'user1', name: 'Test User' },
      } as AuthRequest;

      const expectedResponse = {
        id: 1,
        comentario: 'Ótimo serviço!',
        rating: 5,
        created_at: new Date(),
        updated_at: new Date(),
        reqServico: { id: 'req1' },
        user: { id: 'user1', name: 'Test User' },
      };

      jest
        .spyOn(mockComentariosService, 'create')
        .mockResolvedValue(expectedResponse);

      const result = await controller.create(req, createComentarioDto);

      expect(mockComentariosService.create).toHaveBeenCalledWith(
        req.user,
        createComentarioDto,
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should handle validation errors from comentariosService.create', async () => {
      const createComentarioDto: CreateComentarioDto = {
        reqServicoId: 'req1',
        comentario: 'Ótimo serviço!',
        userId: 'user1',
        rating: 6,
      };
      const req: AuthRequest = {
        user: { id: 'user1', name: 'Test User' },
      } as AuthRequest;

      jest
        .spyOn(mockComentariosService, 'create')
        .mockRejectedValue(new Error('Validation failed'));

      await expect(
        controller.create(req, createComentarioDto),
      ).rejects.toThrow('Validation failed');
    });
  });
});
