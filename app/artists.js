const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const config = require("../config");
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
        try {
            const artists = await Artist.find();
            res.send(artists);
        } catch (e) {
            res.status(500).send(e);
        };
    });

    router.get("/:id", async (req, res) => {
        try {
            const artist = await Artist.findById(req.params.id);
            res.send(artist);
        } catch (e) {
            res.status(500).send(e);
        };
    });

    router.post("/", upload.single("image"), async (req, res) => {
        const artistData = req.body;
        if (req.file) {
            artistData.image = req.file.filename;
        };
        const artist = new Artist(artistData);
        try {
            await artist.save();
            res.send(artist);
        } catch (e) {
            res.status(400).send(e);
        };
    });
    return router;
}



module.exports = createRouter;