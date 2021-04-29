import request from 'supertest';
import mongoose from 'mongoose';
import { loadApp } from '../../app';
import { Project } from '../../models';

it('returns a 400 when invalid object id is supplied', async () => {
  const fakeProjectId = 'fakeProjectId';
  const app = await loadApp();

  await request(app).delete(`/api/projects/${fakeProjectId}`).send().expect(400);
});

it('returns a 404 when no project id found for deletion with the specified project id', async () => {
  const fakeProjectId = new mongoose.Types.ObjectId().toHexString();
  const app = await loadApp();

  await request(app).delete(`/api/projects/${fakeProjectId}`).send().expect(404);
});

it('returns a 200 when project is deleted', async () => {
  const app = await loadApp();

  const project = Project.build({
    name: 'fake',
    desc: 'fake desc',
    url: 'http://fakeurl.com',
    github: 'https://github.com',
    technology: [],
    isHeroku: false,
  });

  await project.save();

  await request(app).delete(`/api/projects/${project.id}`).send().expect(200);
});
