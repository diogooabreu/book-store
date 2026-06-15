import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwt = {
  sign: jest.fn().mockReturnValue('fake-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto = { email: 'novo@teste.com', password: '123456' };

    it('deve criar um usuário com role READER e retornar sem a senha', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
        id: 'uuid-1',
        email: registerDto.email,
        password: 'hashed-password',
        role: 'READER',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.register(registerDto);

      expect(result).not.toHaveProperty('password');
      expect(result.email).toBe(registerDto.email);
      expect(result.role).toBe('READER');
      expect(bcrypt.hashSync(registerDto.password, 10)).not.toBe(registerDto.password);
    });

    it('deve lançar ConflictException se o email já existir', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 'existing', email: registerDto.email });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = { email: 'user@teste.com', password: '123456' };
    const hashedPassword = bcrypt.hashSync('123456', 10);

    it('deve retornar um accessToken para credenciais válidas', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        email: loginDto.email,
        password: hashedPassword,
        role: 'READER',
      });

      const result = await service.login(loginDto);

      expect(result).toHaveProperty('accessToken');
      expect(result.accessToken).toBe('fake-jwt-token');
    });

    it('deve lançar UnauthorizedException para senha incorreta', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: 'uuid-1',
        email: loginDto.email,
        password: hashedPassword,
        role: 'READER',
      });

      const wrongDto = { ...loginDto, password: 'senha_errada' };
      await expect(service.login(wrongDto)).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException para email inexistente', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
