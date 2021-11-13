import express from 'express';
import paginate from 'express-paginate';
import error from 'http-errors';

import pizzeriasService from '../services/pizzeriasService.js';
import ordersRoutes from './ordersRoutes.js';    //permettre de passer get one order
import pizzeriasRoutesValidators from '../validators/pizzeriasRoutesValidators.js';
import validator from '../utils/validator.js';

const router = express.Router();

class pizzeriasRoutes {

    constructor() {
        // Ajout des routes au router express
        router.get('/', paginate.middleware(25, 50), this.getAll);
        router.post('/', pizzeriasRoutesValidators.postValidator(), validator, this.post);
        router.get('/:idPizzeria', this.getOne);
        router.post('/', this.post);
        router.use('/:idPizzeria/orders', ordersRoutes) //Redirige une commande spécifique vers ordersRoutes
    }

    // Obtenir toutes les pizzerias
    async getAll(req, res, next) {

        let criteria = {};
        const option = {};

        if (req.query.speciality) {
            criteria = { 'chef.speciality': req.query.speciality };
        }

        const retrieveOptions = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip
        }

        //console.log(retrieveOptions);
        //console.log(criteria)

        try {
            const [pizzerias, documentsCount] = await pizzeriasService.retrieveAll(retrieveOptions, criteria);

            const pageCount = Math.ceil(documentsCount / req.query.limit);
            //const functionPages = paginate.getArrayPages(req); 
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page); //Tableau de liens vers les 3 pages
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            if (req.query.page > pageCount) {
                //console.log("bad request");
                return next(error.BadRequest());
            }

            const transformPizzeria = pizzerias.map(p => {
                p = p.toObject({ getters: false, virtuals: true });    //S'assurer que le vitrtual est ouvert?
                p = pizzeriasService.transform(p, option);
                return p;
            });

            let responseBody = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    totalPages: pageCount,
                    totalDocument: documentsCount,
                },
                _links: {},
                results: transformPizzeria,
            };
            //Gérer les cas ou il y a moins de 3 pages
            if (pageCount > 2) {
                responseBody._links.prev = `${process.env.BASE_URL}${pageArray[0].url}`;
                responseBody._links.self = `${process.env.BASE_URL}${pageArray[1].url}`;
                responseBody._links.next = `${process.env.BASE_URL}${pageArray[2].url}`;


                //Cas d'exception 1ère page
                if (req.query.page === 1) {
                    responseBody._links.next = responseBody._links.self;
                    responseBody._links.self = responseBody._links.prev;
                    delete responseBody._links.prev;

                }

                //Cas dernière page
                if (!hasNextPage) {
                    responseBody._links.prev = responseBody._links.self;
                    responseBody._links.self = responseBody._links.next;
                    delete responseBody._links.next;
                }
            } else {
                if (pageCount == 1) {

                    responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;

                } else {

                    if (!hasNextPage) {
                        responseBody._links.prev = `${process.env.BASE_URL}${pageArray[0].url}`;
                        responseBody._links.self = `${process.env.BASE_URL}${pageArray[1].url}`;
                    } else {
                        responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`;
                        responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`;
                    }
                }
            }

            res.status(200).json(responseBody);
        } catch (err) {
            return next(err);
        }
    }

    // Obtenir une pizzeria spécifique
    async getOne(req, res, next) {
        const idPizzeria = req.params.idPizzeria;

        const options = {
            isOrdersEmbed: req.query.embed === 'orders'
        }

        try {
            let pizzeria = await pizzeriasService.retrieveOne(idPizzeria, options);

            // Si aucune pizzeria n'a été trouvée, retourne une erreur 404.
            if (!pizzeria)
                return next(error.NotFound(`La pizzeria avec l'identifiant ${idPizzeria} est introuvable.`));

            pizzeria = pizzeria.toObject({ virtuals: true });
            pizzeria = pizzeriasService.transform(pizzeria, options);

            res.status(200).json(pizzeria);
        } catch (err) {
            return next(err);
        }
    }

    // ZALEC
    // Ajouter une pizzeria
    async post(req, res, next) {
        console.log('test post');
        console.log(req.body.name);

        try {
            const newPizzeria = req.body;

            let pizzeria = await pizzeriasService.create(newPizzeria);

            pizzeria = pizzeria.toObject({ getters: false, virtuals: false });
            pizzeria = pizzeriasService.transform(pizzeria);

            res.header('Location', pizzeria.href);
            if (req.query._body === 'false') {
                res.status(204).end();
            } else {
                res.status(201).json(pizzeria);
            }

        } catch (err) {
            return next(err);
        }
    }
}

new pizzeriasRoutes();

export default router;