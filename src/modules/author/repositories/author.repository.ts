import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { AuthorEntity } from '@/modules/author/entities/author.entity';
import { BaseRepository } from '@/core/modules/db/base.repository';
import { EntityManager, ILike } from 'typeorm';
import { AuthorFilterQueryDto } from '../dto/filter-query.dto';
import { PaginationDto } from '@/core/types/pagination.dto';

@Injectable()
export class AuthorRepository extends BaseRepository<AuthorEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(entityManager, AuthorEntity);
  }

  async search(
    filter: AuthorFilterQueryDto,
    paginationDto: PaginationDto,
  ): Promise<[AuthorEntity[], number]> {
    const { search } = filter;

    if (!search) {
      return this.find({}, paginationDto);
    }

    const like = `%${search}%`;

    return this.find(
      {
        where: [{ firstName: ILike(like) }, { lastName: ILike(like) }],
      },
      paginationDto,
    );
  }
}
