import expressValidator from 'express-validator';

const { body } = expressValidator;      //Va extraire la fcn body() du module express-validator

class PlanetRoutesValidators {

    //https://github.com/validatorjs/validator.js#validators
    //https://express-validator.github.io/docs/index.html  
    putValidator(){
        return[
            body('name').exists().notEmpty().withMessage('Le nom de la planète est obligatoire')

        ];

    }


    

}

export default new PlanetRoutesValidators