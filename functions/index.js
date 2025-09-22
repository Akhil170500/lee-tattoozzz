const functions = require("firebase-functions");
const ImageKit = require("imagekit");
const { v4: uuidv4 } = require("uuid");

// Replace these keys with your Firebase Functions config keys
const imagekit = new ImageKit({
  publicKey: functions.config().imagekit.public_key,
  privateKey: functions.config().imagekit.private_key,
  urlEndpoint: functions.config().imagekit.url_endpoint
});

// Cloud Function that gives client auth parameters
exports.getImageKitAuth = functions.https.onRequest((req, res) => {
  const token = uuidv4(); // unique token
  const expire = Math.floor(Date.now() / 1000) + 600; // expires in 10 mins
  const authParams = imagekit.getAuthenticationParameters(token, expire);
  res.json(authParams);
});
// publick: public_BsK8kNSDC0Q8u9y3Mg3gefooKXg=
// private: private_/XSrbWXCE1H6Tqd4aZIsqpscg28=
// url end point: https://ik.imagekit.io/rqzl7b2tg