"use strict";

const dev = process.env.NODE_ENV && process.env.NODE_ENV !== "production";
const envFile = dev ? ".env.dev" : ".env";

require("dotenv").config({
  path: envFile
});

const config = {
  DISABLE_WEB: process.env.DISABLE_WEB,
  SEARCH_SITE: process.env.SEARCH_SITE,
  SERVER_SITE: process.env.SERVER_SITE || "https://diskuploader.onrender.com/api",
  AUTH_CODE: process.env.AUTH_CODE,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  GDRIVE_PARENT_FOLDER: process.env.GDRIVE_PARENT_FOLDER,
  SITE: process.env.SITE,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  GDRIVE_TOKEN: process.env.GDRIVE_TOKEN,
  PORT: process.env.PORT,
  MONGO_API_URL: process.env.MONGO_API_URL,
  CHANNEL: process.env.CHANNEL,
  REPLACE_TEXTS: process.env.REPLACE_TEXTS || "[]",
  MDISK_TOKEN: process.env.MDISK_TOKEN,
  DOODSTREAM_API_KEY: process.env.DOODSTREAM_API_KEY,
  CNAME: process.env.CNAME || "v1",
  DEFAULT_MODE: process.env.DEFAULT_MODE,
  ACTIVE_LINK_TYPE: process.env.ACTIVE_LINK_TYPE,
  DEFAULT_CATEGORY: process.env.DEFAULT_CATEGORY,
  KEEPLIVE_TIME: process.env.KEEPLIVE_TIME,
  KEEPLIVE_INTERVAL: process.env.KEEPLIVE_INTERVAL,
  THUMB_FILE_ID: process.env.THUMB_FILE_ID || "https://drive.google.com/uc?export=view&id=1GK6SH3Kwgu-Nwr4ilQPyiKuk26tbZmxb",
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API: process.env.CLOUDINARY_API,
  CLOUDINARY_SECRET: process.env.CLOUDINARY_SECRET,
  REMOVE_CHANNEL_NAME: process.env.REMOVE_CHANNEL_NAME,
  ADMIN_USERS: process.env.ADMIN_USERS || "[]",
  TELEGRAM_TOKEN_1: process.env.TELEGRAM_TOKEN_1
};
module.exports = config;