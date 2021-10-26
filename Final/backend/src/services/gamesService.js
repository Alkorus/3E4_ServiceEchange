import Games from '../models/game.js';

class GamesService {

    retrieveOne(idGame) {
        let query = Games.findById(idGame).populate('home').populate('away');
        return query;
    }
    
    retrieveAll(options) {
        
        //TODO[2a] Prendre en considération les paramètres pour la pagination et le tri (ATTENTION: Il faut conserver les populate sur home et away)
        const retrieveQuery = Games.find().limit(options.limit).skip(options.skip).sort('-gameDate').populate('home').populate('away');
        //TODO[2a] Ajouter la requête pour compter le nombre de document
        const partiesTotal = Games.countDocuments();
        
        //TODO[2a] Modifier la retour de la méthode
        return Promise.all([retrieveQuery, partiesTotal]) ;
    }
 
    transform(game) {
      
        game.href = `${process.env.BASE_URL}/games/${game._id}`;
        
        if(game.home.planet) {
            game.home = game.home.planet;
        }
        if(game.away.planet) {
            game.away = game.away.planet;
        }
        
        //TODO[2c] Résultat de la partie
        if(game.score.home === game.score.away){
            game.result = `Partie nulle - ${game.score.away} à  ${game.score.home} entre  ${game.home} et  ${game.away}`;
        }else{
            if(game.score.away > game.score.home){
                game.result = `${game.away} l'emporte ${game.score.away} à ${game.score.home} contre ${game.home}`;
            }else{
                game.result = `${game.home} l'emporte ${game.score.home} à ${game.score.away} contre ${game.away}`;
            }
        }

        delete game._id;

        return game;
    }
}

export default new GamesService();