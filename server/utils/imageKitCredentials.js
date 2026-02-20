const ImageKit = require("imagekit");
const publicKey= process.env.publicKey;
const privateKey= process.env.privateKey;
const urlEndpoint=process.env.urlEndpoint;
const imagekitAuth = new ImageKit({
  publicKey: publicKey,
  privateKey: privateKey,
  urlEndpoint: urlEndpoint,
});

module.exports = imagekitAuth;
