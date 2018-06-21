import { exec } from './helpers';

import pkg from '../package.json';

const { image, registry, tags } = pkg.deploy;

exec(`docker build -t ${image} .`);

(tags || []).forEach(
  tag => tag && exec(`docker tag ${image} ${registry}/${image}:${tag}`),
);

exec(`docker push ${registry}/${image}`);
