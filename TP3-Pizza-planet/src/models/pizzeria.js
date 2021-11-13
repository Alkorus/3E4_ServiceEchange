import mongoose from 'mongoose';
import { PLANET_NAMES, MONSTER_ANCESTORS, PIZZA_TOPPINGS } from '../utils/constants.js';

const pizzeriaSchema = mongoose.Schema({

    planet: {
        type: String,
        required: true,
        enum: PLANET_NAMES
    },
    coord: {
        lat: {
            type: Number,
            required: true,
            min: -1000,
            max: 1000
        },
        lon: {
            type: Number,
            required: true,
            min: -1000,
            max: 1000
        }
    },
    chef: {
        name: {
            type: String,
            required: true
        },
        ancestor: {
            type: String,
            required: true,
            enum: MONSTER_ANCESTORS
        },
        speciality: {
            type: String,
            required: true,
            enum: PIZZA_TOPPINGS
        }
    }
    //http://localhost:7187/pizzerias?specialty=Salami
    //http://localhost:7187/pizzerias?speciality=Lemon

}, {
    collection: 'pizzerias',
    id: false
});

pizzeriaSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'pizzeria',
    justOne: false
})

export default mongoose.model('Pizzeria', pizzeriaSchema);