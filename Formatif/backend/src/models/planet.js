import mongoose from 'mongoose';

const planetSchema = mongoose.Schema({
    name: { type: String, unique: true },
    discoveredBy: { type: String, index: true },
    discoveryDate: Date,
    temperature: Number,
    satellites: [String],
    position: {
        x: { type: Number, min: -1000, max: 1000 },
        y: { type: Number, min: -1000, max: 1000 },
        z: { type: Number, min: -1000, max: 1000 }
    }
}, {
    collection: 'planets',
});


//[1b] : Ajouter le virtual sur le schema de la planète donnant accès aux observations de la planète ça devrait commencer par quelque chose du genre planetSchema.virtual()
planetSchema.virtual('observations', {
    ref: 'Observation',
    localField: '_id',
    foreignField: 'planet',
    justOne: false
})


export default mongoose.model('Planet', planetSchema);