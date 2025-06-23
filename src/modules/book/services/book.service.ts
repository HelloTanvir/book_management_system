import {
  Injectable,
  NotFoundException,
  BadRequestException,
  forwardRef,
  Inject,
  Logger,
} from '@nestjs/common';
import { BookRepository } from '../repositories/book.repository';
import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { BookFilterQueryDto } from '../dto/filter-query.dto';
import { BookEntity } from '../entities/book.entity';
import { PaginatedData } from '@/core/types/data.type';
import { AuthorService } from '@/modules/author/services/author.service';
import { AuthorEntity } from '@/modules/author/entities/author.entity';
import { PaginationDto } from '@/core/types/pagination.dto';

@Injectable()
export class BookService {
  private readonly logger = new Logger(BookService.name);

  constructor(
    private readonly bookRepository: BookRepository,
    @Inject(forwardRef(() => AuthorService))
    private readonly authorService: AuthorService,
  ) {}

  async create(dto: CreateBookDto): Promise<BookEntity> {
    const author = await this.authorService.findOne(dto.authorId);
    if (!author) {
      throw new BadRequestException(`Author with id ${dto.authorId} not found`);
    }
    const { authorId, ...data } = dto;
    this.logger.log(`Creating book with authorId: ${authorId}`);

    return this.bookRepository.create({ ...data, author });
  }

  async findAll(
    filter: BookFilterQueryDto,
    paginationDto: PaginationDto,
  ): Promise<PaginatedData<BookEntity>> {
    const [items, total] = await this.bookRepository.search(
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
    this.logger.log(`Found ${total} books`);
    return { items, meta };
  }

  async findOne(id: string): Promise<BookEntity> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: {
        author: true,
      },
    });
    if (!book) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    this.logger.log(`Found book with id: ${id}`);
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookEntity> {
    if (dto.authorId) {
      const author = await this.authorService.findOne(dto.authorId);
      if (!author) {
        throw new BadRequestException(
          `Author with id ${dto.authorId} not found`,
        );
      }
      (dto as { author: AuthorEntity }).author = author;
      delete dto.authorId;
    }

    const updated = await this.bookRepository.update({ id }, dto);
    if (!updated) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    this.logger.log(`Updated book with id: ${id}`);
    return updated;
  }

  async remove(id: string): Promise<void> {
    const deleted = await this.bookRepository.delete({ id });
    if (!deleted) {
      throw new NotFoundException(`Book with id ${id} not found`);
    }
    this.logger.log(`Deleted book with id: ${id}`);
  }
}
