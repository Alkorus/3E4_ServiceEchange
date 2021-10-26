import express from 'express';
import error from 'http-errors';
import _ from 'lodash';

import planetsService from '../services/planetsService.js';

import planetRoutesValidators from '../validators/planetsRoutesValidators.js'
import validator from '../helpers/validator.js'

const router = express.Router(); //Utilitaire d'express pour ajouter des routes

class PlanetsRoutes {

    constructor() {
        router.get('/', this.getAll); //Ajoute une route à notre serveur sur GET /planets
        router.get('/:idPlanet', this.getOne); //localhost:5000/planets/600
        router.post('/', this.post); //Ajoute une route à notre serveur sur POST /planets
        router.patch('/:idPlanet', this.patch); // Modification partielle d'un document
        router.delete('/:idPlanet', this.delete)  //Supprime un document 
        router.put('/:idPlanet', planetRoutesValidators.putValidator(), validator, this.put);// Modification complète d'un document

    }

    async put(req, res, next) {
        //Mise à jour complète d'une planète -> en SQL UPDATE
        /*if(_.isEmpty(req.body)){
            return next(error.BadRequest())     //Erreur 404
        }*/ //Plus nécessaire car le validateur le vérifie

        //TODO: Validation


        try{
            //: Trouver la planète et faire la modification dans la base de données
            let planetMod = await planetsService.update(req.params.idPlanet, req.body);

            //La planète n'existe pas, donc la mise à jour ne peut pas être faite
            if(!planetMod){
                return(error.NotFound(`La planète ${req.params.idPlanet} n'existe pas`))
            }

            //Transformation de la réponse
            planetMod = planetMod.toObject({ getters: false, virtuals: false }); 
            planetMod = planetsService.transform(planetMod);

            //: Envoyer une réponse
            res.status(200).json(planetMod);

        }catch(err){
            return next(err);
        }

    }

    async delete(req, res, next) {
        
        try {
            //1. Trouver si la planète existe
            //2. Supprimer la planète
            const deleteResult = await planetsService.delete(req.params.idPlanet);
            if(deleteResult) {
                //3.Envoyer une réponse
                res.status(204).end(); //No Content
            } else {
               //La planète n'existe pas 
               return next(error.NotFound(`La planète avec l'identifiant ${req.params.idPlanet} n'existe pas.`)); 
            }
    
        } catch(err) {
            return next(err);
        }

    }

    //Même chose qu'un PUT mais peut être incomplet
    async patch(req, res, next) {

       //Mise à jour complète d'une planète -> en SQL UPDATE
       if(_.isEmpty(req.body)){
        return next(error.BadRequest())     //Erreur 404
    }

    //TODO: Validation
    try{
        //: Trouver la planète et faire la modification dans la base de données
        let planetMod = await planetsService.update(req.params.idPlanet, req.body);

        //La planète n'existe pas, donc la mise à jour ne peut pas être faite
        if(!planetMod){
            return(error.NotFound(`La planète ${req.params.idPlanet} n'existe pas`))
        }

        //Transformation de la réponse
        planetMod = planetMod.toObject({ getters: false, virtuals: false }); 
        planetMod = planetsService.transform(planetMod);

        //: Envoyer une réponse
        res.status(200).json(planetMod);

    }catch(err){
        return next(err);
    }
    }

    /**
    * @param {express.Request} req
    * @param {express.Response} res
    * @param {express.NextFunction} next
    */
    async post(req, res, next) {
       
        if(_.isEmpty(req.body)) {
            return next(error.BadRequest()); //Erreur 400
        }

        try {

            //1. Retrouver ce que le client veut ajouter
            const newPlanet = req.body;

            //2. Essayer de l'ajouter dans la base de données
            let planet = await planetsService.create(newPlanet);

            //3. Préparer la réponse(transformation) 
            //Transformer la réponse
            planet = planet.toObject({ getters: false, virtuals: false }); 
            planet = planetsService.transform(planet, {}, options);

            //4. Envoyer une réponse
            res.header('Loction', planet.href);
            if(req.query._body === 'false'){
                res.status(201).end();      //Envoi le succès sasn body
            }else{
                res.status(201).json(planet);
            }

            
            
            

        } catch(err) {
            return next(err);
        }

    }

    async getOne(req, res, next) {
        const options = {
            isExplorationsEmbed: false
        }
        const idPlanet = req.params.idPlanet;

        if(req.query.embed === 'explorations'){
            options.isExplorationEmbed = true;
        }   

        try {
            //Trouver dans la base de données la planète avec idPlanet
            let planet = await planetsService.retrieveById(idPlanet, options);

            //La planète demandée n'existe pas
            if(!planet) {
                return next(error.NotFound(`La planète avec l'identifiant ${idPlanet} n'existe pas.`));
            }

            //Transformer la réponse
            planet = planet.toObject({ getters: false, virtuals: false }); 
            planet = planetsService.transform(planet, options);

            //Envoyer une réponse
            res.status(200).json(planet);
        } catch(err) {
            return next(err);
        }

    }

    async getAll(req, res, next) { 

        //http://localhost:5000/planets?unit=c
        //http://localhost:5000/planets?explorer=Karim

        const criteria = {};
        const transformOptions = {};

        //Construction des critères de la requête à la base de données
        if(req.query.explorer) {
            criteria.discoveredBy = req.query.explorer;
        }

        //Construction des options de transformation
        if (req.query.unit) {
            const unit = req.query.unit;
            if (unit === 'c') {
                transformOptions.unit = unit;
            } else {
                return next(error.BadRequest('Le paramètre unit doit avoir la valeur c pour Celsius'));
            }
        }

        //Possibilité de plusieurs conditions à valider pour la transformation

        try {
            let planets = await planetsService.retrieveByCriteria(criteria);

            //Transformation de la réponse
            planets = planets.map(p => {
                p = p.toObject({ getters: false, virtuals: true }); 
                p = planetsService.transform(p, transformOptions);
                return p;
            });

            res.status(200).json(planets);
        } catch (err) {
            return next(err);
        }

    }

}

new PlanetsRoutes();

export default router; //Permet d'utiliser le routeur à l'extérieur du fichier
