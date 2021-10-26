import mongoose from 'mongoose';


//Définition des données/propriétés d'une planète

const stationSchema = mongoose.Schema({
    location:{
        station: {type: String, index: true, uppercase: true},
        coord: {
            lon: Number,
            lat: Number
        }
    },
    temperature: Number,
    pressure: Number,
    humidity: Number,
    feelslike: Number,
    uvIndex: {type: Number, min: 0, max: 11},
    wind: {
        speed: Number,
        degree: {type: Number, min: 0, max: 360}
    },
    clouds: {
        cloudcover: {type: Number, min: 0, max: 1}
    },
    observationDate: Date,
    hexMatrix: [String]

},{
    collection:'stations'
})

export default mongoose.model('Observation', stationSchema);