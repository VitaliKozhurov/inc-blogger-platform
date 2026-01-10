import dotenv from 'dotenv';
import express from 'express';

import { initApp } from './init-app';

dotenv.config();

const app = express();

initApp(app);
