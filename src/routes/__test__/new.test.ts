import request from 'supertest';
import { loadApp } from '../../app';
import { natsWrapper } from '../../nats-wrapper';
import { Project, ProjectAttrs, ProjectDoc } from '../../models';

it('returns a 400 when invalid values are sent', async () => {
  const app = await loadApp();

  await request(app).post('/api/projects').send({}).expect(400);
});

it('should return 201 and save project to database', async () => {
  const app = await loadApp();

  const PROJECT: ProjectAttrs = {
    name: 'fakeproject',
    desc: 'description',
    url: 'https://fakeurl.com',
    github: 'https://github.com',
    technology: ['javascript'],
    isHeroku: false,
  };

  const { body }: { body: ProjectDoc } = await request(app).post('/api/projects').send(PROJECT).expect(201);

  const createdProject = await Project.findById(body.id).exec();

  expect(body).toEqual(JSON.parse(JSON.stringify(createdProject)));
});

it('should publish an event', async () => {
  const app = await loadApp();

  const PROJECT: ProjectAttrs = {
    name: 'fakeproject',
    desc: 'description',
    url: 'https://fakeurl.com',
    github: 'https://github.com',
    technology: ['javascript'],
    isHeroku: false,
  };

  await request(app).post('/api/projects').send(PROJECT).expect(201);

  expect(natsWrapper.stan.publish).toHaveBeenCalled();
});
