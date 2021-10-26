import Teams from '../models/team.js';
import gamesService from './gamesService.js';

class TeamsService {
    
    retrieveOne(options) {
        //ATTENTION: Vous ne pouvez pas modifier cette fonction
        return Teams.findById(options.idTeam);
    }

    retrieveAll(options) {
        //let query = Teams.find();
        //TODO[1e]: Ajouter l'option de retrouver l'équipe de joueur avec nom fourni
        console.log(options);
        let query = Teams.find(options);
        return query;
    }

    transform(team) {
        
        
        
        //TODO[1d]: Ajouter le href à l'équipe
        team.href = `${process.env.BASE_URL}/teams/${team._id}`;
        
        //TODO[1d]: Ajouter la propriété rating à l'équipe qui correspond à la moyenne des ratings des joueurs de l'équipe
        let scoreTot = 0;
        let nbJoueurs = 0;
        team.players.forEach(p => {
            scoreTot += p.rating;
            nbJoueurs += 1;
        });
        //console.log(scoreTot);
        //console.log(nbJoueurs);
        let rating = (scoreTot/nbJoueurs).toFixed(2);   //Trouver la moyenne arrondie à deux décimales
        //console.log(rating);
        team.rating = parseFloat(rating);   //Ramener la moyenne en type float

        delete team._id;
        return team;
    }
}

export default new TeamsService();
