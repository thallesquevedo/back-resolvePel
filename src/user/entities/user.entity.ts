import { ReqServico } from 'src/req_servico/entities/req_servico.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  cpf: string;

  @Column({ unique: true })
  phone: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  @OneToMany(() => ReqServico, (req_servico) => req_servico.user)
  req_servico: ReqServico[];

  constructor(user?: Partial<User>) {
    this.id = user?.id;
    this.name = user?.name;
    this.email = user?.email;
    this.password = user?.password;
    this.cpf = user?.cpf;
    this.phone = user?.phone;
    this.created_at = user?.created_at;
    this.updated_at = user?.updated_at;
  }
}
