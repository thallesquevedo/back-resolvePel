import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CheckPhoneRegisterDto } from './dto/check-phone-register.dto';
import { CheckEmailRegisterDto } from './dto/check-email-register.dto';

const userList = [
  new User({
    name: 'João',
    email: 'joao@gmail.com',
    // password: '12345678',
    phone: '+5553123456789',
    cpf: '12345678901',
  }),
];

const objectReturn = [
  {
    status: true,
    mensagem: {
      codigo: 200,
      texto: 'Telefone disponível',
    },
    conteudo: null,
  },
  {
    status: true,
    mensagem: {
      codigo: 200,
      texto: 'Email disponível',
    },
    conteudo: null,

  }
];

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            create: jest.fn().mockReturnValue(userList[0]),
            save: jest.fn().mockResolvedValue(userList[0]),
            findOneBy: jest.fn(),
            findByPhone: jest.fn().mockRejectedValueOnce(BadRequestException),
            findByEmail: jest.fn().mockRejectedValueOnce(BadRequestException),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });

  describe('create user', () => {
    it('should create a user', async () => {
      const data: CreateUserDto = {
        name: 'João',
        email: 'joao@gmail.com',
        password: '12345678',
        cpf: '12345678901',
        phone: '+5553123456789',
      };

      const result = await service.create(data);

      expect(result).toEqual({
        status: true,
        mensagem: {
          codigo: 201,
          texto: 'Usuário criado com sucesso',
        },
        conteudo: null,
      });
    });

    it('should throw error when phone already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(new BadRequestException());

      expect(service.findByPhone).rejects.toThrow();
    });

    it('should throw error when email already exists', async () => {
      jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(new BadRequestException({}));

      expect(service.findByEmail).rejects.toThrow();
    });

    describe('check phone register', () => {

      it('create user with available phone number', async () => {
        const data: CheckPhoneRegisterDto = {
          phone: '+5553123456789',
        };

        const result = await service.checkPhoneRegister(data);

        expect(result).toEqual(objectReturn[0]);
      });

      it('should return throw error when inserting already registered phone number', async () => {
        jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(new BadRequestException());
        expect(service.checkPhoneRegister).rejects.toThrow();
      });
    });

    describe('check email register', () => {
      it('should return throw error when inserting already registered email', async () => {
        jest.spyOn(repository, 'findOneBy').mockRejectedValueOnce(new BadRequestException());

        expect(service.checkEmailRegister).rejects.toThrow();
      });

      it('create user with available email', async () => {
        const data: CheckEmailRegisterDto = {
          email: 'joao@gmail.com',
        };

        const result = await service.checkEmailRegister(data);

        expect(result).toEqual(objectReturn[1]);
      });
    });
  });
  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const mockUserId = 'someUserId';
      const mockUser = new User({
        id: mockUserId,
        name: 'Mock User',
        email: 'mock@example.com',
        phone: '+123456789',
        cpf: '12345678901',
      });
      
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
  
      const result = await service.findOne(mockUserId);
  
      expect(result).toEqual(mockUser);
    });
  
    it('should throw HttpException when user is not found', async () => {
      const mockUserId = 'invalidUserId';
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
  
      await expect(service.findOne(mockUserId)).rejects.toThrowError(
        new HttpException('User not found', HttpStatus.NOT_FOUND),
      );
    });
  });
  
});
