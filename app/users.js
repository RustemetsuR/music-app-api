const router = require("express").Router();
const config = require("../config");
const User = require("../models/User");
const axios = require('axios');
const {nanoid} = require('nanoid');

router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.send(users);
  } catch (e) {
    res.sendStatus(500);
  }
});
router.post("/", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      password: req.body.password,
      displayName: req.body.displayName,
    });
    user.generateToken();
    await user.save();
    res.send(user);
  } catch (e) {
    return res.status(400).send(e);
  }
});

router.post("/sessions", async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (!user) {
    return res.status(400).send({ error: "Username not found" });
  }
  const isMatch = await user.checkPassword(req.body.password);
  if (!isMatch) {
    return res.status(400).send({ error: "Password is wrong" });
  }

  user.generateToken();
  await user.save();

  res.send(user);
});

router.delete("/sessions", async (req, res) => {
  const token = req.get("Authorization");
  const success = { message: "Success" };

  if (!token) return res.send(success);
  const user = await User.findOne({ token });

  if (!user) return res.send(success);

  user.generateToken();
  user.save({ validateBeforeSave: false });

  return res.send(success);
});

router.post("/facebookLogin", async (req, res) => {
  const inputToken = req.body.accessToken;
  const accessToken = config.fb.appId + "|" + config.fb.appSecret;
  const debugTokenUrl = `https://graph.facebook.com/debug_token?input_token=${inputToken}&access_token=${accessToken}`;
  try {
    const response = await axios.get(debugTokenUrl);
    if (response.data.data.error) {
      return res.status(401).send({message: "Facebook token incorrect"});
    }
    if (req.body.id !== response.data.data.user_id) {
      return res.status(401).send({message: "Wrong user ID"});
    }

    let user = await User.findOne({facebookId: req.body.id});

    console.log(req.body);

    if (!user) {
      user = new User({
        username: req.body.email,
        password: nanoid(),
        facebookId: req.body.id,
        displayName: req.body.name,
        avatarImage: req.body.picture.data.url,
      });
    }
    user.generateToken();
    await user.save({validateBeforeSave: false});
    console.log(user);
    res.send(user);
  } catch(e) {
    console.log(e);
    return res.status(401).send({message: "Facebook token incorrect"});
  }
});

module.exports = router;