"use strict";

const axios = require("axios");
const get = require("lodash/get");
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
const {
  categories
} = require("../utils/categories");
const api = config.SEARCH_SITE || "https://torrent-aio-bot.herokuapp.com/";
console.log("Using api: ", api);
let activeMode = parseInt(config.DEFAULT_MODE) || 6;
let activeCategory = parseInt(config.DEFAULT_CATEGORY) || 1;
let activeLinkType = config.ACTIVE_LINK_TYPE || "mdisk";
const adminUsersArr = JSON.parse(config.ADMIN_USERS);
const checkUser = (action, msg) => {
  if (!adminUsersArr.length || adminUsersArr.includes(msg.from.id)) {
    action();
  }
};
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
const getlinktypeRegex = /\/getlinktype/;
const deleteAllRegex = /\/deleteAll (.+)/;
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
const newStartText = msg => `**𝗛𝗘𝗟𝗟𝗢🎈${msg.chat.first_name}!** \n
𝐈'𝐦 𝐚 Doodstream/mdisk 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐫 𝐛𝐨𝐭. 𝐉𝐮𝐬𝐭 𝐬𝐞𝐧𝐝 𝐦𝐞 𝐥𝐢𝐧𝐤 𝐨𝐫 𝐅𝐮𝐥𝐥 𝐩𝐨𝐬𝐭... \n𝐓𝐡𝐢𝐬 𝐛𝐨𝐭 𝐢𝐬 𝐦𝐚𝐝𝐞 𝐛𝐲 @${config.CHANNEL} 💖`;
const isMainBot = JSON.parse(get(config, "ISFULLBOT", "false"));
const helpText = `You can control me by sending these commands:
/setmode - Update active mode
/getmode - get active mode 
${isMainBot ? `/setcategory - Update active category
/getcategory - get active category
/setlinktype - set linktype
/getlinktype - get linktype` : ""}
/getprocessstats - process stats
/help - Get help info \n
        "𝐓𝐡𝐢𝐬 𝐛𝐨𝐭 𝐢𝐬 𝐦𝐚𝐝𝐞 𝐛𝐲 @${config.CHANNEL} 💖`;
function bot(torrent, bot) {
  bot.on("callback_query", callbackQuery => {
    const msg = callbackQuery.message;
    Logger.info(JSON.stringify({
      ...(callbackQuery === null || callbackQuery === void 0 ? void 0 : callbackQuery.from)
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
    checkUser(() => {
      bot.sendMessage(msg.chat.id, config.CHANNEL ? newStartText(msg) : startMessage, {
        parse_mode: "Markdown"
      });
    }, msg);
  });
  bot.onText(/\/help/, async msg => {
    checkUser(() => {
      bot.sendMessage(msg.chat.id, helpText);
    }, msg);
  });
  bot.onText(/\/getprocessstats/, async msg => {
    checkUser(() => {
      bot.sendMessage(msg.chat.id, JSON.stringify(getProcessStats(), null, 4));
    }, msg);
  });
  bot.onText(deleteAllRegex, (msg, match) => {
    checkUser(async () => {
      const chatID = get(match, "[1]", "");
      // console.log("chatID", chatID);
      if (chatID) {
        try {
          let res = await bot.sendMessage(chatID, "deleting");
          // console.log("res", res);
        } catch (e) {
          console.log('errroror', get(e, 'message', ''));
        }
        for (let i = res.message_id; i >= 0; i--) {
          console.log(`chat_id: ${chatID}, message_id: ${i}`);
          try {
            let res = await bot.deleteMessage(chatID, i);
            // console.log(res);
          } catch (e) {
            // console.error(e);
          }
        }
      }
    }, msg);
  });
  bot.onText(getcategoryRegex, async (msg, match) => {
    checkUser(() => {
      console.log("getcategoryRegex msg", JSON.stringify(msg));
      console.log("match", JSON.stringify(match));
      const from = msg.chat.id;
      bot.sendMessage(from, `Active category = ${activeCategory}`);
    }, msg);
  });
  bot.onText(getlinktypeRegex, async (msg, match) => {
    checkUser(() => {
      console.log("getlinktypeRegex msg", JSON.stringify(msg));
      console.log("match", JSON.stringify(match));
      const from = msg.chat.id;
      bot.sendMessage(from, `Active linktype = ${activeLinkType}`);
    }, msg);
  });
  bot.onText(setlinktypeRegex, async (msg, match) => {
    checkUser(() => {
      const from = msg.chat.id;
      var keyboard = {
        inline_keyboard: [[{
          text: "Mdisk",
          callback_data: "mdisk"
        }, {
          text: "Doodstream",
          callback_data: "dood"
        }], [{
          text: "Vivdisk",
          callback_data: "vivdisk"
        }, {
          text: "Terabox",
          callback_data: "terabox"
        }], [{
          text: "ios-content",
          callback_data: "ios-content"
        }]]
      };
      const opts = {
        reply_markup: JSON.stringify(keyboard)
      };
      bot.sendMessage(from, match[1], opts);
    }, msg);
  });
  bot.onText(setcategoryRegex, async (msg, match) => {
    checkUser(() => {
      const from = msg.chat.id;
      const inkeyboard = [];
      for (let i = 0; i < categories.length; i++) {
        const tempArr = categories.slice(i * 2, Math.min(i * 2 + 2, categories.length));
        inkeyboard.push(tempArr.map(e => ({
          text: e.label,
          callback_data: e.value
        })));
      }
      var keyboard = {
        inline_keyboard: inkeyboard
      };
      const opts = {
        reply_markup: JSON.stringify(keyboard)
      };
      bot.sendMessage(from, match[1], opts);
    }, msg);
  });
  bot.onText(getmodeRegex, async (msg, match) => {
    checkUser(() => {
      const from = msg.chat.id;
      bot.sendMessage(from, `Active Mode = ${activeMode}`);
    }, msg);
  });
  bot.onText(setmodeRegex, async (msg, match) => {
    checkUser(() => {
      const inlineKeyboard = isMainBot ? [[{
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
      }], [{
        text: "D+M Link remover",
        callback_data: iMode.DUPLICATE_REMOVE_MDISK
      }, {
        text: "C Remove Keep terabox",
        callback_data: iMode.CHANNEL_REMOVER_KEEP_TERABOX
      }], [{
        text: "Thumb + Keep terabox",
        callback_data: iMode.THUMB_KEEP_TERABOX
      }]] : [[{
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
        text: "C Remove Keep terabox",
        callback_data: iMode.CHANNEL_REMOVER_KEEP_TERABOX
      }, {
        text: "Thumb + Keep terabox",
        callback_data: iMode.THUMB_KEEP_TERABOX
      }]];
      const from = msg.chat.id;
      var keyboard = {
        inline_keyboard: inlineKeyboard
      };
      const opts = {
        reply_markup: JSON.stringify(keyboard)
      };
      bot.sendMessage(from, match[1], opts);
    }, msg);
  });
  bot.onText(/\/server diskinfo (.+)/, async (msg, match) => {
    checkUser(async () => {
      const from = msg.chat.id;
      const path = match[1];
      const info = await diskinfo(path);
      bot.sendMessage(from, JSON.stringify(info, null, 2));
    }, msg);
  });
  bot.onText(/\/server uptime/, async msg => {
    checkUser(() => {
      const from = msg.chat.id;
      bot.sendMessage(from, humanTime(process.uptime() * 1000));
    }, msg);
  });
  bot.onText(/\/server status/, async msg => {
    checkUser(async () => {
      const from = msg.chat.id;
      const currStatus = await status();
      bot.sendMessage(from, currStatus);
    }, msg);
  });
  bot.onText(searchRegex, async (msg, match) => {
    checkUser(async () => {
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
    }, msg);
  });
  bot.onText(detailsRegex, async (msg, match) => {
    checkUser(async () => {
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
    }, msg);
  });
  bot.onText(downloadRegex, (msg, match) => {
    checkUser(async () => {
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
    }, msg);
  });
  bot.onText(statusRegex, (msg, match) => {
    checkUser(() => {
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
    }, msg);
  });
  bot.onText(removeRegex, (msg, match) => {
    checkUser(() => {
      var from = msg.from.id;
      var link = match[1];
      try {
        torrent.remove(link);
        bot.sendMessage(from, "Removed");
      } catch (e) {
        bot.sendMessage(from, `${e.message}`);
      }
    }, msg);
  });
  setInterval(async () => {
    // console.log("setInterval called");
    processMessages(bot);
  }, 10000);
  bot.on("message", async (msg, match) => {
    const {
      from,
      text,
      caption
    } = msg;
    // console.log("msg@@@", JSON.stringify(msg));
    Logger.info("message" + JSON.stringify({
      from,
      text,
      caption
    }));
    checkUser(() => {
      // console.log("msg, match", JSON.stringify(msg));
      // console.log("msg, match", JSON.stringify(match));
      if (!(msg.text && msg.text.startsWith("/"))) {
        pushInMessageQueue({
          msg,
          match,
          mode: activeMode,
          category: activeCategory,
          activeLinkType
        });
      }
    }, msg);
  });
  bot.on("chat_join_request", async (msg, match) => {
    // console.log("msg, match", JSON.stringify(msg));
    // console.log("msg, match", JSON.stringify(match));
    const isAceeptBotLink = get(msg, "invite_link.name", "").toLowerCase().includes("accept") || get(msg, "invite_link.creator.first_name", "").toLowerCase().includes("accept");
    if (!isAceeptBotLink) {
      Logger.info("chat_join_request" + JSON.stringify(msg));
    }
    const mongoApiUrl = config.MONGO_API_URL === "null" ? "" : config.MONGO_API_URL;
    if (mongoApiUrl) {
      const {
        chat,
        from
      } = msg;
      chat.id = chat.id.toString();
      from.id = from.id.toString();
      const apiUrl = `${mongoApiUrl}/joinrequest`;
      const body = {
        action: "add",
        data: {
          chat,
          from,
          token: config.TELEGRAM_TOKEN
        }
      };
      const {
        data
      } = await axios.post(apiUrl, body);
      Logger.info(JSON.stringify({
        from,
        chat,
        data
      }));
    }
  });
}
// chat_join_request
// https://github.com/yagop/node-telegram-bot-api/blob/master/doc/usage.md#events
// https://github.com/yagop/node-telegram-bot-api/blob/master/doc/api.md#TelegramBot+approveChatJoinRequest

module.exports = bot;