const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    yearOfIssue: {
        type: Number,
        required: true
    },
    artist: {
        type: Schema.Types.ObjectId,
        ref: "Artist",
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
    }
});

const Album = mongoose.model("Album", AlbumSchema);
module.exports = Album;