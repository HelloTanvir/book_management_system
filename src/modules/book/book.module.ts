import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';
import { BookRepository } from './repositories/book.repository';
import { BookService } from './services/book.service';
import { BookController } from './controllers/book.controller';
import { AuthorModule } from '@/modules/author/author.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity]),
    forwardRef(() => AuthorModule),
  ],
  providers: [BookRepository, BookService],
  controllers: [BookController],
  exports: [BookService, BookRepository],
})
export class BookModule {}
