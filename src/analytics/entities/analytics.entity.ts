import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'analytics' })
export class Analytics {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 0 })
  count: number;

  constructor(analytics?: Partial<Analytics>) {
    this.id = analytics?.id;
    this.count = analytics?.count;
  }
}
