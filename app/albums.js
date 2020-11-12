const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const config = require("../config");
const Album = require("../models/Albums");
const Artist = require("../models/Artists");
const { nanoid } = require("nanoid");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, nanoid() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

const createRouter = () => {
    router.get("/", async (req, res) => {
        let query;
        if (req.query.artist) {
            query = { artist: req.query.artist };
        };
        try {
            const albums = await Album.find(query).sort({yearOfIssue: 1});
            res.send(albums);
        } catch (e) {
            res.status(500).send(e);
        };
    });

    router.get("/:id", async (req, res) => {
        try {
            const albums = await Album.findById(req.params.id).populate("artist");
            res.send(albums);
        } catch (e) {
            res.status(500).send(e);
        };
    });

    router.post("/", upload.single("image"), async (req, res) => {
        const albumsData = req.body;
        if (req.file) {
            albumsData.image = req.file.filename;
        };
        const artist = Artist.findById(req.body.artist);
        if (!artist) {
            return res.status(400).send('Artist does not exist');
        } else {
            const album = new Album(albumsData);
            try {
                await album.save();
                res.send(album);
            } catch (e) {
                res.status(400).send(e);
            };
        }

    });
    return router;
};

module.exports = createRouter;