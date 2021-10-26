import express from 'express';
import error from 'http-errors';
import observationsService from '../services/observationsService.js';
import _ from 'lodash';     

const router = new express.Router();

class ObservationsRoutes {

    constructor(){
        router.get('/:stationName', this.getStation);
        router.get('/:stationName/:idWeatherObservation', this.getObservation); 
        router.post('/', this.post);
        router.delete('/:idWeatherObservation', this.delete);
    }

    //Si on appel la méthode del, simplement laisser savoir qu'elle n'est pas implémentée
    async delete(req, res, next){
       
       return res.status(405).end();

    }

    //Ajouter une observation à la base de données
    async post(req, res, next) {

        //Valider qu'on a bien reçu quelque chose, le body n'est pas null
        if(_.isEmpty(req.body))
        {
            return next(error.BadRequest());    //Erreur 400
        }

        try{
            //1. Retrouver ce que le client veut ajouter
            const newObservation = req.body;
            newObservation.observationDate = new Date();    //Ajouter la date actuelle à l'observation

            //2. Esssayer de l'ajouter
            let observation = await observationsService.create(newObservation);

            //3. Préparer la réponse (transformation)
            observation = observation.toObject({getters:false, virtuals:false});
            observation = observationsService.transform(observation);

            //4. Envoyer une réponse
            res.status(201).json(observation);

        }catch(err){
            return next(err)
        }
    }

    //Obtenir une observation spécifique de la base de données
    async getObservation(req, res, next) {
        
        const stationName = req.params.stationName;  
        const idWeatherObservation = req.params.idWeatherObservation;
        const transformationOptions = {};
        

        //Construction des options de transformation
        if(req.query.unit){
            const unit = req.query.unit;
            if(unit === 'm' || unit === 's' || unit === 'f')
            {
                transformationOptions.unit = unit;
            }else{
                return next(error.BadRequest("La paramètre unit doit avoir la valeur m, s ou f pour Celsius, Kelvin ou Farenheit"));
            }
        }

        try{
            //Trouver dans la base de données l'observation avec son id
            let observation = await observationsService.retrieveId(idWeatherObservation);

            //Si rien n'a été trouvé, retourner une erreur, on n'a rien trouvé
            if(!observation){
                return next(error.NotFound(`L'observation avec l'identifiant ${idWeatherObservation} n'existe pas.`))
            }

            //Si l'observation a été trouvée mais qu'elle ne vient pas de la même station que la query, retourner une erreur
            if(observation.location.station != stationName)
            {
                return next(error.BadRequest(`L'observation avec l'identifiant ${idWeatherObservation} n'est pas liée à la station ${stationName}.`))
            }

            //Transformer la réponse
            observation = observation.toObject({getters:false, virtuals:false});
            observation = observationsService.transform(observation, transformationOptions);

            //Envoyer une réponse
            res.status(200).json(observation);

        }catch(err){
           return next(err);
        }
        
    }

    //Obtenir toutes les observations d'une station
    async getStation(req, res, next) { 

        const stationName = req.params.stationName;
        const transformationOptions = {};
        

        //Construction des options de transformation
        if(req.query.unit){
            const unit = req.query.unit;
            if(unit === 'm' || unit === 's' || unit === 'f')
            {
                transformationOptions.unit = unit;
            }else{
                return next(error.BadRequest("La paramètre unit doit avoir la valeur m, s ou f pour Celsius, Kelvin ou Farenheit"));
            }
        }


        try{        
            //Retrouver dans la BD toutes les observations avec ce nom de station
            let observations = await observationsService.retrieveByStationName (stationName);

            //Si l'objet retourné par la recherche est vide, on envoi un message d'erreur
            if(observations.length == 0){
                return next(error.NotFound(`La station avec l'identifiant ${stationName} n'existe pas.`))
            }
           
            //Transformation de la réponse
            observations = observations.map(obser => {
                obser = obser.toObject({getters:false, virtuals:false});
                obser = observationsService.transform(obser, transformationOptions);
                return obser;
            });
            
            //Envoi d la réponse
            res.status(200).json(observations);
           
        }catch(err){
            return next(err);
        }
        
    }

}

new ObservationsRoutes();

export default router;