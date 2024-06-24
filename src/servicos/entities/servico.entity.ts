import { ReqServico } from 'src/req_servico/entities/req_servico.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'servicos' })
export class Servico {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => ReqServico, (req_servico) => req_servico.servico)
  req_servico: ReqServico[];
}
