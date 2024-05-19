import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';

const newUserEntity = new User({
  name: 'João Souza',
  email: 'joao@email.com',
  password: '123456789',
  cpf: '12345678901',
  phone: '53999999999',
});

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
        providers: [
          {
            provide: UserService,
            useValue: {
              create: jest.fn().mockResolvedValue(newUserEntity),
              findByPhone: jest.fn().mockResolvedValue(newUserEntity),
              findByEmail: jest.fn().mockResolvedValue(newUserEntity),
              findOne: jest.fn(),
            },
          },
        ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully with unique email and phone', async () => {
      const body: CreateUserDto = {
        name: 'João Souza',
        email: 'joao@email.com',
        password: '123456789',
        cpf: '12345678901',
        phone: '53999999999',
      };

      const result = await controller.create(body);

      expect(result).toEqual(newUserEntity);
    });

    it('should throw BadRequestException for existing phone', async () => {
      const body: CreateUserDto = {
        name: 'Jão Lopez',
        email: 'novo@email.com',
        password: 'senha12345678',
        cpf: '98765432109',
        phone: '53999999999',
      };

      try {
        await controller.create(body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Email já existe');
        expect(service.findByEmail).toHaveBeenCalledWith('joao@email.com');
      }
    });

    it('should throw BadRequestException for existing email', async () => {
      const body: CreateUserDto = {
        name: 'Novo Usuário',
        email: 'joao@email.com',
        password: 'novasenha123',
        cpf: '98765432109',
        phone: '53999999998',
      };

      try {
        await controller.create(body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Telefone já existe');
      }
    });
  }),
    describe('findOne', () => {
      it('should return user when user exists', async () => {
        // Criando um usuário existente para simular o retorno da função findOne
        const user = new User({
          id: '1',
          name: 'Usuário Existente',
          email: 'usuario@email.com',
          password: 'senha123',
          cpf: '12345678901',
          phone: '55555555555',
        });
        jest.spyOn(service, 'findOne').mockResolvedValue(user);

        const userId = '1';
        const result = await service.findOne(userId);

        expect(result).toEqual(user);
      });
      it('should throw HttpException when user does not exist', async () => {
        jest.spyOn(service, 'findOne').mockResolvedValue(null);

        const userId = '2'; // ID de usuário que não existe
        try {
          await service.findOne(userId);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('User not found');
          expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        }
      });
    });
});
