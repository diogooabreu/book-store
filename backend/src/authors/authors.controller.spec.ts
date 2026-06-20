import { Test, TestingModule } from '@nestjs/testing';
import { AuthorsController } from './authors.controller';
import { AuthorsService } from './authors.service';

jest.mock('./authors.service', () => ({
  AuthorsService: jest.fn().mockImplementation(() => mockAuthorsService()),
}));

const mockAuthorsService = () => ({
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
});

describe('AuthorsController', () => {
  let controller: AuthorsController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthorsController],
      providers: [AuthorsService],
    }).compile();

    controller = module.get<AuthorsController>(AuthorsController);
    jest.clearAllMocks();
  });

  const mockAuthor = {
    id: 'author-uuid',
    name: 'J.R.R. Tolkien',
    nationality: 'Britânico',
    deletedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  describe('create', () => {
    it('deve criar um autor e retornar 201', async () => {
      const dto = { name: 'J.R.R. Tolkien', nationality: 'Britânico' };
      const service = module.get(AuthorsService);
      service.create.mockResolvedValue(mockAuthor);

      const result = await controller.create(dto);

      expect(result).toEqual(mockAuthor);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve listar autores com paginação', async () => {
      const service = module.get(AuthorsService);
      const paginatedResult = {
        data: [mockAuthor],
        meta: { page: 1, limit: 10, total: 1 },
      };
      service.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(1, 10, undefined);

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10, search: undefined });
    });

    it('deve listar autores com busca por nome', async () => {
      const service = module.get(AuthorsService);
      const paginatedResult = {
        data: [mockAuthor],
        meta: { page: 1, limit: 10, total: 1 },
      };
      service.findAll.mockResolvedValue(paginatedResult);

      const result = await controller.findAll(1, 10, 'Tolkien');

      expect(result).toEqual(paginatedResult);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10, search: 'Tolkien' });
    });
  });

  describe('findOne', () => {
    it('deve retornar um autor pelo ID', async () => {
      const service = module.get(AuthorsService);
      service.findOne.mockResolvedValue(mockAuthor);

      const result = await controller.findOne('author-uuid');

      expect(result).toEqual(mockAuthor);
    });
  });

  describe('update', () => {
    it('deve atualizar um autor', async () => {
      const service = module.get(AuthorsService);
      const dto = { name: 'Nome Atualizado' };
      const updated = { ...mockAuthor, name: 'Nome Atualizado' };
      service.update.mockResolvedValue(updated);

      const result = await controller.update('author-uuid', dto);

      expect(result).toEqual(updated);
      expect(service.update).toHaveBeenCalledWith('author-uuid', dto);
    });
  });

  describe('remove', () => {
    it('deve remover um autor (soft delete)', async () => {
      const service = module.get(AuthorsService);
      service.remove.mockResolvedValue(undefined);

      await controller.remove('author-uuid');

      expect(service.remove).toHaveBeenCalledWith('author-uuid');
    });
  });
});
