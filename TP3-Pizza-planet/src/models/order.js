import mongoose from 'mongoose';
import { PIZZA_TOPPINGS, PIZZA_SIZES } from '../utils/constants.js';

const orderSchema = mongoose.Schema({

    pizzeria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pizzeria',
        required: true
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },
    orderDate: {
        type: Date,
        default: Date.now
    },
    pizzas: [{
        id: false,
        size: {
            type: String,
            required: true,
            enum: PIZZA_SIZES
        },
        price: {
            type: Number,
            required: true
        },
        topping: [{
            type: String,
            enum: PIZZA_TOPPINGS
        }]
    }]
}, {
    collection: 'orders',
    id: false
});

export default mongoose.model('Order', orderSchema);