import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorRepository } from '../repositories/author.repository';
import { CreateAuthorDto } from '../dto/create-author.dto';
import { UpdateAuthorDto } from '../dto/update-author.dto';
import { AuthorFilterQueryDto } from '../dto/filter-query.dto';
import { AuthorEntity } from '../entities/author.entity';
import { PaginatedData } from '@/core/types/data.type';
import { PaginationDto } from '@/core/types/pagination.dto';

@Injectable()
export class AuthorService {
  constructor(private readonly authorRepository: AuthorRepository) {}

  async create(createDto: CreateAuthorDto): Promise<AuthorEntity> {
    return this.authorRepository.create(createDto);
  }

  async findAll(
    filter: AuthorFilterQueryDto,
    paginationDto: PaginationDto,
  ): Promise<PaginatedData<AuthorEntity>> {
    const [items, total] = await this.authorRepository.search(
      filter,
      paginationDto,
    );
    const meta = {
      totalItems: total,
      itemsPerPage: paginationDto.limit ?? total,
      totalPages: paginationDto.limit
        ? Math.ceil(total / paginationDto.limit)
        : 1,
      currentPage: paginationDto.page ?? 1,
    };
    return { items, meta };
  }

  async findOne(id: string): Promise<AuthorEntity> {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: {
        books: true,
      },
    });
    if (!author) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    return author;
  }

  async update(id: string, dto: UpdateAuthorDto): Promise<AuthorEntity> {
    const updated = await this.authorRepository.update({ id }, dto);
    if (!updated) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.authorRepository.delete({ id });
    if (!deleted) {
      throw new NotFoundException(`Author with id ${id} not found`);
    }
  }
}
