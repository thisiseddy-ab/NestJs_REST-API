import { INestApplication,ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import * as pactum from 'pactum';

import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

/// DTO'S ///
import { AuthDTO } from '../src/auth/dto';
import { CreateBookmarkDTO, EditBookmarkDTO } from '../src/bookmark/dto/'

describe('App e2e', () => {
  let app : INestApplication
  let prisma : PrismaService

  
  beforeAll(async () => {

    const moduleRef : TestingModule = await Test.createTestingModule({
      imports : [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    app.useGlobalPipes(new ValidationPipe({
        whitelist : true
      }))

    await app.init()
    await app.listen(3333)

    prisma = app.get<PrismaService>(PrismaService);
    
    await prisma.cleanDB()
    pactum.request.setBaseUrl("http:localhost:3333")

  });

  afterAll((async () => {
    await app.close()
  })) 
  
  describe("Auth", () => {
    const dto: AuthDTO = {
      email: 'vlad@gmail.com',
      password: '123',
    };

    describe("SignUp", () => {

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password : dto.password
          })
          .expectStatus(400);
      });

      it('should throw if poassword empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            email : dto.email
          })
          .expectStatus(400);
      });

      it('should throw if no body was provided', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({})
          .expectStatus(400);
      });

      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });

    });

    describe("SignIn", () => {

      it('should throw if email empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password : dto.password
          })
          .expectStatus(400);
      });

      it('should throw if poassword empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            email : dto.email
          })
          .expectStatus(400);
      });

      it('should throw if no body was provided', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({})
          .expectStatus(400);
      });

      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt','accessToken');
      });

    });
  })

  describe("User", () => {
    describe("Get Me", () => {

      it('should throw 401 status code', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({})
          .expectStatus(401);
          
      });
      
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            "Authorization" : "Bearer $S{userAt}"
          })
          .expectStatus(200);
          
      });
    })

    describe("Edit User", () => {
      
    })
  })

  describe("Bookmarks", () => {
    describe("Create Bookamerk", () => {
      
      const dto: CreateBookmarkDTO = {
        title : "Do Not Care",
        description : "I Care Less",
        link : "https://github.com/vladwulf/nestjs-api-tutorial/"
      };

      it('should throw 401 status code', () => {
        return pactum
          .spec()
          .post('/bookmarks/')
          .withHeaders({})
          .withBody(dto)
          .expectStatus(401);
      });

      it('should throw 400 Status Code', () => {
        return pactum
          .spec()
          .post('/bookmarks/')
          .withHeaders({
            "Authorization" : "Bearer $S{userAt}"
          })
          .withBody({})
          .expectStatus(400);
      });
      
      it('should throw 201 status code', () => {
        return pactum
          .spec()
          .post('/bookmarks/')
          .withHeaders({
            "Authorization" : "Bearer $S{userAt}"
          })
          .withBody(dto)
          .expectStatus(201)
          .stores('bookmarkId', 'id');
      });
    })

    describe("Get Bookmarks", () => {

      it('should throw 401 status code', () => {
        return pactum
          .spec()
          .get('/bookmarks/')
          .withHeaders({})
          .expectStatus(401);
      });
      
      it('should throw 201 status code', () => {
        return pactum
          .spec()
          .get('/bookmarks/')
          .withHeaders({
            "Authorization" : "Bearer $S{userAt}"
          })
          .expectStatus(200);
      });
    })

    describe("Get Bookmark by Id", () => {
      
      it('should throw 201 status code', () => {
        return pactum
          .spec()
          .get("/bookmarks/{id}")
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            "Authorization" : "Bearer $S{userAt}"
          })
          .expectStatus(200);
      });
      
    })

    describe("Edit Bookmark", () => {
      const dto: EditBookmarkDTO = {
        title:
          'Kubernetes Course - Full Beginners Tutorial (Containerize Your Apps!)',
        description:
          'Learn how to use Kubernetes in this complete course. Kubernetes makes it possible to containerize applications and simplifies app deployment to production.',
      };
      
      it('should edit bookmark', () => {
        return pactum
          .spec()
          .patch('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: "Bearer $S{userAt}",
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.title)
          .expectBodyContains(dto.description);
      });
      
    })

    describe("Delete Bookmark", () => {
      
      it('should delete bookmark', () => {
        return pactum
          .spec()
          .delete('/bookmarks/{id}')
          .withPathParams('id', '$S{bookmarkId}')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(204);
      });

      it('should get empty bookmarks', () => {
        return pactum
          .spec()
          .get('/bookmarks')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    })

  })
});