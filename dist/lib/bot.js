"use strict";

const axios = require("axios");

const status = require("../utils/status");

const diskinfo = require("../utils/diskinfo");

const humanTime = require("../utils/humanTime");

const {
  pushInMessageQueue,
  processMessages,
  iMode,
  getProcessStats
} = require("./botplugins");

const config = require("../config");

const {
  Logger
} = require("../utils/winston");

const api = config.SEARCH_SITE || "https://torrent-aio-bot.herokuapp.com/";
console.log("Using api: ", api);
let activeMode = parseInt(config.DEFAULT_MODE) || 6;
let activeCategory = parseInt(config.DEFAULT_CATEGORY) || 1;
let activeLinkType = config.ACTIVE_LINK_TYPE || "mdisk";
const searchRegex = /\/search (piratebay|limetorrent|1337x) (.+)/;
const detailsRegex = /\/details (piratebay|limetorrent|1337x) (.+)/;
const downloadRegex = /\/download (.+)/;
const statusRegex = /\/status (.+)/;
const removeRegex = /\/remove (.+)/;
const getmodeRegex = /\/getmode/;
const setmodeRegex = /(\/setmode|\/setmode (.+))/;
const getcategoryRegex = /\/getcategory/;
const setcategoryRegex = /(\/setcategory|\/setcategory (.+))/;
const setlinktypeRegex = /(\/setlinktype|\/setlinktype (.+))/;
const startMessage = `
Welcome, here are some commands to get you started:

There are 3 sites available at the movement: piratebay, 1337x and limetorrent

/search {site} {query} - To search for torrents
query is what you want to search for
eg. 
    /search piratebay Chernobyl
    /search piratebay Chernobyl 720p
    /search 1337x Lust Stories

/details {site} {link} - To get details of torrent
link is the link to the torrent page
eg. 
    /details piratebay https://bayunblocked net/torrent/.....
    /details 1337x https://1337x to/torrent/.....

/download {magnet link} - To start a download
eg.
    /download magnet:?xt=urn:btih:sdfasdfas

/status {magnet link} - To check status of a downloading torrent
info hash is provided when torent download starts
eg.
    /status magnet:?xt=urn:btih:sdfasdfas

/remove {magnet link} - To remove an already added torrent
eg.
    /remove magnet:?xt=urn:btih:sdfasdfas

To upload a file send the file to this bot it will be uploaded directly to drive

Server status commands

/server status
/server uptime
/server diskinfo

Happy torrenting :)
`;

const newStartText = msg => `**????????????????????????${msg.chat.first_name}!** \n
????'???? ???? Doodstream/mdisk ???????????????????????????????? ????????????. ???????????????? ???????????????? ???????? ???????????????? ???????? ???????????????? ????????????????... \n???????????????? ???????????? ???????? ???????????????? ???????? @${config.CHANNEL} ????`;

const helpText = `You can control me by sending these commands:
/setmode - Update active mode
/getmode - get active mode 
/setcategory - Update active category
/getcategory - get active category
/setlinktype - main site used
/getprocessstats - process stats
/sleep - Bot sleep in heroku time
/help - Get help info \n
        "???????????????? ???????????? ???????? ???????????????? ???????? @${config.CHANNEL} ????`;

function bot(torrent, bot) {
  bot.on("callback_query", callbackQuery => {
    const msg = callbackQuery.message;
    Logger.info(JSON.stringify({ ...(callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.from)
    }));
    console.log("msg ==========", JSON.stringify(callbackQuery));

    if (setcategoryRegex.test(msg.text)) {
      activeCategory = parseInt(callbackQuery.data);
      bot.sendMessage(msg.chat.id, `Active category = ${activeCategory}`);
    } else if (setmodeRegex.test(msg.text)) {
      activeMode = parseInt(callbackQuery.data);
      bot.sendMessage(msg.chat.id, `Active Mode = ${activeMode}`);
    } else if (setlinktypeRegex.test(msg.text)) {
      activeLinkType = callbackQuery.data;
      bot.sendMessage(msg.chat.id, `Active activeLinkType = ${activeLinkType}`);
    }
  });
  bot.onText(/\/start/, async msg => {
    bot.sendMessage(msg.chat.id, config.CHANNEL ? newStartText(msg) : startMessage, {
      parse_mode: "Markdown"
    });
  });
  bot.onText(/\/help/, async msg => {
    bot.sendMessage(msg.chat.id, helpText);
  });
  bot.onText(/\/getprocessstats/, async msg => {
    bot.sendMessage(msg.chat.id, JSON.stringify(getProcessStats(), null, 4));
  });
  bot.onText(getcategoryRegex, async (msg, match) => {
    console.log("getcategoryRegex msg", JSON.stringify(msg));
    console.log("match", JSON.stringify(match));
    const from = msg.chat.id;
    bot.sendMessage(from, `Active category = ${activeCategory}`);
  });
  bot.onText(setlinktypeRegex, async (msg, match) => {
    const from = msg.chat.id;
    var keyboard = {
      inline_keyboard: [[{
        text: "Mdisk",
        callback_data: "mdisk"
      }, {
        text: "Doodstream",
        callback_data: "dood"
      }]]
    };
    const opts = {
      reply_markup: JSON.stringify(keyboard)
    };
    bot.sendMessage(from, match[1], opts);
  });
  bot.onText(setcategoryRegex, async (msg, match) => {
    const from = msg.chat.id;
    var keyboard = {
      inline_keyboard: [[{
        text: "Webseries",
        callback_data: 1
      }, {
        text: "English",
        callback_data: 2
      }], [{
        text: "English Premium",
        callback_data: 3
      }, {
        text: "Desi",
        callback_data: 4
      }], [{
        text: "English Bulk",
        callback_data: 5
      }, {
        text: "Tango&onlyfans",
        callback_data: 6
      }]]
    };
    const opts = {
      reply_markup: JSON.stringify(keyboard)
    };
    bot.sendMessage(from, match[1], opts);
  });
  bot.onText(getmodeRegex, async (msg, match) => {
    const from = msg.chat.id;
    bot.sendMessage(from, `Active Mode = ${activeMode}`);
  });
  bot.onText(setmodeRegex, async (msg, match) => {
    const from = msg.chat.id;
    var keyboard = {
      inline_keyboard: [[{
        text: "Add Thumb Image",
        callback_data: iMode.THUMB
      }, {
        text: "Channel Name Updater",
        callback_data: iMode.CHANNELREMOVER
      }], [{
        text: "co.in link",
        callback_data: iMode.COIN
      }, {
        text: "Mdisk/Dood link",
        callback_data: iMode.MDISK
      }], [{
        text: "Duplicate Link Remover",
        callback_data: iMode.DUPLICATE
      }, {
        text: "Mdisk/Dood + Duplicate",
        callback_data: iMode.MDISKDUPLICATE
      }], [{
        text: "Message in DB",
        callback_data: iMode.SAVEDB
      }, {
        text: "Get Message info",
        callback_data: iMode.MESSAGEINFO
      }]]
    };
    const opts = {
      reply_markup: JSON.stringify(keyboard)
    };
    bot.sendMessage(from, match[1], opts);
  });
  bot.onText(/\/server diskinfo (.+)/, async (msg, match) => {
    const from = msg.chat.id;
    const path = match[1];
    const info = await diskinfo(path);
    bot.sendMessage(from, info);
  });
  bot.onText(/\/server uptime/, async msg => {
    const from = msg.chat.id;
    bot.sendMessage(from, humanTime(process.uptime() * 1000));
  });
  bot.onText(/\/server status/, async msg => {
    const from = msg.chat.id;
    const currStatus = await status();
    bot.sendMessage(from, currStatus);
  });
  bot.onText(searchRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];
    bot.sendMessage(from, "Searching...");
    const data = await axios(`${api}api/v1/search/${site}?query=${query}`).then(({
      data
    }) => data);

    if (!data || data.error) {
      bot.sendMessage(from, "An error occured on server");
    } else if (!data.results || data.results.length === 0) {
      bot.sendMessage(from, "No results found.");
    } else if (data.results.length > 0) {
      let results1 = "";
      let results2 = "";
      let results3 = "";
      data.results.forEach((result, i) => {
        if (i <= 2) {
          results1 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
        } else if (2 < i && i <= 5) {
          results2 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
        } else if (5 < i && i <= 8) {
          results3 += `Name: ${result.name} \nSeeds: ${result.seeds} \nDetails: ${result.details} \nLink: ${result.link} \n\n`;
        }
      });
      bot.sendMessage(from, results1);
      bot.sendMessage(from, results2);
      bot.sendMessage(from, results3);
    }
  });
  bot.onText(detailsRegex, async (msg, match) => {
    var from = msg.from.id;
    var site = match[1];
    var query = match[2];
    bot.sendMessage(from, "Loading...");
    const data = await axios(`${api}/details/${site}?query=${query}`).then(({
      data
    }) => data);

    if (!data || data.error) {
      bot.sendMessage(from, "An error occured");
    } else if (data.torrent) {
      const torrent = data.torrent;
      let result1 = "";
      let result2 = "";
      result1 += `Title: ${torrent.title} \n\nInfo: ${torrent.info}`;
      torrent.details.forEach(item => {
        result2 += `${item.infoTitle} ${item.infoText} \n\n`;
      });
      result2 += "Magnet Link:";
      await bot.sendMessage(from, result1);
      await bot.sendMessage(from, result2);
      await bot.sendMessage(from, torrent.downloadLink);
    }
  });
  bot.onText(downloadRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];
    let messageObj = null;
    let torrInterv = null;

    const reply = async torr => {
      let mess1 = "";
      mess1 += `Name: ${torr.name}\n\n`;
      mess1 += `Status: ${torr.status}\n\n`;
      mess1 += `Size: ${torr.total}\n\n`;

      if (!torr.done) {
        mess1 += `Downloaded: ${torr.downloaded}\n\n`;
        mess1 += `Speed: ${torr.speed}\n\n`;
        mess1 += `Progress: ${torr.progress}%\n\n`;
        mess1 += `Time Remaining: ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
        clearInterval(torrInterv);
        torrInterv = null;
      }

      mess1 += `Magnet URI: ${torr.magnetURI}`;

      try {
        if (messageObj) {
          if (messageObj.text !== mess1) bot.editMessageText(mess1, {
            chat_id: messageObj.chat.id,
            message_id: messageObj.message_id
          });
        } else messageObj = await bot.sendMessage(from, mess1);
      } catch (e) {
        console.log(e.message);
      }
    };

    const onDriveUpload = (torr, url) => bot.sendMessage(from, `${torr.name} uploaded to drive\n${url}`);

    const onDriveUploadStart = torr => bot.sendMessage(from, `Uploading ${torr.name} to gdrive`);

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else {
      bot.sendMessage(from, "Starting download...");

      try {
        const torren = torrent.download(link, torr => reply(torr), torr => reply(torr), onDriveUpload, onDriveUploadStart);
        torrInterv = setInterval(() => reply(torrent.statusLoader(torren)), 5000);
      } catch (e) {
        bot.sendMessage(from, "An error occured\n" + e.message);
      }
    }
  });
  bot.onText(statusRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];
    const torr = torrent.get(link);

    if (link.indexOf("magnet:") !== 0) {
      bot.sendMessage(from, "Link is not a magnet link");
    } else if (!torr) {
      bot.sendMessage(from, "Not downloading please add");
    } else {
      let mess1 = "";
      mess1 += `Name: ${torr.name}\n\n`;
      mess1 += `Status: ${torr.status}\n\n`;
      mess1 += `Size: ${torr.total}\n\n`;

      if (!torr.done) {
        mess1 += `Downloaded: ${torr.downloaded}\n\n`;
        mess1 += `Speed: ${torr.speed}\n\n`;
        mess1 += `Progress: ${torr.progress}\n\n`;
        mess1 += `Time Remaining: ${torr.redableTimeRemaining}\n\n`;
      } else {
        mess1 += `Link: ${torr.downloadLink}\n\n`;
      }

      mess1 += `Magnet URI: ${torr.magnetURI}`;
      bot.sendMessage(from, mess1);
    }
  });
  bot.onText(removeRegex, (msg, match) => {
    var from = msg.from.id;
    var link = match[1];

    try {
      torrent.remove(link);
      bot.sendMessage(from, "Removed");
    } catch (e) {
      bot.sendMessage(from, `${e.message}`);
    }
  });
  setInterval(async () => {
    // console.log("setInterval called");
    processMessages(bot);
  }, 10000);
  bot.on("message", async (msg, match) => {
    // console.log("msg, match", JSON.stringify(msg));
    // console.log("msg, match", JSON.stringify(match));
    const {
      from,
      text,
      caption
    } = msg;
    Logger.info(JSON.stringify({
      from,
      text,
      caption
    }));

    if (!(msg.text && msg.text.startsWith("/"))) {
      pushInMessageQueue({
        msg,
        match,
        mode: activeMode,
        category: activeCategory,
        activeLinkType
      });
    }
  });
}

module.exports = bot;