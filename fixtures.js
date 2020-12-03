const mongoose = require("mongoose");
const config = require("./config");
const User = require("./models/User");
const Track = require("./models/Track");
const Album = require("./models/Album");
const Artist = require("./models/Artist");
const TrackHistory = require("./models/TrackHistory");
const { nanoid } = require("nanoid");

mongoose.connect(config.db.url + '/' + config.db.name, { useNewUrlParser: true, useUnifiedTopology: true });

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

    const [brunoM, michaelJ, shakira] = await Artist.create({
        name: "Bruno Mars",
        description: "Bla-Bla-Bla",
        image: "bruno-mars.jpg",
        published: true,
    }, {
        name: "Michael Jackson",
        description: "Bla-Bla-Bla",
        image: "michael-jackson.jpeg",
        published: true,
    }, {
        name: "Shakira Isabel",
        description: "Bla-Bla-Bla",
        image: "shakira.jpg",
        published: false,
    });

    const [brunoAlbum, michaelAlbum, shakiraAlbum] = await Album.create({
        name: "It's Better If You Don't Understand",
        yearOfIssue: 2010,
        artist: brunoM._id,
        image: "its-better-if-you-dont-know.jpg",
        published: true,
    }, {
        name: "Thriller",
        yearOfIssue: 1982,
        artist: michaelJ._id,
        image: "thriller.jpg",
        published: true,
    }, {
        name: "El Dorado",
        yearOfIssue: 2017,
        artist: shakira._id,
        image: "eldorado.jpg",
        published: false,
    });

    const tracks = await Track.create({
        name: "Somewhere in Brooklyn",
        duration: "3:01",
        album: brunoAlbum._id,
        published: true,
        number: 1,
    }, {
        name: "The Other Side",
        duration: "3:48",
        album: brunoAlbum._id,
        published: true,
        number: 2,
    }, {
        name: "Wanna Be Startin’ Somethin’",
        duration: "6:03",
        album: michaelAlbum._id,
        published: true,
        number: 3,
    }, {
        name: "Baby Be Mine",
        duration: "4:20",
        album: michaelAlbum._id,
        published: true,
        number: 4,
    }, {
        name: "Me Enamoré",
        duration: "3:49",
        album: shakiraAlbum._id,
        published: false,
        number: 101,
    }, {
        name: "Nada",
        duration: "3:11",
        album: shakiraAlbum._id,
        published: false,
        number: 102,
    });

  
    const [user, admin] = await User.create(
        {
            username: 'public-user@user.com',
            password: 'user123',
            token: nanoid(),
            role: 'user',
            displayName: 'Valera',
            avatarImage: "https://www.shareicon.net/data/512x512/2016/05/24/770117_people_512x512.png"
        },
        {
            username: 'admin@admin.com',
            password: 'admin123',
            token: nanoid(),
            role: 'admin',
            displayName: 'Dmitrii',
            avatarImage: "https://i.pinimg.com/736x/34/60/3c/34603ce8a80b1ce9a768cad7ebf63c56.jpg"
        }
    );

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
        user: admin._id,
        track: tracks[3]._id,
        dateTime: new Date().toISOString(),
    });

    db.close();
});