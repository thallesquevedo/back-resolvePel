import { Injectable } from '@nestjs/common';
import { Servico } from './entities/servico.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ServicosService {
  constructor(
    @InjectRepository(Servico)
    private readonly servicoRepository: Repository<Servico>,
  ) {}

  async findOne(id: number) {
    return await this.servicoRepository.findOneBy({ id });
  }

  async findAllServicos() {
    return await this.servicoRepository.find();
  }
}
