import express from 'express';
import database from './helpers/database.js';
import planetsRoutes from './routes/planetsRoutes.js';
import elementsRoutes from './routes/elementsRoutes.js';
import errors from './helpers/errors.js'

const app = express();

database(app);

app.use(express.json());

app.get('/premiere', (req, res, next) => {
    console.log('Ma première route');
    res.status(200);        //Code http 200 = OK
    res.set('Content-Type', 'text/html');
    res.send('<html><strong>Notre première route avec express</strong></html>');
});

/*app.get('/somme', (req, res, next) => {

    const a = parseInt(req.query.a, 10);        //Par défaut, toute querry est une string
    const b = parseInt(req.query.b, 10);

    const somme = a + b;

    res.status(200);
    res.set('Content-Type', 'text/plain');
    res.send(somme.toString());
});*/

/*app.get('/:operation', (req, res, next) => {

    const operation = req.params.operation;
    console.log(operation);

    const a = parseInt(req.query.a, 10);        //Par défaut, toute querry est une string
    const b = parseInt(req.query.b, 10);

    let resultat = 0;

    //Operation = somme (+)
    //          = difference (-)
    //          = produit (*)
    //          = quotient (/)
    //          = reste (%) 

    //TODO: switch sur operation ou plusieurs if/else
    switch(operation){
        case 'somme':
            resultat = a + b;
            break;
        case 'difference':
            resultat = a - b;
            break;
        case 'produit':
            resultat = a * b;
            break;
        case 'quotient':
            resultat = a / b;
            break;
        case 'reste':
            resultat = a % b;
            break;
        default:
            resultat = 'error';
            break;
    }

    res.status(200);
    res.set('Content-Type', 'text/plain');
    res.send(resultat.toString());
});*/

app.use('/planets', planetsRoutes)

//TODO: Formatif 1
app.use('/elements', elementsRoutes)

//Route globale pour la gestion des erreurs
app.use('*', errors);

export default app;