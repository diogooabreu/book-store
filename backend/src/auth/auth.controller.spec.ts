import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('./auth.service', () => ({
  AuthService: jest.fn().mockImplementation(() => ({
    register: jest.fn(),
    login: jest.fn(),
  })),
}));

interface MockAuthService {
  register: jest.Mock;
  login: jest.Mock;
}

describe('AuthController', () => {
  let controller: AuthController;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('deve chamar authService.register e retornar o usuário', async () => {
      const dto: RegisterUserDto = { email: 'novo@teste.com', password: '123456' };
      const expected = { id: 'uuid-1', email: dto.email, role: 'READER', createdAt: new Date() };

      const authService = module.get<MockAuthService>(AuthService);
      authService.register.mockResolvedValue(expected);

      const result = await controller.register(dto);

      expect(authService.register).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });

  describe('login', () => {
    it('deve chamar authService.login e retornar o token', async () => {
      const dto: LoginDto = { email: 'user@teste.com', password: '123456' };
      const expected = { accessToken: 'jwt-token' };

      const authService = module.get<MockAuthService>(AuthService);
      authService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(authService.login).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expected);
    });
  });
});
