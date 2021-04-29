import type { Router, Request, Response } from 'express';

import { StatusCode, validateRequest } from '@jordanjordanb-portfolio/common';
import { ProjectCreatedPublisher } from '../events/publishers/project';
import { Project, ProjectAttrs } from '../models';
import { natsWrapper } from '../nats-wrapper';
import { body } from 'express-validator';

export default function getRoute(router: Router) {
  router.post(
    '/',
    [
      body('name').notEmpty().escape().isString().isLength({ min: 3, max: 50 }).withMessage('Name is invalid'),
      body('desc').notEmpty().escape().isString().isLength({ min: 3, max: 1000 }).withMessage('Description is invalid'),
      body('url').notEmpty().isURL().withMessage('URL is invalid'),
      body('github')
        .notEmpty()
        .isURL({ host_whitelist: ['github.com', 'www.github.com'] })
        .withMessage('Github URL is invalid'),
      body('technology').notEmpty().isArray().withMessage('Technologies are invalid'),
      body('technology.*').notEmpty().escape().isString().withMessage('Technologies are invalid'),
      body('isHeroku').isBoolean().withMessage("'isHeroku' field is invalid"),
    ],
    validateRequest,
    async (req: Request<never, never, ProjectAttrs>, res: Response) => {
      const { name, desc, url, github, technology, isHeroku } = req.body;

      const project = Project.build({ name, desc, url, github, technology, isHeroku });

      await project.save();

      // Not needed at the moment, as there's no one to listen
      new ProjectCreatedPublisher(natsWrapper.stan).publish({
        id: project.id,
        name: project.name,
        desc: project.desc,
        url: project.url,
        github: project.github,
        technology: project.technology,
        isHeroku: project.isHeroku,
      });

      return res.status(StatusCode.CREATED).send(project);
    }
  );
}
