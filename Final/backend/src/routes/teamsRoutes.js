import express from 'express';
import httpErrors from 'http-errors';

import teamsService from '../services/teamsService.js';

const router = new express.Router();

class TeamsRoutes {
    constructor() {
        router.get('/:idTeam', this.getOne);
        router.get('/', this.getAll);
    }

    async getOne(req, res, next) {

        //TODO[1a]: Récupérer le paramètre d'URL L'équipe avec cet identifiant 5fd255995243436794040b3d existe
        const options = {};
        options.idTeam = req.params.idTeam;

        try {
            let team = await teamsService.retrieveOne(options);

            if(!team){
                return next(httpErrors.NotFound(`L'équipe avec l'identifiant ${req.params.idTeam} n'existe pas.`));
            }
            
            team = team.toObject();
            team = teamsService.transform(team);

            //TODO[1b]: Retourner la réponse
            res.status(200).json(team);
            
        } catch (err) {
            //TODO[1c] Traiter l'erreur 
            return next(err)
            
        }
    }

    async getAll(req, res, next) {
        let options = {};       //Changé l'initialisation de options pour permettre de le modifier en cas de query
        //console.log('test')
        //TODO[1e]: Permettre le paramètre d'URL player
        if(req.query.player){
            options = {'players.name': req.query.player};
            //console.log(options);
        }
        

        
        try {

            let teams = await teamsService.retrieveAll(options);

            teams = teams.map(t => {
                t = t.toObject();
                t = teamsService.transform(t);
                return t;
            });

            res.status(200).json(teams);

        } catch(err) {
            return next(err);
        }

    }

}

new TeamsRoutes();

export default router;
