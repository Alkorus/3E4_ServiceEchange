import express from 'express';
import error from 'http-errors';
import planetsService from '../services/planetsService.js';
import _, { endsWith } from 'lodash';     //"_" pour lodash

const router = new express.Router();        //Utilitaire d'express pour ajouter des routes

class PlanetsRoutes {

    constructor(){
        router.get('/', this.getAll)     //ajoute une route à notre serveur
        router.get('/:idPlanet', this.getOne);      //localhost:5000/planets/600
        router.post('/', this.post);     //Ajoute une route à notre serveur sur POST /planets
        router.patch('/:idPlanet', this.patch); //PATCH -> Modification partielle 
        router.delete('/:idPlanet', this.delete) //Supprime un document
        router.put('/:idPlanet', this.put); //Modification complète
    }

    put(req, res, next){
        console.log(`put - ${req.params.idPlanet}`);
        return next(error.NotImplemented());
    }

    async delete(req, res, next){
       
        try{
            //1.    Trouver si la planète existe
            //2.    Supprimer la planète
            const deleteResult = await planetsService.delete(req.params.idPlanet);
            if(deleteResult)
            {
                res.status(204).endsWith(); 
            }else{
                //La planète n'existe pas
                return next(error.NotFound(`La planète avec l'identifiant ${req.params.idPlanet} n'existe pas.`))
            }

            

            //3.    Envoyer une réponse
                //204 = no content

        }catch(err){
            return next(err);
        }

       


    }

    patch(req, res, next){
        console.log(`patch - ${req.params.idPlanet}`);
        return next(error.NotImplemented());
    }
   
    async post(req, res, next) {

        //Valider qu'on a bien reçu quelque chose, le body n'est pas null
        if(_.isEmpty(req.body))
        {
            return next(error.BadRequest());    //Erreur 400
        }

        try{
            //1. Retrouver ce que le client veut ajouter
            const newPlanet = req.body;

            //2. Esssayer de l'ajouter
            let planet = await planetsService.create(newPlanet);            //La fonction retourne la planète après son ajout à la DB, incluant son ID

            //3. Préparer la réponse (transformation)
            planet = planet.toObject({getters:false, virtuals:false});
            planet = planetsService.transform(planet);

            //4. Envoyer une réponse
            res.status(201).json(planet);

        }catch(err){
            return next(err)
        }
        
    }

    async getOne(req, res, next) {
        
        const idPlanet = req.params.idPlanet;

        try{
            //TODO: Trouver dans al base de données la planète avec idPlanet
            let planet = await planetsService.retrieveId(idPlanet);

            if(!planet){
                return next(error.NotFound(`La planète avec l'identifiant ${idPlanet} n'existe pas.`))
            }

            //TODO: Transformer la réponse
            planet = planet.toObject({getters:false, virtuals:false});
            planet = planetsService.transform(planet);

            //TODO: Envoyer une réponse
            res.status(200).json(planet);

        }catch(err){
           return next(err);
        }
        
        
        /*console.log(req.params.idPlanet);

        const idPlanet = req.params.idPlanet;
        //Utilisation de la fonction find pour retrouver la planète

        const planet = planets.find(p => p.id === parseInt(idPlanet, 10));   //=== cherche le même type, doit utiliser parseint(); == cherche équivalent
        console.log(planet);
        if(planet){     //si planet est undifined, alors auto-false
            res.status(200).json(planet);
        } else {
            //res.status(404).end();
            return next(error.NotFound(`La planète avec l'identifiant ${idPlanet} n'existe pas`));
        }*/

    }

    async getAll(req, res, next) { 

        //http://localhost:5000/planets?unit=c
        //http://localhost:5000/planets?explorer=Yannick

        //console.log('Obtenir toutes les planettes');        //écrit dans le terminal

        const transformationOptions = {};
        const criteria = {};

        //Construction des critères de la requète à la base de données
        if(req.query.explorer){
            criteria.discoveredBy = req.query.explorer;
        }

        //Construction des options de transformation


        if(req.query.unit){
            const unit = req.query.unit;
            if(unit === 'c')
            {
                transformationOptions.unit = unit;
            }else{
                return next(error.BadRequest("La paramèetre unit doit avoir la valeur c pour Celsius"));
            }
        }

        //Plusieurs conditions à valider

        try{        
            let planets = await planetsService.retrieveByCriteria(criteria);

            //TODO: Transformation de la réponse
            planets = planets.map(p => {
                p = p.toObject({getters:false, virtuals:false});
                p = planetsService.transform(p, transformationOptions);
                return p;
            });

            res.status(200).json(planets);
        }catch(err){
            return next(err);
        }
        

        /*
        res.status(200);        //ou juste res.status(200).end();
        //res.set('content-Type', 'application/json');    /Pour informer le client que nous envoyons du json
        res.json(planets);

        //res.end();              //envoi la réponse au client
        */
    }

}


new PlanetsRoutes();

export default router;      //Permet d'utiliser le routeur de l'extérieur