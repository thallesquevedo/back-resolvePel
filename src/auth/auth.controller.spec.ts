import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRequest } from './dto/auth-request';
import { User } from '../user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn().mockResolvedValue({
              status: true,
              mensagem: {
                codigo: 201,
                texto: 'Usuário logado com sucesso',
              },
              conteudo: {
                name: 'Test User',
                email: 'test@example.com',
                token: 'generated-token',
              },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a valid JWT token for login', async () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword',
      cpf: '12345678900',
      phone: '123456789',
      created_at: new Date(),
      updated_at: new Date(),
    };
    
    const authRequest: AuthRequest = { user: user } as AuthRequest;
    const result = await controller.login(authRequest);

    expect(authService.login).toHaveBeenCalledWith(user);
    expect(result).toEqual({
      status: true,
      mensagem: {
        codigo: 201,
        texto: 'Usuário logado com sucesso',
      },
      conteudo: {
        name: 'Test User',
        email: 'test@example.com',
        token: 'generated-token',
      },
    });
  });
});
