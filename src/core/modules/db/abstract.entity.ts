import {
  CreateDateColumn,
  DeepPartial,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity<T> {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(entity: DeepPartial<T>) {
    Object.assign(this, entity);
  }

  update(entity: DeepPartial<T>) {
    Object.assign(this, entity);
  }
}
