import express from 'express';
import database from './helpers/database.js';
import observationsRoutes from './routes/observationsRoutes.js';
import errors from './helpers/errors.js'

const app = express();

database(app);

app.use(express.json());

app.use('/observations', observationsRoutes)

//Route globale pour la gestion des erreurs
app.use('*', errors);

export default app;