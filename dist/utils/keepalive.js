"use strict";

const axios = require("axios");

const config = require("../config");

const humanTime = require("./humanTime");

const KEEPLIVE_SITE = `${config.SERVER_SITE}/keepalive`;
let KEEPLIVE_TIME = config.KEEPLIVE_TIME || 80;
const KEEPLIVE_INTERVAL = config.KEEPLIVE_INTERVAL || 280000;

function setKeepliveTime(minutes = 0) {
  KEEPLIVE_TIME = minutes;
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

let lastRequestTime = new Date();

const updateLastRequestTime = () => {
  lastRequestTime = new Date();
};

function keepalive() {
  if (KEEPLIVE_SITE) {
    setInterval(async () => {
      const currentTime = new Date().getTime();
      const nextSleepTime = addMinutes(lastRequestTime, KEEPLIVE_TIME).getTime();
      const afterLastRequestTime = addMinutes(lastRequestTime, 4).getTime();
      console.log("Bot will sleep after", humanTime(nextSleepTime - currentTime));
      console.log(`Last rquest is not ${KEEPLIVE_TIME} min ago`, nextSleepTime > currentTime, currentTime > afterLastRequestTime);

      if (nextSleepTime > currentTime && currentTime > afterLastRequestTime) {
        try {
          let params = {
            url: config.SITE
          };
          const url = new URL(KEEPLIVE_SITE);
          url.search = new URLSearchParams(params);
          const data = await axios(url.href);
          console.log("keep alive triggred, status: ", data.status);
        } catch (error) {
          console.log("Error in ", KEEPLIVE_SITE);
        }
      }
    }, KEEPLIVE_INTERVAL);
  } else {
    console.warn("Set site env var. Read docs at https://github.com/patheticGeek/torrent-aio-bot");
  }
}

module.exports = {
  keepalive,
  updateLastRequestTime,
  lastRequestTime,
  setKeepliveTime
};