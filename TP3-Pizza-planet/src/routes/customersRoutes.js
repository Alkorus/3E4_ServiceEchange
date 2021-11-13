import express from 'express';
import paginate from 'express-paginate';
import error from 'http-errors';

import customersService from '../services/customersService.js';
import customersRoutesValidators from '../validators/customersRoutesValidators.js';
import validator from '../utils/validator.js';

const router = express.Router();

class customersRoutes {

    constructor() {
        // Ajout des routes au router express
        router.post('/', customersRoutesValidators.putValidator(), validator, this.post);
        //router.post('/', this.post);
        router.put('/:idCustomer', customersRoutesValidators.putValidator(), validator, this.put);
        router.get('/', paginate.middleware(20, 40), this.getAll);
        router.get('/:idCustomer', this.getOne);
    }

    // Ajouter un client
    async post(req, res, next) {
        console.log('test post');
        console.log(req.body.name);

        try {
            const newCustomer = req.body;

            let customer = await customersService.create(newCustomer);
            console.log(customer.name);

            customer = customer.toObject({ getters: false, virtuals: false });
            customer = customersService.transform(customer);

            res.header('Location', customer.href);
            if (req.query._body === 'false') {
                res.status(204).end();
            } else {
                res.status(200).json(customer);
            }

        } catch (err) {
            return next(err);
        }
    }

    // Mise à jour complète d'un client
    async put(req, res, next) {
        const idCustomer = req.params.idCustomer;

        const responseOptions = {
            _body: !(req.query._body === 'false') // false = false, true = true, valeur pas défaut = true
        }

        try {
            let customerMod = await customersService.update(idCustomer, req.body);

            // Si aucun client n'a été trouvée, retourne une erreur 404.
            if (!customerMod)
                return next(error.NotFound(`Le client avec l\'identifiant ${idCustomer} est introuvable.`));

            customerMod = customerMod.toObject();
            customerMod = customersService.transform(customerMod);

            // Envoi de la réponse sans body si le paramètre _body est à false 
            if (!responseOptions._body)
                return res.status(204).end();


            res.status(201).json(customerMod);
        } catch (err) {
            next(err);
        }
    }

    // Obtenir tout les clients
    async getAll(req, res, next) {
        const { limit, page } = req.query;

        const retrieveOptions = {
            limit,
            page,
            skip: req.skip
        }

        const queryFilter = {}

        // Si le paramètre planet est présent, l'ajoute au queryFilter
        if (req.query.planet)
            queryFilter.planet = req.query.planet;

        try {
            const [customers, documentsCount] = await customersService.retrieveAll(retrieveOptions, queryFilter);

            const pageCount = Math.ceil(documentsCount / limit);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, page);
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            if (req.query.page > pageCount) {
                return next(error.BadRequest());
            }

            // Transformation des clients
            const transformCustomers = customers.map((c) => {
                c = c.toObject();
                c = customersService.transform(c);
                return c;
            });

            // Construction du corps de la réponse
            const responseBody = {
                _metadata: {
                    hasNextPage,
                    page,
                    limit,
                    totalPages: pageCount,
                    totalDocument: documentsCount
                },
                _links: {
                    prev: `${process.env.BASE_URL}${pageArray[0].url}`,
                    self: `${process.env.BASE_URL}${pageArray[1].url}`,
                    next: `${process.env.BASE_URL}${pageArray[2].url}`
                },
                results: transformCustomers
            }

            // Cas d'exception pour la première page
            if (page === 1) {
                responseBody._links.next = responseBody._links.self;
                responseBody._links.self = responseBody._links.prev;
                delete responseBody._links.prev;
            }

            // Cas d'exception pour la dernière page
            if (!hasNextPage) {
                responseBody._links.prev = responseBody._links.self;
                responseBody._links.self = responseBody._links.next;
                delete responseBody._links.next;
            }

            res.status(200).json(responseBody);
        } catch (err) {
            next(err);
        }
    }


    // ZALEC
    // Obtenir un client spécifique
    async getOne(req, res, next) {
        const idClient = req.params.idCustomer;

        const options = {
            isOrdersEmbed: req.query.embed === 'orders'
        }

        try {
            let client = await customersService.retrieveOne(idClient, options);

            // Si aucun client correspondent n'a été trouvée, retourne une erreur 404.
            if (!client) {
                return next(error.NotFound(`Le client avec l'identifiant ${idClient} est introuvable.`));
            }

            client = client.toObject({ virtuals: true });
            client = customersService.transform(client, options);

            res.status(200).json(client);
        } catch (err) {
            return next(err);
        }
    }
}

new customersRoutes();

export default router;