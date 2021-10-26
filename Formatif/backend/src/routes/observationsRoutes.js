import express from 'express';
import paginate from 'express-paginate';
import httpErrors from 'http-errors';

import observationsService from './../services/observationsService.js';

const router = new express.Router();

class ObservationRoutes {
    constructor() {
        router.get('/', paginate.middleware(20, 40), this.getAll);
    }

    async getAll(req, res, next) {

        const options = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip,
        };

        if(req.query.humidity) {
            options.humidity = req.query.humidity;
        }

        const [observations, documentsCount] = await observationsService.retrieveAll(options);

        const pageCount = Math.ceil(documentsCount / req.query.limit);
        const functionPages = paginate.getArrayPages(req); //Retourne une fonction
        const pageArray = functionPages(3, pageCount, req.query.page); //Tableau de liens vers les 3 pages
        const hasNextPage = paginate.hasNextPages(req)(pageCount);
        
        
        try {

            //TODO[2c] : Transformer l'ensemble observations vous devez modifier la ligne 37
            const transformObservations = observations.map(o => {
                o = o.toObject({getter:false, virtual:false});
                o = observationsService.transform(o);
                return o;
            });

            const responseBody = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    totalPages: pageCount,
                    totalDocument: documentsCount,
                },
                _links: {
                    prev: pageArray[0] ? `${process.env.BASE_URL}${pageArray[0].url}` : '',
                    self: pageArray[1] ? `${process.env.BASE_URL}${pageArray[1].url}` : '',
                    next: pageArray[2] ? `${process.env.BASE_URL}${pageArray[2].url}` : '',
                },
                results: transformObservations,
            };
            //Cas d'exception 1ère page
            if (req.query.page === 1) {
                responseBody._links.next = responseBody._links.self;
                responseBody._links.self = responseBody._links.prev;
                delete responseBody._links.prev;
            }

            //Cas de la dernière page
            if (!hasNextPage) {
                responseBody._links.prev = responseBody._links.self;
                responseBody._links.self = responseBody._links.next;
                delete responseBody._links.next;
            }

            res.status(200).json(responseBody);

        } catch(err) {
            return next(err);
        }

    }

    
}

new ObservationRoutes();

export default router;
