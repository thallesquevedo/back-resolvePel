import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ResponseModel } from 'src/utils/models';
import { ResponseCreateUserDTO } from './dto/response-create-user.dto';
import { CheckPhoneRegisterDto } from './dto/check-phone-register.dto';
import { CheckEmailRegisterDto } from './dto/check-email-register.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<ResponseModel<ResponseCreateUserDTO>> {
    const phoneExists = await this.userRepository.findOneBy({
      phone: createUserDto.phone,
    });

    if (phoneExists) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Telefone já existe',
        },
        conteudo: null,
      });
    }

    const emailExists = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });

    if (emailExists) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Email já existe',
        },
        conteudo: null,
      });
    }

    await this.userRepository.save({
      ...createUserDto,
      password: await bcrypt.hash(createUserDto.password, 10),
    });

    return {
      status: true,
      mensagem: {
        codigo: 201,
        texto: 'Usuário criado com sucesso',
      },
      conteudo: null,
    };
  }

  async findByPhone(phone: string) {
    return this.userRepository.findOneBy({ phone });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  // FAÇA OS TESTES PARA OS METODOS ACIMA PRIMEIRO

  async findOne(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async checkPhoneRegister(checkPhoneRegister: CheckPhoneRegisterDto) {
    const userByPhone = await this.userRepository.findOneBy({
      phone: checkPhoneRegister.phone,
    });

    if (userByPhone) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Telefone já cadastrado',
        },
        conteudo: null,
      });
    }

    return {
      status: true,
      mensagem: {
        codigo: 200,
        texto: 'Telefone disponível',
      },
      conteudo: null,
    };
  }

  async checkEmailRegister(checkPhoneRegister: CheckEmailRegisterDto) {
    const userByEmail = await this.userRepository.findOneBy({
      email: checkPhoneRegister.email,
    });

    if (userByEmail) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Email já cadastrado',
        },
        conteudo: null,
      });
    }

    return {
      status: true,
      mensagem: {
        codigo: 200,
        texto: 'Email disponível',
      },
      conteudo: null,
    };
  }
}
