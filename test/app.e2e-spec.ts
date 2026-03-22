/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import supertest from 'supertest';
import { AppModule } from '../src/app.module';
import { ProjectStatus } from '../src/projects/project.entity';
import { CostCategory } from '../src/cost-items/cost-item.entity';

const request = supertest;

describe('Construction Cost Manager API (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
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

  afterEach(async () => {
    await app.close();
  });

  // ───────────────────────────── Projects ──────────────────────────────

  describe('/projects (POST)', () => {
    it('should create a project and return 201', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .send({
          name: 'Bridge Construction',
          description: 'Build a new pedestrian bridge',
          location: 'River Road, Springfield',
          budget: 1200000,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.name).toBe('Bridge Construction');
          expect(res.body.status).toBe(ProjectStatus.PLANNING);
        });
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/projects')
        .send({ name: 'Incomplete' })
        .expect(400);
    });
  });

  describe('/projects (GET)', () => {
    it('should return an array of projects', async () => {
      await request(app.getHttpServer()).post('/projects').send({
        name: 'Park Development',
        description: 'Develop community park',
        location: 'Central Ave',
        budget: 300000,
      });

      return request(app.getHttpServer())
        .get('/projects')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body.length).toBeGreaterThanOrEqual(1);
        });
    });
  });

  describe('/projects/:id (GET, PATCH, DELETE)', () => {
    it('should fetch, update and delete a project', async () => {
      const createRes = await request(app.getHttpServer())
        .post('/projects')
        .send({
          name: 'Warehouse Build',
          description: 'Construct a large warehouse',
          location: 'Industrial Zone',
          budget: 800000,
        })
        .expect(201);

      const id = createRes.body.id;

      await request(app.getHttpServer())
        .get(`/projects/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(id);
        });

      await request(app.getHttpServer())
        .patch(`/projects/${id}`)
        .send({ status: ProjectStatus.IN_PROGRESS, budget: 900000 })
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe(ProjectStatus.IN_PROGRESS);
          expect(res.body.budget).toBe(900000);
        });

      await request(app.getHttpServer()).delete(`/projects/${id}`).expect(204);

      await request(app.getHttpServer()).get(`/projects/${id}`).expect(404);
    });

    it('should return 404 for a non-existent project', () => {
      return request(app.getHttpServer())
        .get('/projects/non-existent-id')
        .expect(404);
    });
  });

  // ──────────────────────────── Cost Items ─────────────────────────────

  describe('/cost-items (POST)', () => {
    it('should create a cost item linked to a project', async () => {
      const projectRes = await request(app.getHttpServer())
        .post('/projects')
        .send({
          name: 'Hospital Wing',
          description: 'New hospital wing extension',
          location: '45 Health Blvd',
          budget: 5000000,
        });

      const projectId = projectRes.body.id;

      return request(app.getHttpServer())
        .post('/cost-items')
        .send({
          projectId,
          category: CostCategory.LABOR,
          description: 'Electrical installation team',
          quantity: 5,
          unitCost: 3000,
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.projectId).toBe(projectId);
          expect(res.body.totalCost).toBe(15000);
        });
    });

    it('should return 404 when project does not exist', () => {
      return request(app.getHttpServer())
        .post('/cost-items')
        .send({
          projectId: '00000000-0000-0000-0000-000000000000',
          category: CostCategory.MATERIALS,
          description: 'Bricks',
          quantity: 100,
          unitCost: 2,
        })
        .expect(404);
    });

    it('should return 400 when required fields are missing', () => {
      return request(app.getHttpServer())
        .post('/cost-items')
        .send({ description: 'Incomplete item' })
        .expect(400);
    });
  });

  describe('/cost-items/project/:projectId (GET)', () => {
    it('should return cost items for a given project', async () => {
      const projectRes = await request(app.getHttpServer())
        .post('/projects')
        .send({
          name: 'School Build',
          description: 'Build a new primary school',
          location: 'Education Lane',
          budget: 2000000,
        });

      const projectId = projectRes.body.id;

      await request(app.getHttpServer()).post('/cost-items').send({
        projectId,
        category: CostCategory.MATERIALS,
        description: 'Concrete',
        quantity: 200,
        unitCost: 120,
      });

      return request(app.getHttpServer())
        .get(`/cost-items/project/${projectId}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
          expect(res.body).toHaveLength(1);
          expect(res.body[0].projectId).toBe(projectId);
        });
    });
  });

  describe('/cost-items/:id (GET, PATCH, DELETE)', () => {
    it('should fetch, update and delete a cost item', async () => {
      const projectRes = await request(app.getHttpServer())
        .post('/projects')
        .send({
          name: 'Road Repair',
          description: 'Repair main road',
          location: 'Main Road',
          budget: 400000,
        });

      const projectId = projectRes.body.id;

      const itemRes = await request(app.getHttpServer())
        .post('/cost-items')
        .send({
          projectId,
          category: CostCategory.EQUIPMENT,
          description: 'Asphalt paving machine rental',
          quantity: 1,
          unitCost: 5000,
        });

      const itemId = itemRes.body.id;

      await request(app.getHttpServer())
        .get(`/cost-items/${itemId}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.id).toBe(itemId);
        });

      await request(app.getHttpServer())
        .patch(`/cost-items/${itemId}`)
        .send({ quantity: 3 })
        .expect(200)
        .expect((res) => {
          expect(res.body.quantity).toBe(3);
          expect(res.body.totalCost).toBe(15000);
        });

      await request(app.getHttpServer())
        .delete(`/cost-items/${itemId}`)
        .expect(204);

      await request(app.getHttpServer())
        .get(`/cost-items/${itemId}`)
        .expect(404);
    });
  });
});
