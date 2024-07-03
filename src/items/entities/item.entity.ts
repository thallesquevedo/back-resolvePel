import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'items' })
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  created_at: Date;

  constructor(item?: Partial<Item>) {
    this.id = item?.id;
    this.name = item?.name;
    this.created_at = item?.created_at;
  }
}
