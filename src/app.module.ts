import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DBModule } from '@/core/modules/db/db.module';
import { AuthorModule } from '@/modules/author/author.module';
import { BookModule } from '@/modules/book/book.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DBModule,
    AuthorModule,
    BookModule,
  ],
})
export class AppModule {}
