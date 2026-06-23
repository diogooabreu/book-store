import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('../prisma/prisma.service', () => ({
  PrismaService: jest.fn().mockImplementation(() => ({
    author: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    book: {
      findFirst: jest.fn(),
    },
  })),
}));

interface MockPrisma {
  author: {
    create: jest.Mock;
    findMany: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    count: jest.Mock;
  };
  book: {
    findFirst: jest.Mock;
  };
}

describe('AuthorsService', () => {
  let service: AuthorsService;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [AuthorsService, PrismaService],
    }).compile();

    service = module.get<AuthorsService>(AuthorsService);
    jest.clearAllMocks();
  });

  const createDto = { name: 'J.R.R. Tolkien', nationality: 'Britânico' };
  const mockAuthor = {
    id: 'author-uuid',
    name: 'J.R.R. Tolkien',
    nationality: 'Britânico',
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('deve criar um autor com sucesso', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.create.mockResolvedValue(mockAuthor);

      const result = await service.create(createDto);

      expect(result).toEqual(mockAuthor);
      expect(prisma.author.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de autores', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findMany.mockResolvedValue([mockAuthor]);
      prisma.author.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(10);
    });

    it('deve buscar autores por nome quando search é informado', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findMany.mockResolvedValue([mockAuthor]);
      prisma.author.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10, search: 'Tolkien' });

      expect(result.data).toHaveLength(1);
      expect(prisma.author.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            deletedAt: null,
            name: { contains: 'Tolkien', mode: 'insensitive' },
          },
        }),
      );
    });
  });

  describe('findOne', () => {
    it('deve retornar um autor pelo ID', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue(mockAuthor);

      const result = await service.findOne('author-uuid');

      expect(result).toEqual(mockAuthor);
    });

    it('deve lançar NotFoundException se o autor não existir', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar NotFoundException se o autor estiver deletado (soft delete)', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue({ ...mockAuthor, deletedAt: new Date() });

      await expect(service.findOne('deleted-uuid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um autor com sucesso', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue(mockAuthor);
      prisma.author.update.mockResolvedValue({ ...mockAuthor, name: 'J.R.R. Tolkien Atualizado' });

      const result = await service.update('author-uuid', { name: 'J.R.R. Tolkien Atualizado' });

      expect(result.name).toBe('J.R.R. Tolkien Atualizado');
    });

    it('deve lançar NotFoundException se o autor não existir', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue(null);

      await expect(service.update('invalid-id', { name: 'Novo' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('deve realizar soft delete com sucesso', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue(mockAuthor);
      prisma.book.findFirst.mockResolvedValue(null);
      prisma.author.update.mockResolvedValue({ ...mockAuthor, deletedAt: new Date() });

      await service.remove('author-uuid');

      expect(prisma.author.update).toHaveBeenCalledWith({
        where: { id: 'author-uuid' },
        data: { deletedAt: expect.any(Date) },
      });
    });

    it('deve lançar NotFoundException se o autor não existir', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid-id')).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ConflictException se o autor possuir livros ativos', async () => {
      const prisma = module.get<MockPrisma>(PrismaService);
      prisma.author.findUnique.mockResolvedValue(mockAuthor);
      prisma.book.findFirst.mockResolvedValue({ id: 'book-uuid' });

      await expect(service.remove('author-uuid')).rejects.toThrow(ConflictException);
    });
  });
});
