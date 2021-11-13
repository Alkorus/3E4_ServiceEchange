import express from 'express';
import paginate from 'express-paginate';
import error from 'http-errors';

import ordersService from '../services/ordersService.js';

const router = express.Router({ mergeParams: true });     //S'assurer d'avoir accès aux paramètres lus par un routeur précédent
//const router = require('express').Router({mergeParams: true});

class ordersRoutes {

    constructor() {
        // Ajout des routes au router express
        router.get('/', paginate.middleware(10, 30), this.getAll);
        //router.get('/:idpizzeria/order/:idOrder', this.getOne);
        router.get('/:idOrder', this.getOne)
    }

    // ZALEC
    // Obtenir toutes les commandes
    async getAll(req, res, next) {
        const { limit, page } = req.query;

        const retrieveOptions = {
            limit,
            page,
            skip: req.skip
        }

        let queryFilter = {}

        // Si le paramètre topping est présent, l'ajoute au queryFilter
        if (req.query.topping)
            queryFilter = { 'pizzas.toppings': req.query.topping };

        try {
            const [orders, documentsCount] = await ordersService.retrieveAll(retrieveOptions, queryFilter);
            console.log("Count" + documentsCount);
            const pageCount = Math.ceil(documentsCount / limit);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, page);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            // Transformation des commandes
            const transformOrders = orders.map((c) => {
                c = c.toObject();
                c = ordersService.transform(c);
                return c;
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
                results: transformOrders,
            };

            console.log(pageCount);
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
            next(err);
        }
    }

    async getOne(req, res, next) {
        console.log('get one order test?')
        console.log('order:' + req.params.idOrder);
        console.log('pizzeria:' + req.params.idPizzeria);

        const idOrder = req.params.idOrder;
        const idPizzeria = req.params.idPizzeria;

        const options = {
            isCustomerEmbed: req.query.embed === 'customer'
        }

        try {
            let order = await ordersService.retrieveOne(idOrder, options);

            // Si aucune commande n'a été trouvée, retourne une erreur 404.
            if (!order)
                return next(error.NotFound(`La commande avec l'identifiant ${idOrder} est introuvable.`));

            if (order.pizzeria != idPizzeria)
                return next(error.NotFound(`Il n'y a pas de commande avec l'identifiant ${idOrder} à la pizzeria ${idPizzeria}.`));

            order = order.toObject({ virtuals: false });
            order = ordersService.transform(order, options);

            res.status(200).json(order);
        } catch (err) {
            return next(err);
        }
    }

}

new ordersRoutes();

export default router;