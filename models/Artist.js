const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
    }
});

const Artist = mongoose.model("Artist", ArtistSchema);
module.exports = Artist;