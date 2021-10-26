import mongoose from 'mongoose';

const observationSchema = mongoose.Schema({
    location: {
        station:{ type:String, index:true, uppercase:true },
        coord: {
            lon:Number,
            lat:Number
        }
    },
    planet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Planet',
        required: true,
    },
    observationDate:{ type:Date, default:Date.now },
    temperature: Number,
    humidity:Number,
    feelslike:Number,
    pressure:Number,
    uvIndex:{ type:Number, min:0, max:11 },
    clouds: {
        cloudcover:{ type:Number, min:0, max:1 }
    }
    
},{
    collection:'observations'
});

export default mongoose.model('Observation', observationSchema);