import { PrismaClient, Role } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@biblioteca.edu.br' },
    update: {},
    create: {
      email: 'admin@biblioteca.edu.br',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const librarian = await prisma.user.upsert({
    where: { email: 'bibliotecario@biblioteca.edu.br' },
    update: {},
    create: {
      email: 'bibliotecario@biblioteca.edu.br',
      password: hashedPassword,
      role: Role.LIBRARIAN,
    },
  });

  console.log('Usuários criados:', { admin: admin.email, librarian: librarian.email });

  const tolkien = await prisma.author.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'J.R.R. Tolkien',
      nationality: 'Britânico',
    },
  });

  const martin = await prisma.author.upsert({
    where: { id: '00000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      name: 'George R.R. Martin',
      nationality: 'Americano',
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-8578270698' },
    update: {},
    create: {
      title: 'O Senhor dos Anéis: A Sociedade do Anel',
      isbn: '978-8578270698',
      stock: 5,
      authorId: tolkien.id,
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-8533603148' },
    update: {},
    create: {
      title: 'O Hobbit',
      isbn: '978-8533603148',
      stock: 3,
      authorId: tolkien.id,
    },
  });

  await prisma.book.upsert({
    where: { isbn: '978-8532511595' },
    update: {},
    create: {
      title: 'A Guerra dos Tronos',
      isbn: '978-8532511595',
      stock: 4,
      authorId: martin.id,
    },
  });

  console.log('Autores e livros criados com sucesso.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
