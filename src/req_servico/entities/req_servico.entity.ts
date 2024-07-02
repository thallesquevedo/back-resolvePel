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
}
