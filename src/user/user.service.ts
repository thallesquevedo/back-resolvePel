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
import { UpdateUserInfoDto } from './dto/update-user-info.dto';

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

  async updateUserInfos(user: User, updateUserInfos: UpdateUserInfoDto) {
    const { name, email, phone } = updateUserInfos;
    if (!name && !email && !phone) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: 400,
          texto: 'Nenhum dado para atualizar',
        },
        conteudo: null,
      });
    }

    try {
      const emailExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.email = :email', { email: updateUserInfos.email })
        .andWhere('user.id != :id', { id: user.id })
        .getCount();

      if (emailExists > 0) {
        throw new BadRequestException({
          status: false,
          mensagem: {
            codigo: 401,
            texto: 'Email já está em uso por outro usuário',
          },
        });
      }

      const phoneExists = await this.userRepository
        .createQueryBuilder('user')
        .where('user.phone = :phone', { phone: updateUserInfos.phone })
        .andWhere('user.id != :id', { id: user.id })
        .getCount();

      if (phoneExists > 0) {
        throw new BadRequestException({
          status: false,
          mensagem: {
            codigo: 401,
            texto: 'Telefone já está em uso por outro usuário',
          },
        });
      }

      const updatedUser = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set({
          ...updateUserInfos,
          updated_at: new Date(),
        })
        .where('id = :id', { id: user.id })
        .returning('*')
        .execute()
        .then((result) => {
          return result.raw[0];
        });

      return {
        status: true,
        mensagem: {
          codigo: 200,
          texto: 'Usuário atualizado com sucesso',
        },
        conteudo: {
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
        },
      };
    } catch (error) {
      throw new BadRequestException({
        status: false,
        mensagem: {
          codigo: error.response.mensagem.codigo,
          texto: error.response.mensagem.texto,
        },
        conteudo: null,
      });
    }
  }

  async userInfos(user: User) {
    const userFromDB = await this.userRepository.findOneBy({ id: user.id });

    return {
      status: true,
      mensagem: {
        codigo: 200,
        texto: 'Informações do usuário',
      },
      conteudo: {
        name: userFromDB.name,
        email: userFromDB.email,
        phone: userFromDB.phone,
      },
    };
  }
}
