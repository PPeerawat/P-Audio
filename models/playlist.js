const mongoose = require("mongoose");

const playlistSchema = new mongoose.Schema({
    namePlaylist: String,
    imgPlaylist: String,
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Song'
        }
    ],
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }
    
});

module.exports = mongoose.model('Playlist', playlistSchema);