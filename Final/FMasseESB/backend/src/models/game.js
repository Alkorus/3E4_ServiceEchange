import mongoose from 'mongoose';

const gameSchema = mongoose.Schema({
    gameDate: { type: Date, require: true },
    home: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        require: true,
    },
    away: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        require: true,
    },
    referee:{ 
        name:{ type: String, require: true },
        ancestor: { 
            name:{ type: String, require: true }, 
            asset:{ type: String, require: true } 
        }
    },
    score: {
        home: { type: Number, default: 0 },
        away: { type: Number, default: 0 },
    },
},
{
    collection: 'games', id:false
});

export default mongoose.model('Game', gameSchema);
