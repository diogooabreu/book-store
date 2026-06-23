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
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('Livros')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LIBRARIAN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Cadastrar livro',
    description:
      'Cria um novo livro vinculado a um autor existente. Requer permissão de Bibliotecário ou Admin.',
  })
  @ApiCreatedResponse({ description: 'Livro cadastrado com sucesso' })
  @ApiResponse({ status: 404, description: 'Autor não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado — apenas Bibliotecários e Admin' })
  async create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar livros',
    description: 'Retorna lista paginada de livros disponíveis. Busca por título disponível.',
  })
  @ApiQuery({ name: 'page', required: false, example: '1' })
  @ApiQuery({ name: 'limit', required: false, example: '10' })
  @ApiQuery({ name: 'search', required: false, example: 'Senhor' })
  async findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
  ) {
    return this.booksService.findAll({
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar livro por ID',
    description: 'Retorna os detalhes de um livro com informações do autor.',
  })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  async findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LIBRARIAN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar livro',
    description: 'Atualiza os dados de um livro. Requer permissão de Bibliotecário ou Admin.',
  })
  @ApiResponse({ status: 404, description: 'Livro ou autor não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado — apenas Bibliotecários e Admin' })
  async update(@Param('id') id: string, @Body() dto: UpdateBookDto) {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('LIBRARIAN', 'ADMIN')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remover livro (soft delete)',
    description:
      'Marca o livro como excluído logicamente. Requer permissão de Bibliotecário ou Admin.',
  })
  @ApiResponse({ status: 404, description: 'Livro não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado — apenas Bibliotecários e Admin' })
  async remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
