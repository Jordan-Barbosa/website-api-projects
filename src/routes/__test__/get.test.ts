import request from 'supertest';
import mongoose from 'mongoose';
import { loadApp } from '../../app';
import { generateProjects } from '../../test/helpers';

it('returns a 400 when invalid object id is supplied', async () => {
  const fakeProjectId = 'fakeProjectId';
  const app = await loadApp();

  await request(app).get(`/api/projects/${fakeProjectId}`).send().expect(400);
});

it('should return 404 if no project was found', async () => {
  const projectId = new mongoose.Types.ObjectId().toHexString();
  const app = await loadApp();

  await request(app).get(`/api/projects/${projectId}`).send().expect(404);
});

it('should return document', async () => {
  const app = await loadApp();
  const project = (await generateProjects(1))[0];

  const res = await request(app).get(`/api/projects/${project.id}`).send().expect(200);

  expect(res.body).toEqual(JSON.parse(JSON.stringify(project)));
});
