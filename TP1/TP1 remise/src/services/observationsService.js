import dayjs from 'dayjs';

import Observation from '../models/observations.js';

const ZERO_KELVIN = -273.15;
const ZERO_FARENHEIT = 32;
const CF_VARIATION = 9/5;

class observationsService{
    
    //Créer une nouvelle observation dasn la base de données
    create(observation){
        return Observation.create(observation);
    }

    //Trouver toutes les observations effectuées à une certaine station
    retrieveByStationName(location){
        const station = {'location.station':location};
        return Observation.find(station);       
    }

    //Utiliser l'ID d'une observation pour la récupérer dans la BD
    retrieveId(idObservation){
        return Observation.findById(idObservation);
    }

    //Transformer l'objet pour l'envoyer sous forme de réponse
    transform(observation, transformationOptions = {}){

        const WINDDIRECTION = observation.wind.degree / 45;
        
        //Appliquer la transformation d'unité de température
        if(transformationOptions){
            switch(transformationOptions.unit)
            {
                case 's':
                    observation.temperature = this.convertToKelvin(observation.temperature);
                    observation.feelslike = this.convertToKelvin(observation.feelslike);
                    break;
                case 'f':
                    observation.temperature = this.convertToFarenheit(observation.temperature);
                    observation.feelslike = this.convertToFarenheit(observation.feelslike);
                    break;
                default:
                    break;
            }
        }

        //Ajouter la dirrection du vent
        if(WINDDIRECTION < 1) observation.wind.direction = "N";
        else{
            if(WINDDIRECTION < 2) observation.wind.direction = "NE";
            else{
                if(WINDDIRECTION < 3) observation.wind.direction = "E";
                else{
                    if(WINDDIRECTION < 4) observation.wind.direction = "SE";
                    else{
                        if(WINDDIRECTION < 5) observation.wind.direction = "S";
                        else{
                            if(WINDDIRECTION < 6) observation.wind.direction = "SW";
                            else{
                                if(WINDDIRECTION < 7) observation.wind.direction = "W";
                                else observation.wind.direction = "NW"; 
                            }
                        }
                    }
                }
            }
        }

        //Calculer la position hexadécimale
        observation.hex = {
            alpha: 0,
            beta:1
        };
        observation.hexMatrix.forEach(hex => { 
            observation.hex.alpha += parseInt(hex, 16);
            observation.hex.beta *= parseInt(hex, 16);
        });
        observation.hex.gamma = observation.hex.beta/observation.hex.alpha;
        observation.hex.delta = observation.hex.beta%observation.hex.alpha;
        
        //Faire le ménage de l'observation'
        delete observation.__v;      
        delete observation.hexMatrix;

        return observation;
    }

    //Transformer des degrés Celsius en degrés Kelvin
    convertToKelvin(degreeCelsius){
        return degreeCelsius - ZERO_KELVIN;
    }

    //Transformer des degrés Celsius en Farenheit
    convertToFarenheit(degreeCelsius){
        return degreeCelsius*CF_VARIATION + ZERO_FARENHEIT;
    }

}





export default new observationsService();