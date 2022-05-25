const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
    artist:{    
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Artist'
        },
        name: String
    },
    nameSong: String,
    imgSong: String,
    type: String,
    lyric: String,
    audio: String,
    fav: {type: Number, default: 0}
});

module.exports = mongoose.model('Song', songSchema);