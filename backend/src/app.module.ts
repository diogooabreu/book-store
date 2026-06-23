import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { BooksModule } from './books/books.module';
import { AuthorsModule } from './authors/authors.module';
import { LoansModule } from './loans/loans.module';

@Module({
  imports: [PrismaModule, AuthModule, BooksModule, AuthorsModule, LoansModule],
})
export class AppModule {}
