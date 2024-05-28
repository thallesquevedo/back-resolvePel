import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

const userList = [
  new User({
    name: 'João',
    email: 'joao@gmail.com',
    // password: '12345678',
    phone: '+5553123456789',
    cpf: '12345678901',
  }),
  new User({ name: 'Rafael', email: 'rafael@email.com', phone: '123456710' }),
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
            findByPhone: jest.fn(),
            findByEmail: jest.fn(),
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
  });
});
