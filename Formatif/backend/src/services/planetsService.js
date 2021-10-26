import Planets from '../models/planet.js';

import observationsService from './observationsService.js';

class PlanetsService {

    retrieveOne(idPlanet, options) {
    
        //[1c]: Si les observations sont demandées ajuster la requête en conséquence
        const retrieveQuery = Planets.findById(idPlanet);

        if(options.isObservationEmbed){
            retrieveQuery.populate('observations');

        }

        return retrieveQuery;
    }

    transform(planet, options = {}) {

        planet.href = `${process.env.BASE_URL}/planets/${planet._id}`;

        if(options.isObservationsEmbed) {
            planet.observations.map(o => {
                o = observationsService.transform(o);
                return o;
            });
        }

        delete planet._id;
        delete planet.id;

        return planet;

    }
}

export default new PlanetsService();