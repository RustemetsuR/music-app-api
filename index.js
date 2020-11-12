const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const artists = require("./app/artists");
const album = require("./app/albums");
const track = require("./app/tracks");
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const run = async () => {
    await mongoose.connect("mongodb://localhost/music-app", { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

    app.use("/artists", artists());
    app.use("/albums", album());
    app.use("/tracks", track());
    console.log("Connected to mongo DB");

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
};

run().catch(console.log);