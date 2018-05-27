import { exec } from './helpers';

import pkg from '../package.json';

const { image, registry } = pkg.deploy;

exec(`docker build -t ${image} .`);
exec(`docker tag ${image} ${registry}/${image}`);
exec(`docker push ${registry}/${image}`);
