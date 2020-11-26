const router = require("express").Router();
const multer = require("multer");
const path = require("path");
const config = require("../config");
const Album = require("../models/Album");
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
        let query = {
            published: true
        };
        if (req.query.artist) {
            query = { ...query, artist: req.query.artist };
        };
        try {
            const albums = await Album.find(query).sort({ yearOfIssue: 1 });
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

    router.post("/", [auth, upload.single("image")], async (req, res) => {
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

    router.put("/:albumID", [auth, permit("admin")], async (req, res) => {
        const album = await Album.findById(req.params.albumID);
        if (album) {
            try {
                await album.updateOne({ published: true, });
                res.send({ message: "The Album was successfully published" });
            } catch (e) {
                res.status(400).send({ message: "Something went wrong" });
            };
        } else {
            res.status(400).send({ error: "The Album doesn't exist" });
        };
    });

    router.delete("/:albumID", [auth, permit("admin")], async (req, res) => {
        const album = await Album.findById(req.params.albumID);
        if (album) {
            try {
                await album.remove();
                res.send({ message: "The Album was successfully deleted" });
            } catch (e) {
                res.status(400).send({ message: "Something Went Wrong" });
            };
        } else {
            res.status(400).send({ error: "The Album doesn't exist" });
        };
    });
    return router;
};

module.exports = createRouter;