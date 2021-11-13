import expressValidator from 'express-validator';

import { PLANET_NAMES } from '../utils/constants.js';

const { body } = expressValidator;

class customersRoutesValidators {

    putValidator() {
        return [
            body('name').exists().withMessage('Le nom du client est obligatoire'),
            body('email').exists().withMessage('L\'adresse email du client est obligatoire')
                .isEmail().withMessage('L\'adresse email du client est invalide'),
            body('planet').exists().withMessage('La planète est requise')
                .isIn(PLANET_NAMES).withMessage('Le nom de la planète n\'est pas dans la liste des noms autorisés.'),
            body('coord.lat').exists().withMessage('La latitude est obligatoire')
                .isFloat({ min: -1000, max: 1000 }).withMessage('La latitude est invalide'),
            body('coord.lon').exists().withMessage('La longitude est obligatoire')
                .isFloat({ min: -1000, max: 1000 }).withMessage('La longitude est invalide'),
            body('phone').exists().withMessage('Le téléphone du client est obligatoire')
                .isHexadecimal().withMessage('Le téléphone du client doit être en format hexadécimal')
                .isLength({ min: 16, max: 16 }).withMessage('Le téléphone du client doit être d\'une longueur de 16 caractères'),
            body('birthday').exists().withMessage('L\'anniversaire du client est obligatoire')
                .isDate().withMessage('Le format de la date d\'anniversaire du client n\'est pas valide')
        ];
    }
}

export default new customersRoutesValidators();