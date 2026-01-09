import express from 'express';

import { bodyParserMiddleware } from './core/middleware';

const PORT = 5000;

const app = express();

app.use(bodyParserMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
