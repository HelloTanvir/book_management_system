import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Server } from 'http';

import { AppModule } from '../src/app.module';
import { AuthorRepository } from '../src/modules/author/repositories/author.repository';
import { v4 as uuid } from 'uuid';

interface MockAuthor {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
}

type AuthorResponse = MockAuthor;

interface FindOneOptions {
  where: {
    id: string;
  };
}

describe('Author Endpoints (e2e)', () => {
  let app: INestApplication;
  let server: Server;

  beforeAll(async () => {
    process.env.DATABASE_PATH = 'author_test.sqlite';

    const authors: MockAuthor[] = [];

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthorRepository)
      .useValue({
        create: (dto: Omit<MockAuthor, 'id'>): Promise<MockAuthor> => {
          const entity: MockAuthor = { id: uuid(), ...dto } as MockAuthor;
          authors.push(entity);
          return Promise.resolve(entity);
        },
        findOne: (options: FindOneOptions): Promise<MockAuthor | null> => {
          const {
            where: { id },
          } = options;
          const entity = authors.find((a) => a.id === id) ?? null;
          return Promise.resolve(entity);
        },
        search: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );
    await app.init();

    server = app.getHttpServer() as Server;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an author then retrieve it', async () => {
    const createDto = {
      firstName: 'Jane',
      lastName: 'Austen',
      bio: 'English novelist known primarily for her six major novels',
    };

    const createResponse = await request(server)
      .post('/authors')
      .send(createDto)
      .expect((res) => {
        console.log('Create Author Response:', res.status, res.body);
      });

    expect(createResponse.status).toBe(201);

    const { id } = createResponse.body as AuthorResponse;
    expect(id).toBeDefined();

    const getResponse = await request(server).get(`/authors/${id}`).expect(200);

    expect(getResponse.body as AuthorResponse).toMatchObject({
      id,
      ...createDto,
    });
  });
});
