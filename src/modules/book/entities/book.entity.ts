import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractEntity } from '@/core/modules/db/abstract.entity';
import { AuthorEntity } from '@/modules/author/entities/author.entity';

@Entity({ name: 'books' })
export class BookEntity extends AbstractEntity<BookEntity> {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text', unique: true })
  isbn: string;

  @Column({ type: 'date', nullable: true })
  publishedDate?: Date;

  @Column({ type: 'text', nullable: true })
  genre?: string;

  @ManyToOne(() => AuthorEntity, (author: AuthorEntity) => author.books, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: AuthorEntity;
}
