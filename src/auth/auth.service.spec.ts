import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should return a valid JWT token for login', async () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      cpf: '12345678900',
      phone: '123456789',
      created_at: new Date(),
      updated_at: new Date(),
      req_servico: [],
    };
  
    jest.spyOn(jwtService, 'sign').mockReturnValueOnce('validToken');
  
    const result = await authService.login(user);
  
    expect(result.status).toBe(true);
    expect(result.mensagem.codigo).toBe(201);
    expect(result.mensagem.texto).toBe('Usuário logado com sucesso');
    expect(result.conteudo.name).toBe(user.name);
    expect(result.conteudo.email).toBe(user.email);
    expect(result.conteudo.token).toBe('validToken');
  });

  
  it('should return user without password for valid credentials', async () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      cpf: '12345678900',
      phone: '123456789',
      created_at: new Date(),
      updated_at: new Date(),
      req_servico: [],
    };

    jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(user);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => true);

    const email = 'test@example.com';
    const password = 'validPassword';

    const result = await authService.validateUser(email, password);

    expect(result).toEqual({ ...user, password: undefined });
  });

  it('should throw UnauthorizedException for invalid credentials', async () => {
    jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(null);

    const email = 'test@example.com';
    const password = 'invalidPassword';

    await expect(authService.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException for invalid password', async () => {
    const user: User = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      cpf: '12345678900',
      phone: '123456789',
      created_at: new Date(),
      updated_at: new Date(),
      req_servico: [],
    };

    jest.spyOn(userService, 'findByEmail').mockResolvedValueOnce(user);
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(async () => false);

    const email = 'test@example.com';
    const password = 'invalidPassword';

    await expect(authService.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
  });
});
