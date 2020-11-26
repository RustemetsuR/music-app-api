const router = require("express").Router();
const auth = require("../middleware/auth");
const permit = require("../middleware/permit");
const Album = require("../models/Album");
const Track = require("../models/Track");

const createRouter = () => {
    router.get("/", async (req, res) => {
        let query = {
            published: true
        };
        if (req.query.album) {
            query = {...query, album: req.query.album };
        };
        try {
            const tracks = await Track.find(query).sort({ number: 1 });
            res.send(tracks);
        } catch (e) {
            res.status(500).send(e);
        };
    });

    router.get("/:id", async (req, res) => {
        try {
            const tracks = await Track.findById(req.params.id);
            res.send(tracks);
        } catch (e) {
            res.status(500).send(e);
        };
    });

    router.post("/", auth, async (req, res) => {
        const album = Album.findById(req.body.album);
        const track = await Track.findOne({number: req.body.number});
        if (!album) {
            return res.status(400).send({error: 'Album does not exist'});
        }else if(track){
            return res.status(400).send({error: 'This number is already exist'})
        } else {
            const track = new Track(req.body);
            try {
                await track.save();
                res.send(track);
            } catch (e) {
                res.status(400).send(e);
            };
        }
    });

    router.put("/:trackID", [auth, permit("admin")], async (req, res) => {
        const track = await Track.findById(req.params.trackID);
        if (track) {
            try {
                await track.updateOne({ published: true, });
                res.send({ message: "The Track was successfully published" });
            } catch (e) {
                res.status(400).send({ message: "Something went wrong" });
            };
        } else {
            res.status(400).send({ error: "The Track doesn't exist" });
        };
    });

    router.delete("/:trackID", [auth, permit("admin")], async (req, res) => {
        const track = await Track.findById(req.params.trackID);
        if (track) {
            try {
                await track.remove();
                res.send({ message: "The Track was successfully deleted" });
            } catch (e) {
                res.status(400).send({ message: "Something Went Wrong" });
            };
        } else {
            res.status(400).send({ error: "The Track doesn't exist" });
        };
    });

    return router;
}



module.exports = createRouter;