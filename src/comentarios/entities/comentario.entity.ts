import { ReqServico } from 'src/req_servico/entities/req_servico.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Comentario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  comentario: string;

  @Column({ default: 0 })
  rating: number;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(() => ReqServico, (reqServico) => reqServico.comentarios)
  reqServico: ReqServico;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
