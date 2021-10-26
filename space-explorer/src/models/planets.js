import mongoose from 'mongoose';


//Définition des données/propriétés d'une planète

const planetSchema = mongoose.Schema({
    name:{type:String, unique: true},
    discoveredBy: {type:String, index: true},      //Les '' de chaque côté du nom de la propriété pour ne pas que ça bogue avec le "-"
    discoveryDate: Date,
    temperature: Number,
    satellite: [String],
    position: {
        x: {type: Number, min:-1000, max: 1000},
        y: {type: Number, min:-1000, max: 1000},
        z: {type: Number, min:-1000, max: 1000}
    }
},{
    collection:'planets'
})

export default mongoose.model('Planet', planetSchema);