const router = require("express").Router();
const User = require("../models/User");
const Track = require("../models/Track");
const TrackHistory = require("../models/TrackHistory");

router.get("/", async (req, res) => {
    const token = req.get("Authorization");
    if (!token) {
        return res.status(401).send({ error: "No token presented" });
    };
    const user = await User.findOne({ token });
    if (!user) {
        return res.status(401).send({ error: "Wrong token" });
    };
    try {
        const trackHistory = await TrackHistory.find({ user: user })
            .populate({
                path: 'track',
                populate: {
                    path: 'album',
                    populate: {
                        path: 'artist',
                    }
                },
            })
            .populate({path: "user"}).sort({dateTime: -1});
        res.send(trackHistory);
    } catch (e) {
        res.status(400).send(e);
    };
});

router.post("/", async (req, res) => {
    const token = req.get("Authorization");
    if (!token) {
        return res.status(401).send({ error: "No token presented" });
    };
    const user = await User.findOne({ token });
    if (!user) {
        return res.status(401).send({ error: "Wrong token" });
    };
    const trackID = req.body.track;
    const track = await Track.findById(trackID);
    if (!track) {
        return res.status(400).send({ error: 'Track does not exist' });
    } else {
        const trackHistory = new TrackHistory({
            track: trackID,
            user: user._id,
            dateTime: new Date().toISOString(),
        });
        try {
            await trackHistory.save();
            res.send(trackHistory);
        } catch (e) {
            res.status(400).send(e);
        };
    };
});


module.exports = router;