import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { BooksService } from './books.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => mockPrisma()),
}));

const mockPrisma = () => ({
  book: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
  author: {
    findUnique: jest.fn(),
  },
});

describe('BooksService', () => {
  let service: BooksService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [BooksService, PrismaService],
    }).compile();

    service = module.get<BooksService>(BooksService);
    jest.clearAllMocks();
  });

  const createDto = {
    title: 'O Senhor dos Anéis',
    isbn: '978-8578270698',
    stock: 5,
    authorId: 'author-uuid',
  };

  const mockBook = {
    id: 'book-uuid',
    title: 'O Senhor dos Anéis',
    isbn: '978-8578270698',
    stock: 5,
    authorId: 'author-uuid',
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthor = {
    id: 'author-uuid',
    name: 'J.R.R. Tolkien',
    deletedAt: null,
  };

  describe('create', () => {
    it('deve criar um livro com sucesso quando o autor existe', async () => {
      const prisma = module.get(PrismaService);
      prisma.author.findUnique.mockResolvedValue(mockAuthor);
      prisma.book.create.mockResolvedValue(mockBook);

      const result = await service.create(createDto);

      expect(result).toEqual(mockBook);
      expect(prisma.book.create).toHaveBeenCalledWith({ data: createDto });
    });

    it('deve lançar NotFoundException se o authorId não existir', async () => {
      const prisma = module.get(PrismaService);
      prisma.author.findUnique.mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de livros', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findMany.mockResolvedValue([mockBook]);
      prisma.book.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('deve filtrar apenas livros não deletados', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findMany.mockResolvedValue([mockBook]);
      prisma.book.count.mockResolvedValue(1);

      await service.findAll({ page: 1, limit: 10 });

      expect(prisma.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ deletedAt: null }),
        }),
      );
    });

    it('deve buscar livros por título quando search é informado', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findMany.mockResolvedValue([mockBook]);
      prisma.book.count.mockResolvedValue(1);

      await service.findAll({ page: 1, limit: 10, search: 'Senhor' });

      expect(prisma.book.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            title: { contains: 'Senhor', mode: 'insensitive' },
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um livro pelo ID com autor populado', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue({
        ...mockBook,
        author: mockAuthor,
      });

      const result = await service.findOne('book-uuid');

      expect(result).toHaveProperty('author');
      expect(result.author.name).toBe('J.R.R. Tolkien');
    });

    it('deve lançar NotFoundException se o livro não existir', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException se o livro estiver deletado', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue({ ...mockBook, deletedAt: new Date() });

      await expect(service.findOne('deleted-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um livro com sucesso', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue(mockBook);
      prisma.author.findUnique.mockResolvedValue(mockAuthor);
      prisma.book.update.mockResolvedValue({ ...mockBook, title: 'Título Atualizado' });

      const result = await service.update('book-uuid', { title: 'Título Atualizado' });

      expect(result.title).toBe('Título Atualizado');
    });

    it('deve lançar NotFoundException se o livro não existir', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.update('invalid-id', { title: 'Novo' })).rejects.toThrow(
        NotFoundException,
      );
    });

    it('deve lançar NotFoundException se o novo authorId não existir', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue(mockBook);
      prisma.author.findUnique.mockResolvedValue(null);

      await expect(service.update('book-uuid', { authorId: 'invalid-author' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve realizar soft delete com sucesso', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue(mockBook);
      prisma.book.update.mockResolvedValue({ ...mockBook, deletedAt: new Date() });

      await service.remove('book-uuid');

      expect(prisma.book.update).toHaveBeenCalledWith({
        where: { id: 'book-uuid' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('deve lançar NotFoundException se o livro não existir', async () => {
      const prisma = module.get(PrismaService);
      prisma.book.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });
});
