import request from 'supertest';
import { loadApp } from '../../app';
import { generateProjects } from '../../test/helpers';

it('should get all projects', async () => {
  const app = await loadApp();

  await generateProjects(2);

  const response = await request(app).get('/api/projects').send().expect(200);

  expect(response.body.count).toEqual(2);
  expect(response.body.data.length).toEqual(2);
});

it('should return an empty array', async () => {
  const app = await loadApp();

  const response = await request(app).get('/api/projects').send().expect(200);

  expect(response.body.count).toEqual(0);
  expect(response.body.data.length).toEqual(0);
  expect(response.body.data).toEqual([]);
});
