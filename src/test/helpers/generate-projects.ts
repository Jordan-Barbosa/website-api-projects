import type { LeanDocument } from 'mongoose';

import { Project, ProjectDoc } from '../../models';

/**
 * * Generates x amount of projects for testing
 */
export const generateProjects = async (count: number = 1) => {
  let i = 0;
  let projects: LeanDocument<ProjectDoc>[] = [];

  while (i < count) {
    const randomChars = Math.random().toString(36).substring(7);

    const project = Project.build({
      name: randomChars,
      desc: randomChars,
      url: `http://${randomChars}.com`,
      github: 'https://github.com',
      technology: [],
      isHeroku: false,
    });

    const savedProject = await project.save();

    projects = [...projects, savedProject];

    ++i;
  }

  return projects;
};
