import Customer from '../models/customer.js';

import daysjs from 'dayjs';
import ordersService from './ordersService.js';

class CustomersService {

    // Modifie le client avec l'id correspondant avec les données fournies en paramètre.
    update(idCustomer, customer) {
        return Customer.findByIdAndUpdate(idCustomer, customer, { new: true });
    }

    // Retourne tout les clients correspondants au paramètres donnés. 
    retrieveAll(retrieveOptions, queryFilter) {
        const retrieveQuery = Customer.find(queryFilter).limit(retrieveOptions.limit)
            .sort('birthday')
            .skip(retrieveOptions.skip)

        const countQuery = Customer.countDocuments(queryFilter);

        return Promise.all([retrieveQuery, countQuery]);
    }

    // Retourne, si elle existe, la commande correspondante au id passé en paramètre.
    retrieveOne(idCustomer, options) {
        const customer = Customer.findById(idCustomer);
        if (options.isOrdersEmbed)
            customer.populate('orders');
        return customer;
    }

    //Créer un nouveau client dans la DB
    create(customer) {
        return Customer.create(customer);
    }

    // Transforme un client passé en paramètre et le retourne.
    transform(customer, options = {}) {
        customer.href = `${process.env.BASE_URL}/customers/${customer._id}`;
        customer.phone = `[${customer.phone.slice(0, 4)}]${customer.phone.slice(4, 8)}-${customer.phone.slice(8, 14)}@${customer.phone.slice(14, 16)}`;
        const now = daysjs();
        customer.age = now.diff(customer.birthday, 'year');
        customer.lightspeed = `[${customer.planet}]@(${customer.coord.lat};${customer.coord.lon})`;

        if (options.isOrdersEmbed) {
            customer.orders = customer.orders.map(o => {
                o = ordersService.transform(o);
                return o;
            });
        }

        delete customer._id;

        return customer;
    }
}

export default new CustomersService();