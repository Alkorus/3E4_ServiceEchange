import Order from '../models/order.js';
import customersService from './customersService.js';

class OrdersService {

    // Retourne, si elle existe, la commande correspondante au id passé en paramètre.
    retrieveOne(idOrder, options) {
        const order = Order.findById(idOrder);
        //
        if (options.isCustomerEmbed)
            order.populate('customer');
        return order;
    }

    // Retourne tout les commandes correspondants au paramètres donnés. 
    retrieveAll(retrieveOptions, queryFilter) {

        const retrieveQuery = Order.find(queryFilter).limit(retrieveOptions.limit)
            .skip(retrieveOptions.skip)
            .sort("-orderDate");

        const countQuery = Order.countDocuments(queryFilter);
        return Promise.all([retrieveQuery, countQuery]);
    }

    transform(order, options = {}) {
        const taxeRates = 0.0087;
        let subTotal = 0;
        order.pizzas.forEach(p => {
            subTotal += p.price
        });
        let taxes = subTotal * taxeRates;
        let total = subTotal + taxes;
        console.log(subTotal);
        order.subTotal = subTotal.toFixed(3);
        order.taxeRates = taxeRates;
        order.taxes = taxes.toFixed(3);
        order.total = total.toFixed(3);

        order.pizzeria = { href: `${process.env.BASE_URL}/pizzerias/${order.pizzeria}` };

        if (options.isCustomerEmbed) {
            order.customer = customersService.transform(order.customer);
        } else {
            order.customer = { href: `${process.env.BASE_URL}/customers/${order.customer}` };
        }

        order.href = `${process.env.BASE_URL}/orders/${order._id}`;
        delete order._id;

        return order;
    }

}

export default new OrdersService();