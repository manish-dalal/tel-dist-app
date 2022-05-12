const dev = process.env.NODE_ENV !== "production";
const defaultValue = dev ? require("./config.dev") : {};
const config = {
  DISABLE_WEB: process.env.DISABLE_WEB,
  SEARCH_SITE: process.env.SEARCH_SITE || defaultValue.SEARCH_SITE,
  SERVER_SITE: process.env.SERVER_SITE || defaultValue.SERVER_SITE || "https://admin-mdisk.glitch.me/api",
  AUTH_CODE: process.env.AUTH_CODE || defaultValue.AUTH_CODE,
  CLIENT_ID: process.env.CLIENT_ID || defaultValue.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET || defaultValue.CLIENT_SECRET,
  GDRIVE_PARENT_FOLDER: process.env.GDRIVE_PARENT_FOLDER || defaultValue.GDRIVE_PARENT_FOLDER,
  SITE: process.env.SITE || defaultValue.SITE,
  TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN || defaultValue.TELEGRAM_TOKEN,
  GDRIVE_TOKEN: process.env.GDRIVE_TOKEN || defaultValue.GDRIVE_TOKEN,
  PORT: process.env.PORT || defaultValue.PORT,
  MONGO_API_URL: process.env.MONGO_API_URL || defaultValue.MONGO_API_URL,
  CHANNEL: process.env.CHANNEL || defaultValue.CHANNEL,
  REPLACE_TEXTS: process.env.REPLACE_TEXTS || defaultValue.REPLACE_TEXTS,
  MDISK_TOKEN: process.env.MDISK_TOKEN || defaultValue.MDISK_TOKEN,
  DOODSTREAM_API_KEY: process.env.DOODSTREAM_API_KEY || defaultValue.DOODSTREAM_API_KEY,
  CNAME: process.env.CNAME || defaultValue.CNAME || "v1",
  DEFAULT_MODE: process.env.DEFAULT_MODE || defaultValue.DEFAULT_MODE,
  ACTIVE_LINK_TYPE: process.env.ACTIVE_LINK_TYPE || defaultValue.ACTIVE_LINK_TYPE,
  DEFAULT_CATEGORY: process.env.DEFAULT_CATEGORY || defaultValue.DEFAULT_CATEGORY,
  KEEPLIVE_TIME: process.env.KEEPLIVE_TIME || defaultValue.KEEPLIVE_TIME,
  KEEPLIVE_INTERVAL: process.env.KEEPLIVE_INTERVAL || defaultValue.KEEPLIVE_INTERVAL,
  THUMB_FILE_ID: process.env.THUMB_FILE_ID || defaultValue.THUMB_FILE_ID || "https://drive.google.com/uc?export=view&id=1GK6SH3Kwgu-Nwr4ilQPyiKuk26tbZmxb"
};
module.exports = config;