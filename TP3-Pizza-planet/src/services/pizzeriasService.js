import Pizzeria from '../models/pizzeria.js';
import ordersService from '../services/ordersService.js';

class PizzeriasService {

    //Créer une nouvelle pizzerias dans la DB
    create(pizzeria) {
        return Pizzeria.create(pizzeria);
    }

    //Retourne toutes les pizzerias dont le chef a la spécialité recherchée, en ordre de nom de chef
    retrieveAll(retrieveOptions, criteria) {
        const retrievedQuery = Pizzeria.find(criteria).limit(retrieveOptions.limit)
            .skip(retrieveOptions.skip)
            .sort('chef.name');

        const countQuery = Pizzeria.countDocuments(criteria);
        return Promise.all([retrievedQuery, countQuery]);
    }

    // Retourne, si elle existe, la pizzeria correspondante au id passé en paramètre.
    retrieveOne(idPizzeria, options) {
        const pizzeria = Pizzeria.findById(idPizzeria);

        if (options.isOrdersEmbed)
            pizzeria.populate('orders');

        return pizzeria;
    }

    // Transforme la pizzeria donnée en paramètre et la retourne.
    transform(pizzeria, options = {}) {

        // Transforme les orders si elles ont été embed.
        if (options.isOrdersEmbed) {
            pizzeria.orders = pizzeria.orders.map(o => {
                o = ordersService.transform(o);
                return o;
            })
        }

        pizzeria.href = `${process.env.BASE_URL}/pizzerias/${pizzeria._id}`;
        pizzeria.lightspeed = `[${pizzeria.planet}]@(${pizzeria.coord.lat};${pizzeria.coord.lon})`;

        delete pizzeria._id;
        delete pizzeria.__v;

        return pizzeria;
    }
}

export default new PizzeriasService();