import dayjs from 'dayjs';

import Planet from '../models/planets.js';

const ZERO_KELVIN = -273.15;

class PlanetsService{
    //CRUD
    //C => Create
    //R => Retrieve
    //U => Update
    //D => Delete

    create(planet){
        return Planet.create(planet);
    }

    delete(idPlanet)
    {
        return Planet.findByIdAndDelete(idPlanet);
    }

    update(idPlanet, planet)
    {
        return Planet.findByIdAndUpdate(idPlanet, planet);
    }

    retrieveByCriteria(criteria){

        // les critères sont ajoutés avec un ET
        /*const testCriteria = {
            discoveredBy:'Skadex',
            temperature: {$gt:240},
            'position.y': {$lt:500}
        }*/

        //Les critères sont ajoutés avec un OU
        /*const testCriteria = {
            $or:[{
                discoveredBy:'Skadex',
                temperature: {$gt:240}
            }]
        }*/        

        return Planet.find(criteria);       //SELECT * FROM Planets WHERE discoveredBy = 'Karim'
        //return Planet.find(testCriteria, 'temperature position');     //Cet appel ne va retourner que le la temp et la position, mettre un '-temperature' retournerait tout SAUF la temp 

    }

    retrieveId(idPlanet){       //Aurait aussi pu êtyre fait avec retrieveByCriteria(), juste à créer un critère
        return Planet.findById(idPlanet);
    }

    transform(planet, transformationOptions = {}){      //Ajouter " = {}" donne une valeur par défaut à 
        if(transformationOptions){
            if(transformationOptions.unit === 'c')
            {
                planet.temperature = this.convertToCelsius(planet.temperature);
            }
        }

        //Changer le format de la date de découverte
        planet.discoveryDate = dayjs(planet.discoveryDate).format('YYYY-MM-DD');

        //Coordonees vitesse lumière
        //x en hexa @ y en hexa @ z en hexa
        planet.lightspeed = `${planet.position.x.toString(16)}@${planet.position.y.toString(16)}@${planet.position.z.toString(16)}`;

        //const nombreEntier = parseInt("ox7AD", 16)

        //Faire le ménage de la planète
        delete planet.__v;      //Retire la proptiété __v de l'objet
        //delete planet.position;

        return planet;
    }

    convertToCelsius(degreeKelvin){
        return degreeKelvin + ZERO_KELVIN;
    }

}





export default new PlanetsService();