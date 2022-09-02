import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../../src/auth/auth.module';
import { UsersModule } from '../../src/users/users.module';
import { User } from '../../src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

const mockUserDTO: User = {
  id: 1,
  name: 'nestjs',
  email: 'nestjs@gmail.com',
  password: '123123123',
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockUser = {
  id: mockUserDTO.id,
  name: mockUserDTO.name,
  email: mockUserDTO.email,
};

const mockUserTwo = {
  id: mockUserDTO.id + 1,
  name: 'test',
  email: 'test@gmail.com',
};

const mockCreateUser = {
  name: mockUserDTO.name,
  email: mockUserDTO.email,
  password: mockUserDTO.password,
};

const mockCreateUserTwo = {
  name: mockUserTwo.name,
  email: mockUserTwo.email,
  password: mockUserDTO.password,
};

const mockUpdateUser = {
  name: 'Heric Macedo',
};

const mockDeleteUser = {
  name: mockUpdateUser.name,
  email: mockUserDTO.email,
};

const mockDeleteUserTwo = {
  name: mockUserTwo.name,
  email: mockUserTwo.email,
};

const mockAuth = {
  email: mockUserDTO.email,
  password: mockUserDTO.password,
};

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        UsersModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'SQLite_DB_e2e',
          dropSchema: true,
          autoLoadEntities: true,
          synchronize: true,
        }),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const { body } = await request(app.getHttpServer())
      .post('/auth')
      .send(mockAuth);

    token = body.token;
  });

  describe('Create POST /users', () => {
    it('MyUser OK', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/users')
        .send(mockCreateUser)
        .expect(HttpStatus.CREATED);

      const expected = expect.objectContaining(mockUser);

      const hashEqual = await bcrypt.compare(
        mockCreateUser.password,
        body.password,
      );

      expect(hashEqual).toEqual(true);
      expect(body).toEqual(expected);
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
    });

    it('AnotherUser OK', async () => {
      const { body } = await request(app.getHttpServer())
        .post('/users')
        .send(mockCreateUserTwo)
        .expect(HttpStatus.CREATED);

      const expected = expect.objectContaining(mockUserTwo);

      const hashEqual = await bcrypt.compare(
        mockCreateUserTwo.password,
        body.password,
      );

      expect(hashEqual).toEqual(true);
      expect(body).toEqual(expected);
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
    });

    it('IsUnique', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send(mockCreateUser)
        .expect(HttpStatus.INTERNAL_SERVER_ERROR);
    });

    it('InvalidEmail', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ ...mockCreateUser, email: 'invalid' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('MinPassword', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({ ...mockCreateUser, password: '12345' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('Empty', async () => {
      await request(app.getHttpServer())
        .post('/users')
        .send({})
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('FindAll GET /users', () => {
    it('OK', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const expected = expect.arrayContaining([
        expect.objectContaining(mockUser),
      ]);

      expect(body).toEqual(expected);
      expect(body[0].createdAt).toBeDefined();
      expect(body[0].updatedAt).toBeDefined();
    });

    it('NotPermission', async () => {
      await request(app.getHttpServer())
        .get('/users')
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('FindOne GET /users:{id}', () => {
    it('OK', async () => {
      const { body } = await request(app.getHttpServer())
        .get(`/users/${mockUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const expected = expect.objectContaining(mockUser);

      expect(body).toEqual(expected);
      expect(body.createdAt).toBeDefined();
      expect(body.updatedAt).toBeDefined();
    });

    it('NotPermission', async () => {
      await request(app.getHttpServer())
        .get(`/users/${mockUser.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Update PATCH /users:{id}', () => {
    it('OK', async () => {
      const { body } = await request(app.getHttpServer())
        .patch(`/users/${mockUser.id}`)
        .send(mockUpdateUser)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const expected = expect.objectContaining({
        ...mockUser,
        ...mockUpdateUser,
      });

      expect(body).toEqual(expected);
    });

    it('NotPermission', async () => {
      await request(app.getHttpServer())
        .patch(`/users/${mockUser.id}`)
        .send(mockUpdateUser)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('Remove DELETE /users:{id}', () => {
    it('AnotherUser OK', async () => {
      const { body: bodyDelete } = await request(app.getHttpServer())
        .delete(`/users/${mockUserTwo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const { body: bodyUserTwo } = await request(app.getHttpServer())
        .get(`/users/${mockUserTwo.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      const expected = expect.objectContaining(mockDeleteUserTwo);

      expect(bodyDelete).toEqual(expected);
      expect(bodyUserTwo).toBeDefined();
    });

    it('MyUser OK', async () => {
      const { body: bodyDelete } = await request(app.getHttpServer())
        .delete(`/users/${mockUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.OK);

      await request(app.getHttpServer())
        .get(`/users/${mockUser.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.UNAUTHORIZED);

      const expected = expect.objectContaining(mockDeleteUser);

      expect(bodyDelete).toEqual(expected);
    });

    it('NotPermission', async () => {
      await request(app.getHttpServer())
        .delete(`/users/${mockUser.id}`)
        .expect(HttpStatus.UNAUTHORIZED);
    });
  });
});
