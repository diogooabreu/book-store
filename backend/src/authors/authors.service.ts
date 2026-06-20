import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

interface FindAllParams {
  page: number;
  limit: number;
  search?: string;
}

@Injectable()
export class AuthorsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAuthorDto) {
    return this.prisma.author.create({
      data: dto,
    });
  }

  async findAll(params: FindAllParams) {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const where = {
      deletedAt: null,
      ...(search ? { name: { contains: search, mode: 'insensitive' as const } } : {}),
    };

    const [data, total] = await Promise.all([
      this.prisma.author.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.author.count({ where }),
    ]);

    return {
      data,
      meta: { page, limit, total },
    };
  }

  async findOne(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
      include: {
        books: {
          where: { deletedAt: null },
          select: { id: true, title: true, isbn: true, stock: true },
        },
      },
    });

    if (!author || author.deletedAt) {
      throw new NotFoundException('Autor não encontrado');
    }

    return author;
  }

  async update(id: string, dto: UpdateAuthorDto) {
    await this.findOne(id);

    return this.prisma.author.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const author = await this.prisma.author.findUnique({
      where: { id },
    });

    if (!author || author.deletedAt) {
      throw new NotFoundException('Autor não encontrado');
    }

    const hasActiveBooks = await this.prisma.book.findFirst({
      where: { authorId: id, deletedAt: null },
    });

    if (hasActiveBooks) {
      throw new ConflictException(
        'Não é possível excluir o autor pois ele possui livros ativos no acervo',
      );
    }

    await this.prisma.author.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
