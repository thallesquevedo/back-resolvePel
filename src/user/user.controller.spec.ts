import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException, HttpException, HttpStatus } from '@nestjs/common';
import { CheckPhoneRegisterDto } from './dto/check-phone-register.dto';
import { CheckEmailRegisterDto } from './dto/check-email-register.dto';
import { Repository } from 'typeorm';

const newUserEntity = new User({
  name: 'João Souza',
  email: 'joao@email.com',
  password: '123456789',
  cpf: '12345678901',
  phone: '53999999999',
});

const objectOk = [
  {
    status: true,
    mensagem: {
      codigo: 200,
      texto: 'Telefone disponível',
    },
    conteudo: null,
  },
];

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;
  let repository: Repository<User>;

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
            checkPhoneRegister: jest.fn().mockReturnValue(objectOk),
            checkEmailRegister: jest.fn().mockReturnValue(objectOk),
          },
        },
        {
          provide: Repository,
          useValue: {
            findOneBy: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(Repository);
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

        const userId = '2';
        try {
          await service.findOne(userId);
        } catch (error) {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.message).toEqual('User not found');
          expect(error.getStatus()).toEqual(HttpStatus.NOT_FOUND);
        }
      });
    });
  describe('checkPhoneRegister', () => {
    it('should return "Telefone disponível" if phone is not registered', async () => {
      const body: CheckPhoneRegisterDto = {
        phone: '53999999999',
      };

      const result = await service.checkPhoneRegister(body);

      expect(result).toEqual(objectOk);
    });

    it('should throw BadRequestException if phone is already registered', async () => {
      const body: CheckPhoneRegisterDto = {
        phone: '53999999999',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(newUserEntity);

      try {
        await service.checkPhoneRegister(body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Telefone já cadastrado');
      }
    });

    it('should call checkPhoneRegister method of UserService with correct data', async () => {
      const data: CheckPhoneRegisterDto = {
        phone: '+5553123456789',
      };

      await controller.checkPhoneRegister(data);

      expect(service.checkPhoneRegister).toHaveBeenCalledWith(data);
    });
  });

  describe('checkEmailRegister', () => {
    it('should throw BadRequestException if email is already registered', async () => {
      const body: CheckEmailRegisterDto = {
        email: 'joao@email.com',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(newUserEntity);

      try {
        await service.checkEmailRegister(body);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toEqual('Email já cadastrado');
      }
    });

    it('should return "Email disponível" if email is not registered', async () => {
      const body: CheckEmailRegisterDto = {
        email: 'novo@email.com',
      };

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      const result = await service.checkEmailRegister(body);

      expect(result).toEqual(objectOk);
    });

    it('should call checkEmailRegister method of UserService with correct data', async () => {
      const data: CheckEmailRegisterDto = {
        email: 'joao@email.com',
      };

      await controller.checkEmailRegister(data);

      expect(service.checkEmailRegister).toHaveBeenCalledWith(data);
    });
  });
});
