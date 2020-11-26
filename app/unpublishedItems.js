const router = require("express").Router();
const Album = require("../models/Album");
const Track = require("../models/Track");
const Artist = require("../models/Artist");
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");

router.get("/", [auth, permit("admin")], async (req, res) => {
    try {
        const unpublishedArtists = await Artist.find({ published: false });
        const unpublishedAlbum = await Album.find({ published: false });
        const unpublishedTrack = await Track.find({ published: false });
        const data = {
            unpublishedArtists: unpublishedArtists,
            unpublishedAlbum: unpublishedAlbum,
            unpublishedTrack: unpublishedTrack
        };
        res.send(data);
    } catch (e) {
        res.status(500).send(e);
    };
});

router.get("/artists", [auth, permit("admin")], async (req, res) => {
    try {
        const unpublishedArtists = await Artist.find();
        res.send(unpublishedArtists);
    } catch (e) {
        res.status(500).send(e);
    };
});

router.get("/artists/:id", [auth, permit("admin")], async (req, res) => {
    try {
        const unpublishedArtists = await Artist.findById(req.params.id);
        res.send(unpublishedArtists);
    } catch (e) {
        res.status(500).send(e);
    };
});

router.get("/albums", [auth, permit("admin")], async (req, res) => {
    let query;
    if (req.query.artist) {
        query = { artist: req.query.artist };
    };
    try {
        const albums = await Album.find(query).sort({ yearOfIssue: 1 });
        res.send(albums);
    } catch (e) {
        res.status(500).send(e);
    };
});

router.get("/albums/:id", [auth, permit("admin")], async (req, res) => {
    try {
        const albums = await Album.findById(req.params.id).populate("artist");
        res.send(albums);
    } catch (e) {
        res.status(500).send(e);
    };
});

router.get("/tracks/", [auth, permit("admin")], async (req, res) => {
    let query;
    if (req.query.album) {
        query = { album: req.query.album };
    };
    try {
        const tracks = await Track.find(query).sort({ number: 1 });
        res.send(tracks);
    } catch (e) {
        res.status(500).send(e);
    };
});

router.get("/tracks/:id", [auth, permit("admin")], async (req, res) => {
    try {
        const tracks = await Track.findById(req.params.id);
        res.send(tracks);
    } catch (e) {
        res.status(500).send(e);
    };
});

module.exports = router;