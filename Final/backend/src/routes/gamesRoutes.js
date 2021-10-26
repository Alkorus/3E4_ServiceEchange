import express from 'express';
import paginate from 'express-paginate';

import gamesService from '../services/gamesService.js';

const router = new express.Router();

class GamesRoutes {

    constructor() {
        router.get('/', paginate.middleware(20, 40), this.getAll);
        router.get('/:idGame',this.getOne);
    }

    async getAll(req, res, next) {

        const options = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip,
        };
        
        try {
            
            const [games, documentsCount] = await gamesService.retrieveAll(options);

            const pageCount = Math.ceil(documentsCount / req.query.limit);
            const functionPages = paginate.getArrayPages(req); //Retourne une fonction
            const pageArray = functionPages(3, pageCount, req.query.page); //Tableau de liens vers les 3 pages
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            //TODO[2b] Développer le code pour transformer l'ensemble des parties
            const transformGames = games.map((r) => {
                r = r.toObject();
                r = gamesService.transform(r);
                return r;
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
                results: transformGames,
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

    async getOne(req, res, next) {
        try {
            let game = await gamesService.retrieveOne(req.params.idGame);

            game = game.toObject({virtuals:true});
            game = gamesService.transform(game);

            if(!game){
                return next(httpErrors.NotFound(`La partie avec l'identifiant ${req.params.idTeam} n'existe pas.`));
            }

            res.status(200).json(game);
        } catch(err) {
            return next(err);
        }
    }

}

new GamesRoutes();

export default router;