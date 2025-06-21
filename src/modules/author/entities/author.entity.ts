import { Column, Entity, OneToMany } from 'typeorm';
import { AbstractEntity } from '@/core/modules/db/abstract.entity';
import { BookEntity } from '@/modules/book/entities/book.entity';

@Entity({ name: 'authors' })
export class AuthorEntity extends AbstractEntity<AuthorEntity> {
  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @OneToMany(() => BookEntity, (book: BookEntity) => book.author, {
    cascade: false,
  })
  books: BookEntity[];
}
