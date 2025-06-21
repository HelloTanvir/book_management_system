import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { BaseRepository } from '@/core/modules/db/base.repository';
import { BookEntity } from '@/modules/book/entities/book.entity';
import { EntityManager, ILike } from 'typeorm';
import { BookFilterQueryDto } from '../dto/filter-query.dto';
import { PaginationDto } from '@/core/types/pagination.dto';

@Injectable()
export class BookRepository extends BaseRepository<BookEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(entityManager, BookEntity);
  }

  async search(
    filter: BookFilterQueryDto,
    paginationDto: PaginationDto,
  ): Promise<[BookEntity[], number]> {
    const { search, authorId } = filter;

    const options: Parameters<typeof this.find>[0] = {};

    if (search) {
      const like = `%${search}%`;
      options.where = [{ title: ILike(like) }, { isbn: ILike(like) }];
    }

    if (authorId) {
      options.where = Array.isArray(options.where)
        ? options.where.map((cond) => ({ ...cond, author: { id: authorId } }))
        : { author: { id: authorId } };
    }

    return this.find(options, paginationDto);
  }
}
