import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
}

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBookDto) {
    const author = await this.prisma.author.findUnique({
      where: { id: dto.authorId },
    });

    if (!author || author.deletedAt) {
      throw new NotFoundException('Autor não encontrado');
    }

    return this.prisma.book.create({
      data: dto,
    });
  }

  async findAll(params: FindAllParams) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search ? { title: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          author: {
            select: { id: true, name: true },
          },
        },
      }),
      this.prisma.book.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total },
    };
  }

  async findOne(id: string) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true },
        },
      },
    });

    if (!book || book.deletedAt) {
      throw new NotFoundException('Livro não encontrado');
    }

    return book;
  }

  async update(id: string, dto: UpdateBookDto) {
    await this.findOne(id);

    if (dto.authorId) {
      const author = await this.prisma.author.findUnique({
        where: { id: dto.authorId },
      });

      if (!author || author.deletedAt) {
        throw new NotFoundException('Autor não encontrado');
      }
    }

    return this.prisma.book.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const book = await this.prisma.book.findUnique({ where: { id } });

    if (!book || book.deletedAt) {
      throw new NotFoundException('Livro não encontrado');
    }

    await this.prisma.book.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
