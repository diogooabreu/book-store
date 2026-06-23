import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';

jest.mock('./books.service', () => ({
  BooksService: jest.fn().mockImplementation(() => ({
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  })),
}));

interface MockBooksService {
  create: jest.Mock;
  findAll: jest.Mock;
  findOne: jest.Mock;
  update: jest.Mock;
  remove: jest.Mock;
}

describe('BooksController', () => {
  let controller: BooksController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [BooksService],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    jest.clearAllMocks();
  });

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

  describe('create', () => {
    it('deve criar um livro e retornar 201', async () => {
      const dto = {
        title: 'O Senhor dos Anéis',
        isbn: '978-8578270698',
        stock: 5,
        authorId: 'author-uuid',
      };
      const service = module.get<MockBooksService>(BooksService);
      service.create.mockResolvedValue(mockBook);

      const result = await controller.create(dto);

      expect(result).toEqual(mockBook);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve listar livros com paginação', async () => {
      const service = module.get<MockBooksService>(BooksService);
      const paginatedResult = {
        data: [mockBook],
        meta: { page: 1, limit: 10, total: 1 },
      };
      service.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(1, 10, undefined);

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10, search: undefined });
    });
  });

  describe('findOne', () => {
    it('deve retornar um livro pelo ID', async () => {
      const service = module.get<MockBooksService>(BooksService);
      service.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne('book-uuid');

      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('deve atualizar um livro', async () => {
      const service = module.get<MockBooksService>(BooksService);
      const dto = { title: 'Título Atualizado' };
      const updated = { ...mockBook, title: 'Título Atualizado' };
      service.update.mockResolvedValue(updated);

      const result = await controller.update('book-uuid', dto);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith('book-uuid', dto);
    });
  });

  describe('remove', () => {
    it('deve remover um livro (soft delete)', async () => {
      const service = module.get<MockBooksService>(BooksService);
      service.remove.mockResolvedValue(undefined);

      await controller.remove('book-uuid');

      expect(service.remove).toHaveBeenCalledWith('book-uuid');
    });
  });
});
