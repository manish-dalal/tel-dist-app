"use strict";

const dev = process.env.NODE_ENV && process.env.NODE_ENV !== "production";
const envFile = dev ? ".env.dev" : ".env";
require("dotenv").config({
  path: envFile
});
// https://diskuploader.glitch.me/api/health-check
// https://diskuploader.onrender.com/api/health-check

const config = {
  DISABLE_WEB: process.env.DISABLE_WEB,
  SEARCH_SITE: process.env.SEARCH_SITE,
  SERVER_SITE: process.env.SERVER_SITE || "https://diskuploader.glitch.me/api",
  AUTH_CODE: process.env.AUTH_CODE,
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
  GDRIVE_PARENT_FOLDER: process.env.GDRIVE_PARENT_FOLDER,
  SITE: process.env.SITE,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
  GDRIVE_TOKEN: process.env.GDRIVE_TOKEN,
  PORT: process.env.PORT || 5010,
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
  TELEGRAM_REQUESTER_BOT: process.env.TELEGRAM_REQUESTER_BOT,
  TELEGRAM_TOKEN_0: process.env.TELEGRAM_TOKEN_0,
  TELEGRAM_TOKEN_1: process.env.TELEGRAM_TOKEN_1,
  TELEGRAM_TOKEN_2: process.env.TELEGRAM_TOKEN_2,
  TELEGRAM_TOKEN_3: process.env.TELEGRAM_TOKEN_3,
  TELEGRAM_TOKEN_4: process.env.TELEGRAM_TOKEN_4,
  TELEGRAM_TOKEN_5: process.env.TELEGRAM_TOKEN_5,
  DESIGNATION_CHAT: process.env.DESIGNATION_CHAT,
  VIVDISK_TOKEN: process.env.VIVDISK_TOKEN,
  VIVDISK_RETRY: process.env.VIVDISK_RETRY,
  DEFAULT_FILENAME: process.env.DEFAULT_FILENAME,
  BACKUP_CHANNEL_LINK: process.env.BACKUP_CHANNEL_LINK,
  ALL_CHANNEL_LINK: process.env.ALL_CHANNEL_LINK,
  MESSAGE_HEADER: process.env.MESSAGE_HEADER,
  MESSAGE_FOOTER: process.env.MESSAGE_FOOTER,
  CATEGORIES: process.env.CATEGORIES,
  ISFULLBOT: process.env.ISFULLBOT,
  TERABOX_ADMIN_USER_TOKEN: process.env.TERABOX_ADMIN_USER_TOKEN,
  JOIN_CHANNEL_USER_TOKEN: process.env.JOIN_CHANNEL_USER_TOKEN,
  KEEP_CAPTION_TITLE: process.env.KEEP_CAPTION_TITLE,
  DISABLE_SEND_MESSAGE: process.env.DISABLE_SEND_MESSAGE
};
module.exports = config;