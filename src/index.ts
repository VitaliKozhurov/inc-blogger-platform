import express from 'express';

import { getData } from './getData';

const app = express();

app.get('/', (_, res) => {
  getData();

  return res.send('Hello World!');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
