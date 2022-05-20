"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCloudinarySignature = void 0;

var _cloudinary = require("cloudinary");

require("./cloudinary");

const getCloudinarySignature = (folder = "m1") => {
  const apiSecret = _cloudinary.v2.config().api_secret;

  const cloudName = _cloudinary.v2.config().cloud_name;

  const apiKey = _cloudinary.v2.config().api_key;

  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = _cloudinary.v2.utils.api_sign_request({
    timestamp: timestamp,
    folder
  }, apiSecret);

  return {
    timestamp,
    signature,
    cloudname: cloudName,
    apikey: apiKey,
    folder
  };
};

exports.getCloudinarySignature = getCloudinarySignature;