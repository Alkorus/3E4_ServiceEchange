import express from 'express';
import httpErrors from 'http-errors';

import planetService from './../services/planetsService.js';

const router = new express.Router();

class PlanetsRoutes {
    constructor() {
        router.get('/:idPlanet', this.getOne);
        
    }

    async getOne(req, res, next) {

        const options = {};
        //[1c]: - Détecter si le paramètre embed est fourni et égale à observations. Si oui modifier les options pour faire fonctionner le code
        if(req.query.embed === 'observations'){
            options.isObservationEmbed = true;
        }  

        try {

            let planet = await planetService.retrieveOne(req.params.idPlanet, options);

            //[1a]: - Ajouter la gestion de l'erreur 404 si la planète demandée n'existe pas
            if(!planet){
                //console.log('error');
                return next(httpErrors.NotFound(`La planète avec l'identifiant ${req.params.idPlanet} n'existe pas.`))
            }
            
            planet = planet.toObject({virtuals:true});
            planet = planetService.transform(planet, options);

            res.status(200).json(planet);


        } catch(err) {
            return next(err);
        }

    }

}
new PlanetsRoutes();

export default router;
