import expressValidator from 'express-validator';
const { validationResult } = expressValidator;

export default (req, res, next) => {

    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();      //Continue vers la route
    }

    //Ici nous avons des erreurs de validation
    const extractedErrors = [];
    errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(422).json({ errors: extractedErrors });
}