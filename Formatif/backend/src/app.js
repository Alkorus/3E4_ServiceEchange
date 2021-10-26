import cors from 'cors';
import express from 'express';

import database from './utils/database.js';
import errors from './utils/errors.js';

import planetsRoutes from './routes/planetsRoutes.js';
import observationsRoutes from './routes/observationsRoutes.js';

const app = express();
app.use(cors());
database();

app.use(express.json());

app.use('/planets', planetsRoutes);
app.use('/observations',observationsRoutes);

//Route global pour la gestion des erreurs
app.use(errors);

export default app;