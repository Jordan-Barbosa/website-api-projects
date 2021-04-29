import type { Router } from 'express';

import { readdir, lstat } from 'fs/promises';
import path from 'path';

type Route = {
  default: (route: Router) => void;
};

export const loadRoutes = async (router: Router, dir: string) => {
  const routes = [];
  const _dir = path.resolve('src', dir);

  const directories = await readdir(_dir);

  for (const file of directories) {
    const isDir = (await lstat(path.join(_dir, file))).isDirectory();

    if (file === path.basename(__filename) || file.split('.').pop() === 'map' || isDir) {
      continue;
    }

    routes.push(import(`../${dir}/${file}`));

    continue;
  }

  for await (const route of (await Promise.all(routes)) as Route[]) {
    if (!!route?.default) {
      route.default(router);
    }
  }
};
