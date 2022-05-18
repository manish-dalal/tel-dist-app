"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _cloudinary = require("cloudinary");

const config = require("../config"); // Configure your cloud name, API key and API secret:


const {
  CLOUDINARY_NAME,
  CLOUDINARY_API,
  CLOUDINARY_SECRET
} = config;
const myconfig = CLOUDINARY_NAME && CLOUDINARY_API && CLOUDINARY_SECRET ? _cloudinary.v2.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API,
  api_secret: CLOUDINARY_SECRET,
  secure: true
}) : {};
var _default = myconfig;
exports.default = _default;