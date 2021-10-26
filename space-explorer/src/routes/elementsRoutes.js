//Formatif 1 par: Francois Massé
import express from 'express';
import error from 'http-errors';

const router = new express.Router();

const elements = [{ symbol: 'I', name: 'Iaspyx', }, { symbol: 'Ex', name: 'Ewhyx', }, { symbol: 'Ye', name: 'Yefrium', },
                    { symbol: 'Sm', name: 'Smiathil', }, { symbol: 'E', name: 'Eplil', }, { symbol: 'G', name: 'Gloylium', },
                    { symbol: 'Ja', name: 'Jasmalt', }, { symbol: 'Xu', name: 'Xuskian', }, { symbol: 'L', name: 'Lukryx', },
                    { symbol: 'Fr', name: 'Froynyx', }, { symbol: 'K', name: 'Kreotrium', }, { symbol: 'Ve', name: 'Vethyx', },
                    { symbol: 'No', name: 'Nospite', }, { symbol: 'Q', name: 'Qobrium', }, { symbol: 'A', name: 'Awhil', },
                    { symbol: 'Z', name: 'Zuscum', }, { symbol: 'B', name: 'Blierium', }, { symbol: 'Wu', name: 'Wusnyx', }];

class ElementsRoutes {


    constructor() {
        router.get('/', this.getAll);
        router.post('/', this.post);
        router.get('/:symbol', this.getOne);
        router.delete('/:symbol', this.delete);

    }

    getAll(req, res, next) {
        console.log('Obtenir touts les éléments');        //écrit dans le terminal

        res.status(200);        //ou juste res.status(200).end();
        //res.set('content-Type', 'application/json');    /Pour informer le client que nous envoyons du json
        res.json(elements);

        //res.end();              //envoi la réponse au client
    }

    getOne(req, res, next) {
        console.log(req.params.symbol);

        const idSymbol = req.params.symbol;
        //Utilisation de la fonction find pour retrouver la planète

        const element = elements.find(p => p.symbol === idSymbol);   //=== cherche le même type, doit utiliser parseint(); == cherche équivalent
        console.log(element);
        if(element){     //si planet est undifined, alors auto-false
            res.status(200).json(element);
        } else {
            //res.status(404).end();
            return next(error.NotFound(`L'élément avec le symbole ${idSymbol} n'existe pas`));
        }
    }

    post(req, res, next) {      //Dans Postman, s'assurer d'aller mettre l'élément dans le body - raw - JSON 
        const newElement = req.body;
        console.log(newElement);

        const index = elements.findIndex(p => p.symbol === newElement.symbol);      //On compare string avec string
        if(index === -1){
            elements.push(newElement);
            res.status(201).json(newElement);
        }else{
            return next(error.Conflict(`Un élément avec le symbole ${newElement.symbol} existe déjà.`))
        }
        
    }
    
    delete(req, res, next) {
        console.log(req.params.symbol);
        const index = elements.findIndex(p => p.symbol ===  req.params.symbol);
        if(index == -1){            //Vérifier si la planète est innexistante
            //return next(error.NotFound(`La planète avec l'identifiant ${req.params.idPlanet} n'existe pas`));
            return next(error[404](`L'élément avec le symbole ${req.params.symbol} n'existe pas`))
        }
        elements.splice(index, 1);   //
        res.status(204).end();
    }
}
new ElementsRoutes();

export default router;