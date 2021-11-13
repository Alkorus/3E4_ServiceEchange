import mongoose from 'mongoose';
import { PLANET_NAMES } from '../utils/constants.js';

const customerSchema = mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
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
    phone: {
        type: String,
        match: /[0-9a-fA-F]{16}/i // 16 caractères hexadécimaux
    },
    birthday: {
        type: Date,
        required: true
    },
    referalCode: String
}, {
    collection: 'customers',
    id: false
});

//Ajouté le lien virtuel entre le client et ses commandes -FM 06-12
customerSchema.virtual('orders', {
    ref: 'Order',
    localField: '_id',
    foreignField: 'customer',
    justOne: false
})

export default mongoose.model('Customer', customerSchema);