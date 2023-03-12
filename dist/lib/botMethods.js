"use strict";

const telegram = require("node-telegram-bot-api");
const get = require("lodash/get");
const set = require("lodash/set");
const uniqBy = require("lodash/uniqBy");
const orderBy = require("lodash/orderBy");
const config = require("../config");
const Xray = require("x-ray");
const xClient = Xray();
const getDateString = () => {
  const date = new Date();
  const timestr = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const dateStr = `(${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear().toString().slice(-2)})`;
  return timestr + dateStr;
};
const token1 = config.TELEGRAM_TOKEN_1;
const token2 = config.TELEGRAM_TOKEN_2;
const token3 = config.TELEGRAM_TOKEN_3;
const token4 = config.TELEGRAM_TOKEN_4;
const token5 = config.TELEGRAM_TOKEN_5;
let bot1 = null;
let bot2 = null;
let bot3 = null;
let bot4 = null;
let bot5 = null;
if (token1 && !bot1) {
  bot1 = new telegram(token1, {});
}
if (token2 && !bot2) {
  bot2 = new telegram(token2, {});
}
if (token3 && !bot3) {
  bot3 = new telegram(token3, {});
}
if (token4 && !bot4) {
  bot4 = new telegram(token4, {});
}
if (token5 && !bot5) {
  bot5 = new telegram(token5, {});
}
let telegramBot = null;
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
const setBot = bot => {
  telegramBot = bot;
};
const approveChatJoinRequest = async (chatId, userId, options) => {
  const res = await telegramBot.approveChatJoinRequest(chatId, userId, options);
  return res;
};
const declineChatJoinRequest = async (chatId, userId, options) => {
  const res = await telegramBot.declineChatJoinRequest(chatId, userId, options);
  return res;
};
const botList = [{
  botId: 1,
  bot: telegramBot,
  lastTelgramSendRequest: new Date().getTime()
}, bot1 && {
  botId: 2,
  bot: bot1,
  lastTelgramSendRequest: new Date().getTime()
}, bot2 && {
  botId: 3,
  bot: bot2,
  lastTelgramSendRequest: new Date().getTime()
}, bot3 && {
  botId: 4,
  bot: bot3,
  lastTelgramSendRequest: new Date().getTime()
}, bot4 && {
  botId: 5,
  bot: bot4,
  lastTelgramSendRequest: new Date().getTime()
}, bot5 && {
  botId: 6,
  bot: bot5,
  lastTelgramSendRequest: new Date().getTime()
}];
const getBotList = () => {
  botList[0].bot = telegramBot;
  const sortedBotList = orderBy(botList.filter(el => !!el), "lastTelgramSendRequest");
  return sortedBotList;
};
const chatBotStatus = {
  1: {
    approved: [],
    pending: [],
    deny: []
  }
};
const isBotAddedInChat = async (chatId, botInstance) => {
  let status;
  let errorObj = {};
  if (get(chatBotStatus, `${chatId}.approved`, []).includes(botInstance.botId)) {
    status = true;
  } else if (get(chatBotStatus, `${chatId}.deny`, []).includes(botInstance.botId)) {
    status = false;
  } else {
    try {
      // console.log("validChatArr", JSON.stringify(chatBotStatus), chatId);
      const respq = await botInstance.bot.getChatAdministrators(chatId);
      const appChats = get(chatBotStatus, `${chatId}.approved`, []);
      set(chatBotStatus, `${chatId}.approved`, [...appChats, botInstance.botId]);
      status = true;
    } catch (error) {
      const pendingChats = get(chatBotStatus, `${chatId}.pending`, []);
      set(chatBotStatus, `${chatId}.pending`, [...pendingChats, botInstance.botId]);
      if (pendingChats.includes(chatId)) {
        const denyChats = get(chatBotStatus, `${chatId}.deny`, []);
        set(chatBotStatus, `${chatId}.deny`, [...denyChats, botInstance.botId]);
      }
      status = false;
      errorObj = {
        name: get(error, "response.body.error_code", ""),
        message: get(error, "response.body.description", "")
      };
    }
  }
  return {
    status,
    errorObj
  };
};
const getBotInstanseAndSleep = async ({
  bot,
  chatId
}) => {
  const sortedBotList = getBotList();

  // console.log("JSON.stringify(chatBotStatus)", JSON.stringify(chatBotStatus));
  // console.log(
  //   "sortedBotList",
  //   JSON.stringify(sortedBotList.map(e => ({ botId: e.botId, lastTelgramSendRequest: e.lastTelgramSendRequest })))
  // );
  let finalBot = null;
  let error = {};
  for (let i = 0; i <= sortedBotList.length; i++) {
    const el = sortedBotList[i];
    const {
      status: isBotAdmin,
      errorObj
    } = await isBotAddedInChat(chatId, el);
    // console.log(el.botId, "satus", isBotAdmin);
    if (isBotAdmin) {
      const remaingTime = Math.max(3000 - (new Date().getTime() - el.lastTelgramSendRequest), 0);
      await sleep(Math.max(remaingTime, 0));
      el.lastTelgramSendRequest = new Date().getTime();
      finalBot = el.bot;
      break;
    } else {
      if (el.botId === 1) {
        finalBot = el.bot;
        error = errorObj;
        break;
      }
    }
  }
  return {
    bot: finalBot || telegramBot,
    error
  };
};
const getFileData = (msg, activeLinkType, cname = "") => {
  let mimeType = "";
  let fileName = "";
  let fileId = "";
  if (msg.document) {
    mimeType = msg.document.mimeType;
    fileName = msg.document.file_name;
    fileId = msg.document.file_id;
  } else if (msg.video) {
    mimeType = msg.video.mimeType;
    fileName = msg.video.file_name;
    fileId = msg.video.file_id;
  } else if (msg.audio) {
    mimeType = msg.audio.mimeType;
    fileName = msg.audio.file_name;
    fileId = msg.audio.file_id;
  } else if (msg.photo) {
    const lastPhoto = msg.photo[msg.photo.length - 1];
    mimeType = (lastPhoto === null || lastPhoto === void 0 ? void 0 : lastPhoto.mimeType) || "image/jpeg";
    fileName = `${activeLinkType}${cname ? "-" + cname : ""}-${getDateString()}-${msg.message_id}.jpeg`;
    fileId = lastPhoto.file_id;
  }
  return {
    mimeType,
    fileName,
    fileId
  };
};
const sendMessage = async ({
  msg,
  convertedStr,
  bot,
  chatId
}) => {
  if ((msg.document || msg.video || msg.audio || msg.photo) && convertedStr) {
    const {
      fileId
    } = getFileData(msg);
    const opts = {
      caption: convertedStr
    };
    if (msg.document) {
      await bot.sendDocument(chatId, fileId, opts);
    } else if (msg.video) {
      await bot.sendVideo(chatId, fileId, opts);
    } else if (msg.audio) {
      await bot.sendAudio(chatId, fileId, opts);
    } else if (msg.photo) {
      await bot.sendPhoto(chatId, fileId, opts);
    }
  } else if (msg.text && convertedStr) {
    await bot.sendMessage(chatId, convertedStr);
  }
};
const convertMessageBody = (links, mlStr = "") => {
  const header = config.MESSAGE_HEADER || "📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐋𝐢𝐧𝐤𝐬/👀𝐖𝐚𝐭𝐜𝐡 𝐎𝐧𝐥𝐢𝐧𝐞\n\n";
  const footer = config.MESSAGE_FOOTER || `\n⬤▬▬▬▬▬▬▬▬▬▬▬▬▬⬤\n`;
  const subHeader = mlStr && mlStr.substring(0, mlStr.indexOf(links[0])).replaceAll("Video 1. 👉 ", "");
  const subHeaderLower = subHeader && subHeader.toLowerCase();
  let str = subHeader && !(subHeaderLower.includes("today") || subHeaderLower.includes("xkhub")) ? subHeader : header;
  links.forEach((el, index) => {
    str = `${str}Video ${index + 1}. 👉 ${el} \n\n`;
  });
  str = `${str}${footer}`;
  return str;
};
const addFooterToAutoMesage = ({
  msg,
  linkType
}) => {
  const footer = config.AUTO_SEND_MESSAGE_FOOTER || `\n\n✎ᴺᵒᵗᵉ ⁻ ᴵⁿˢᵗᵃˡˡ __APPNAME__ ᵀᵒ ᵂᵃᵗᶜʰ ᴼⁿˡⁱⁿᵉ`;
  const playerMap = {
    terabox: "Terabox",
    vivdisk: "VDX Player"
  };
  let str = playerMap[linkType] ? footer.replace(/__APPNAME__/g, playerMap[linkType]) : "";
  return `${msg}${str}`;
};
const getVivdiskTitle = url => {
  return new Promise((resolve, reject) => {
    xClient(url, ".video-durations@html")(function (err, title) {
      if (err) reject(err);
      console.log(title || title.trim());
      return resolve(title || title.trim());
    });
  });
};
const getTeraboxTitle = url => {
  return new Promise((resolve, reject) => {
    xClient(url, "title")(function (err, title) {
      if (err) reject(err);
      const newTitle = title.split("- Share Files")[0] || "";
      const finalTitle = newTitle.trim();
      console.log(finalTitle);
      return resolve(finalTitle);
    });
  });
};
const indexOfAll = (array, searchItem) => {
  let i = array.indexOf(searchItem),
    indexes = [];
  while (i !== -1) {
    indexes.push(i);
    i = array.indexOf(searchItem, ++i);
  }
  return indexes;
};
const getMessageBoldEntities = clStr => {
  var urlRegex = /(https?:\/\/[^\s]+)|(@[a-zA-Z0-9_-]*)/g;
  const urls = clStr.match(urlRegex) || [];
  const resultObj = {};
  return urls.reduce((acArr, element, index) => {
    let aUrl = urls[index];
    const allIndex = indexOfAll(clStr, aUrl);
    if (!resultObj[aUrl]) {
      resultObj[aUrl] = allIndex;
      return uniqBy([...acArr, ...allIndex.map(e => ({
        offset: e,
        length: aUrl.length,
        type: "bold"
      }))], "offset");
    } else {
      return acArr;
    }
  }, []);
};
module.exports = {
  setBot,
  approveChatJoinRequest,
  declineChatJoinRequest,
  getBotInstanseAndSleep,
  sleep,
  getFileData,
  sendMessage,
  getVivdiskTitle,
  addFooterToAutoMesage,
  convertMessageBody,
  indexOfAll,
  getMessageBoldEntities,
  getTeraboxTitle
};