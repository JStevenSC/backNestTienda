import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product: string;

  @Column({ default: '0' })
  amount: number;

  @Column({ default: '0' })
  price: number;

  @Column()
  descripcion: string;

  @Column()
  available: boolean;

  @Column()
  url: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  create: Date;
}
