"use strict";

const axios = require("axios");

const config = require("../config");

const humanTime = require("./humanTime");

const {
  getProcessStats
} = require("../lib/botplugins");

const KEEPLIVE_SITE = `${config.SERVER_SITE}/keepalive`; // let KEEPLIVE_TIME = config.KEEPLIVE_TIME || 100;

const KEEPLIVE_INTERVAL = config.KEEPLIVE_INTERVAL || 280000;
let LAST_KEEPLIVE_TIME = new Date();

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
      const {
        total = 0,
        current = 0,
        nextData = 0
      } = getProcessStats();
      const currentTime = new Date().getTime();
      const afterLastRequestTime = addMinutes(lastRequestTime, 4).getTime();
      console.log("Last keeplive request is", humanTime(currentTime - LAST_KEEPLIVE_TIME.getTime()));
      console.log("Bot last request is", humanTime(currentTime - lastRequestTime.getTime()));
      console.log(`condition 1`, total - current > 10, "===", nextData);
      console.log(`condition 2`, currentTime > afterLastRequestTime);

      if ((total - current > 10 || nextData) && currentTime > afterLastRequestTime) {
        try {
          let params = {
            url: config.SITE
          };
          const url = new URL(KEEPLIVE_SITE);
          url.search = new URLSearchParams(params);
          const data = await axios(url.href);
          LAST_KEEPLIVE_TIME = new Date();
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
  lastRequestTime
};