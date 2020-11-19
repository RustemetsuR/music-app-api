const router = require("express").Router();
const Album = require("../models/Album");
const Track = require("../models/Track");

const createRouter = () => {
    router.get("/", async (req, res) => {
        let query;
        if (req.query.album) {
            query = { album: req.query.album };
        };
        try {
            const tracks = await Track.find(query).sort({number: 1});
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

    router.post("/", async (req, res) => {
        const album = Album.findById(req.body.album);
        if(!album){
            return res.status(400).send('Album does not exist');
        }else{
            const track = new Track(req.body);
            try {
                await track.save();
                res.send(track);
            } catch (e) {
                res.status(400).send(e);
            };
        }
    });
    return router;
}



module.exports = createRouter;