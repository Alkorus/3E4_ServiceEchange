import dayjs from 'dayjs';
import Observations from '../models/observation.js';

class ObservationsService {
    retrieveAll(options) {
        let retrieveQuery = Observations.find();
        let countQuery = Observations.countDocuments();

        if (options.humidity) {
            //[2b] : Ajouter les paramètres des méthodes find (L11 et L12) pour ajouter le critère  --> humidity doit > que l'option fournie
            retrieveQuery = Observations.find({humidity: {$gt: options.humidity}}); 
            countQuery = Observations.countDocuments({humidity: {$gt: options.humidity}}); 
        }

        retrieveQuery.limit(options.limit).skip(options.skip).sort('-observationDate'); //[2a] Ajouter les paramètre au trois fonction sur la requête moongoose

        return Promise.all([retrieveQuery, countQuery]);
    }

    transform(observation) {

        //[2c]: href
        observation.href = `${process.env.BASE_URL}/observations/${observation._id}`;

        //[2c]: href de la planet
        observation.planet = {href: `${process.env.BASE_URL}/planets/${observation.planet}`};
       
        //[2c]: Format de la date YYYY-MM-DD HH:mm:ss
        observation.observationDate = dayjs(observation.observationDate).format('YYYY-MM-DD HH:mm:ss');

        //[2c]: Supprimer id
        delete observation._id;

        return observation;
    }
}

export default new ObservationsService();
