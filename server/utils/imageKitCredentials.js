const ImageKit = require("imagekit");
const publicKey= process.env.publicKey
const privateKey= process.env.privateKey
const  urlEndpoint=process.env.urlEndpoint
const imagekit = new ImageKit({
  publicKey: publicKey,
  privateKey: privateKey,
  urlEndpoint: urlEndpoint,
});

module.exports = imagekit;
