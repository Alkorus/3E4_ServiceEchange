import express  from 'express';
import paginate from 'express-paginate';
import httpError from 'http-errors';

import explorationsService from '../services/explorationsService.js';

const router = express.Router(); 

class ExplorationsRoutes {
    
    constructor() {
        router.get('/', paginate.middleware(20, 50), this.getAll);
        router.get('/:explorationId', this.getOne);
    }

    async getAll(req, res, next) {

        const options = {
            isPlanetEmbed : false
        }

        const retrieveOptions = {
            limit: req.query.limit,
            page: req.query.page,
            skip: req.skip
        };

        if(req.query.embed === 'planet'){
            options.isPlanetEmbed = true;
        }

        //console.log(retrieveOptions);

        try{
            const [explorations, documentCount] = await explorationsService.retrieveAll(retrieveOptions, options); 

            const pageCount = Math.ceil(documentCount / req.query.limit);
            const pageArray = paginate.getArrayPages(req)(3, pageCount, req.query.page);        //Le section qui arrête à la 1re () retourne une fonction qui est appelée par la 2e ()
                                                                                                //Génère un tableau de lien vers les 3 pages
            const hasNextPage = paginate.hasNextPages(req)(pageCount);

            if(req.query.page > pageCount){         //On ne peut pas tester si on demande des pages négatives à cause du middleware
                return next(httpError.BadRequest());
            }

            //Transformation
            //1 ou pusieurs explorations à transformer
            const rtansformedExlorations = explorations.map(e => {
                e = e.toObject({getters:false, vistuals:false});
                e = explorationsService.transform(e, options);

                return e;
            });

            //TODO: Est-ce que la planète doit être populée?
            //TODO: ?embed=planet

            

            //console.log(pageArray);

            const responseBody = {
                _metadata: {
                    hasNextPage: hasNextPage,
                    page: req.query.page,
                    limit: req.query.limit,
                    totalDocument: documentCount,
                    totalPages: pageCount
                },
                _links:{
                    prev: `${process.env.BASE_URL}${pageArray[0].url}`,
                    self: `${process.env.BASE_URL}${pageArray[1].url}`,
                    next: `${process.env.BASE_URL}${pageArray[2].url}`
                },
                results: rtansformedExlorations
            }

            //Cas d'exception 1re page
            if(req.query.page === 1){
                /*delete responseBody._links.prev;
                responseBody._links.self = `${process.env.BASE_URL}${pageArray[0].url}`
                responseBody._links.next = `${process.env.BASE_URL}${pageArray[1].url}`*/
                responseBody._links.next = responseBody._links.self;        //Deux méthodes, même résultat, lordre dans la 2e méthode est important
                responseBody._links.self = responseBody._links.prev;
                delete responseBody._links.prev;
            }

            //Cas d'exception dernière page
            if(!hasNextPage){
                responseBody._links.prev = responseBody._links.self;
                responseBody._links.self = responseBody._links.next;
                delete responseBody._links.next;
            }

            res.status(200).json(responseBody);

        }catch(err){
            return next(err);
        }
    }

    getOne(req, res, next) {

    }

}

new ExplorationsRoutes();

export default router;