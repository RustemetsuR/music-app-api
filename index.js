const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const artists = require("./app/artists");
const album = require("./app/albums");
const track = require("./app/tracks");
const users = require("./app/users");
const trackHistory = require("./app/trackHistory");
const app = express();
const port = 8000;
const config = require("./config");

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const run = async () => {
    await mongoose.connect(config.db.url + "/" + config.db.name,  { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true});

    app.use("/artists", artists());
    app.use("/albums", album());
    app.use("/tracks", track());
    app.use("/users", users);
    app.use("/trackHistory", trackHistory);
    console.log("Connected to mongo DB");

    app.listen(port, () => {
        console.log(`Server started at http://localhost:${port}`);
    });
};

run().catch(console.log);