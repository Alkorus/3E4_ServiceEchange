import mongoose from 'mongoose';

const teamSchema = mongoose.Schema({
    planet: { type: String, require: true },
    players: [
        {
            name: { type: String, require: true },
            position: { type: String, require: true },
            rating: { type: Number, require: true },
            ancestor: {
                name: { type: String, require: true },
                asset: { type: String, require: true },
            },
            id:false

        },
    ],
    coach: {
        name: { type: String, require: true },
        experience:{type: Number, require:true, min:0},
        ancestor: {
            name: { type: String, require: true },
            asset: { type: String, require: true },
        },
    }
},
{
    collection: 'teams',
    id: false,
});

export default mongoose.model('Team', teamSchema);
