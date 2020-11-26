const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const config = require("../config");
const Artist = require("../models/Artist");
const { nanoid } = require("nanoid");
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");

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
            const artists = await Artist.find({ published: true });
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

    router.post("/", [auth, upload.single("image")], async (req, res) => {
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

    router.put("/:artistID", [auth, permit("admin")], async (req, res) => {
        const artist = await Artist.findById(req.params.artistID);
        if (artist) {
            try {
                await artist.updateOne({ published: true });
                res.send({ message: "The Artist was successfully published" });
            } catch (e) {
                res.status(400).send({ message: "Something Went Wrong" });
            };
        } else {
            res.status(400).send({ error: "The artist doesn't exist" });
        };
    });

    router.delete("/:artistID", [auth, permit("admin")], async (req, res) => {
        const artist = await Artist.findById(req.params.artistID);
        if (artist) {
            try {
                await artist.remove();
                res.send({ message: "The Artist was successfully deleted" });
            } catch (e) {
                res.status(400).send({ message: "Something Went Wrong" });
            };
        } else {
            res.status(400).send({ error: "The artist doesn't exist" });
        };
    });

    return router;
}



module.exports = createRouter;