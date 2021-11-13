import express from 'express';

import database from './utils/database.js';
import errors from './utils/errors.js';

import customersRoutes from './routes/customersRoutes.js';
import ordersRoutes from './routes/ordersRoutes.js';
import pizzeriasRoutes from './routes/pizzeriasRoutes.js';

const app = express();

database(app);

app.use(express.json());

app.use('/customers', customersRoutes);
app.use('/orders', ordersRoutes);
app.use('/pizzerias', pizzeriasRoutes);

//Route global pour la gestion des erreurs
app.use('*', errors);

export default app;