import expressValidator from 'express-validator';

import { PLANET_NAMES, MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../utils/constants.js';

const { body } = expressValidator;

class pizzeriasRoutesValidators {

    postValidator() {
        return [
            body('chef.name').exists().withMessage('Le nom du chef est obligatoire'),
            body('chef.ancestor').exists().withMessage('L\'ancêtre est obligatoire')
                .isIn(MONSTER_ANCESTORS).withMessage('L\'ancêtres est invalide'),
            body('chef.speciality').exists().withMessage('La spécialité est obligatoire')
                .isIn(PIZZA_TOPPINGS).withMessage('La spécialité est invalide'),
            body('planet').exists().withMessage('La planète est obligatoire')
                .isIn(PLANET_NAMES).withMessage('Le nom de la planète n\'est pas dans la liste des noms autorisés.'),
            body('coord.lat').exists().withMessage('La latitude est obligatoire')
                .isFloat({ min: -1000, max: 1000 }).withMessage('La latitude est invalide'),
            body('coord.lon').exists().withMessage('La longitude est obligatoire')
                .isFloat({ min: -1000, max: 1000 }).withMessage('La longitude est invalide'),
        ];
    }
}

export default new pizzeriasRoutesValidators();