import cors from 'cors';
import express from 'express';

import database from './utils/database.js';
import errors from './utils/errors.js';

import teamsRoutes from './routes/teamsRoutes.js';
import gamesRoutes from './routes/gamesRoutes.js';

const app = express();
app.use(cors());

database();

app.use(express.json());

app.use('/teams', teamsRoutes);
app.use('/games',gamesRoutes);

//Route global pour la gestion des erreurs
app.use(errors);

export default app;