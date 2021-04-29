import type { Router, Request, Response } from 'express';

import { BadRequestError, NotFoundError, StatusCode } from '@jordanjordanb-portfolio/common';
import { Project } from '../models';
import mongoose from 'mongoose';

export default function getRoute(router: Router) {
  router.delete('/:projectId', async (req: Request, res: Response) => {
    const { projectId } = req.params;

    const $projectId = projectId.trim();

    if (!mongoose.Types.ObjectId.isValid($projectId)) {
      throw new BadRequestError('Invalid Project ID specified');
    }

    const project = await Project.findByIdAndDelete(`${$projectId}`).exec();

    if (!project) {
      throw new NotFoundError(`No project found with the ID of '${projectId}'`);
    }

    return res.sendStatus(StatusCode.OK);
  });
}
