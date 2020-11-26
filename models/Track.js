const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const TrackSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        required: true
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: "Album",
        required: true,
    },
    number: {
        type: Number,
        required: true,
        unique: true,
    },
    published: {
        type: Boolean,
        required: true,
        default: false,
    }
});

TrackSchema.pre('save', function (next) {
    Track.find({number : this.number}, function (err, docs) {
        if (!docs.length){
            next();
        }else{                
            next(new Error("Number exists!"));
        }
    });
}) ;

const Track = mongoose.model("Track", TrackSchema);
module.exports = Track;