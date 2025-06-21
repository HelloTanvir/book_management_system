import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorEntity } from './entities/author.entity';
import { AuthorRepository } from './repositories/author.repository';
import { AuthorService } from './services/author.service';
import { AuthorController } from './controllers/author.controller';
import { BookModule } from '@/modules/book/book.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthorEntity]),
    forwardRef(() => BookModule),
  ],
  providers: [AuthorRepository, AuthorService],
  controllers: [AuthorController],
  exports: [AuthorService, AuthorRepository],
})
export class AuthorModule {}
