import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { AuthorsService } from './authors.service';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';

@ApiTags('Autores')
@Controller('authors')
export class AuthorsController {
  constructor(private readonly authorsService: AuthorsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LIBRARIAN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar autor',
    description: 'Cria um novo autor. Requer permissão de Bibliotecário ou Admin.',
  })
  @ApiCreatedResponse({ description: 'Autor cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Acesso negado — apenas Bibliotecários e Admin' })
  async create(@Body() dto: CreateAuthorDto) {
    return this.authorsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar autores',
    description: 'Retorna lista paginada de autores. Busca por nome disponível.',
  })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'search', required: false, example: 'Tolkien' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.authorsService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar autor por ID',
    description: 'Retorna os detalhes de um autor e seus livros relacionados.',
  })
  @ApiResponse({ status: 404, description: 'Autor não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.authorsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LIBRARIAN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar autor',
    description: 'Atualiza os dados de um autor. Requer permissão de Bibliotecário ou Admin.',
  })
  @ApiResponse({ status: 404, description: 'Autor não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado — apenas Bibliotecários e Admin' })
  async update(@Param('id') id: string, @Body() dto: UpdateAuthorDto) {
    return this.authorsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LIBRARIAN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remover autor (soft delete)',
    description: 'Marca o autor como excluído logicamente. Bloqueado se houver livros ativos.',
  })
  @ApiResponse({ status: 404, description: 'Autor não encontrado' })
  @ApiResponse({ status: 409, description: 'Autor possui livros ativos no acervo' })
  @ApiResponse({ status: 403, description: 'Acesso negado — apenas Bibliotecários e Admin' })
  async remove(@Param('id') id: string) {
    return this.authorsService.remove(id);
  }
}
