import fs from 'fs';

const defs = fs.readFileSync(`${__dirname}/schema.graphql`).toString();

export default defs;
