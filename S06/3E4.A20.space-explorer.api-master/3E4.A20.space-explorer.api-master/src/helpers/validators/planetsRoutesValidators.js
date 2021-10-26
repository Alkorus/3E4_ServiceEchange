import expressValidator from 'express-validator';

const { body } = expressValidator;      //Va extraire la fcn body() du module express-validator

class PlanetRoutesValidators {

    //https://github.com/validatorjs/validator.js#validators
    //https://express-validator.github.io/docs/index.html  
    putValidator(){
        return[
            body('name').exists().withMessage('Le nom de la planète est obligatoire'),
            body('discoveredBy').exists().withMessage('Le nom du découvreur est obligatoire'),
            body('discoveryDate').exists().isDate().isBefore().withMessage('La date de découverte est obligatoire'),
            body('temperature').exists().withMessage('La température est obligatoire'),
            body('temperature').isNumeric().withMessage('La température doit être numérique'),
            body('satellites').exists().isArray(),
            body('position.x').exists().isFloat({min:-1000,max:1000}),
            body('position.y').exists().isFloat({min:-1000,max:1000}),
            body('position.z').exists().isFloat({min:-1000,max:1000})
        ];

    }


    

}

export default new PlanetRoutesValidators