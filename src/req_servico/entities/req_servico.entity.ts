import { Item } from 'src/items/entities/item.entity';
import { Servico } from 'src/servicos/entities/servico.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'req_servico' })
export class ReqServico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  descricao: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => Servico, (servico) => servico.id)
  servico: Servico;

  @ManyToMany(() => Item, { onDelete: 'CASCADE' })
  @JoinTable()
  items: Item[];

  constructor(req_servico?: Partial<ReqServico>) {
    this.id = req_servico?.id;
    this.descricao = req_servico?.descricao;
    this.created_at = req_servico?.created_at;
    this.updated_at = req_servico?.updated_at;
    this.user = req_servico?.user;
    this.servico = req_servico?.servico;
    this.items = req_servico?.items;
  }
}
