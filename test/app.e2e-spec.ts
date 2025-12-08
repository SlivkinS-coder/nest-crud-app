import { Test } from "@nestjs/testing";
import {
  INestApplication,
  ValidationPipe
} from "@nestjs/common";
import * as pactum from 'pactum';
import { AppModule } from "../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";
import { AuthDto } from "src/auth/dto";
import { EditUserDto } from "src/user/dto";
import { CreateBookmarkDto, EditBookmarkDto } from "src/bookmark/dto";


describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true
    }));
    await app.init();
    await app.listen(3333);

    prisma = app.get(PrismaService);
    await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      email: 'test@test.ru',
      password: '123',
    }
    describe('signup', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody({
          })
          .expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post(
            '/auth/signup'
          ).withBody(dto)
          .expectStatus(201);
      });
    });
    describe('signin', () => {
      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody({
            email: dto.email,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody({
          })
          .expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post(
            '/auth/signin'
          ).withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
      })
    });

    describe('Edit user', () => {
      it('should edit user', () => {
        const dto: EditUserDto = {
          firstName: "NewName",
          email: "new@email.ru"
        }

        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(200)
      })
    });
  });
  describe('Bookmarks', () => {
    describe('Get empty bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBody([])
      })
    });
    describe('Create bookmarks', () => {
      const dto: CreateBookmarkDto = {
        title: 'First',
        link: 'www.google.com'
      };
      it('should create bookmark', () => {
        return pactum
          .spec()
          .post('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id')
      })
    });

    describe('Get bookmarks', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });

    describe('Get bookmarks by id', () => {
      it('should get bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      });
    });

    describe('Edit bookmarks by id', () => {
      const dto: EditBookmarkDto = {
        title: 'Second',
        link: 'www.yandex.com'
      };
      it('should edit bookmarks', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withBody(dto)
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(200)
          .expectBodyContains('$S{bookmarkId}')
      });
    });

    describe('Delete bookmarks by id', () => {
      it('should delete bookmarks', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}'
          })
          .expectStatus(204)
      });
    });

  })
  it.todo('should pass');
})