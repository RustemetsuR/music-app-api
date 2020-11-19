const mongoose = require("mongoose");
const config = require("./config");
const User = require("./models/User");
const Track = require("./models/Track");
const Album = require("./models/Album");
const Artist = require("./models/Artist");
const TrackHistory = require("./models/TrackHistory");
const { nanoid } = require("nanoid");

mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true , useUnifiedTopology: true});

const db = mongoose.connection;

db.once("open", async () => {
    try {
        await db.dropCollection("albums");
        await db.dropCollection("artists");
        await db.dropCollection("tracks");
        await db.dropCollection("trackhistories");
        await db.dropCollection("users");
    } catch (e) {
        console.log("Collection were not presented, skipping drop...");
    };

    const [brunoM, michaelJ] = await Artist.create({
        name: "Bruno Mars",
        description: "Bla-Bla-Bla",
        image: "bruno-mars.jpg"
    }, {
        name: "Michael Jackson",
        description: "Bla-Bla-Bla",
        image: "michael-jackson.jpeg",
    });

    const [brunoAlbum, michaelAlbum] = await Album.create({
        name: "It's Better If You Don't Understand",
        yearOfIssue: 2010,
        artist: brunoM._id,
        image: "its-better-if-you-dont-know.jpg"
    }, {
        name: "Thriller",
        yearOfIssue: 1982,
        artist: michaelJ._id,
        image: "thriller.jpg"
    });

    const tracks = await Track.create({
        name: "Somewhere in Brooklyn",
        duration: "3:01",
        album: brunoAlbum._id,
        number: 1,
    }, {
        name: "The Other Side",
        duration: "3:48",
        album: brunoAlbum._id,
        number: 2,
    }, {
        name: "Wanna Be Startin’ Somethin’",
        duration: "6:03",
        album: michaelAlbum._id,
        number: 3,
    }, {
        name: "Baby Be Mine",
        duration: "4:20",
        album: michaelAlbum._id,
        number: 4,
    });

    const user = await User.create({
        username: 'asd',
        password: 'asd',
        token: nanoid(),
    });

    await TrackHistory.create({
        user: user._id,
        track: tracks[0]._id,
        dateTime: new Date().toISOString(),
    }, {
        user: user._id,
        track: tracks[1]._id,
        dateTime: new Date().toISOString(),
    }, {
        user: user._id,
        track: tracks[2]._id,
        dateTime: new Date().toISOString(),
    }, {
        user: user._id,
        track: tracks[3]._id,
        dateTime: new Date().toISOString(),
    });

    db.close();
});