const path = require("path");

const rootPath = __dirname;

let dbName = "music-app";

if(process.env.NODE_ENV === "test"){
  dbName = "music-app-test";
}

module.exports = {
  rootPath,
  uploadPath: path.join(rootPath, "public/uploads"),
  db: {
    name: dbName,
    url: 'mongodb://localhost',
  },
  fb: {
    appId: "310932736689445",
    appSecret: "ba779bdca7d271202078a94b9b92e485"
  }
};