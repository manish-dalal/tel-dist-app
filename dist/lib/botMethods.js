"use strict";

const telegram = require("node-telegram-bot-api");
const config = require("../config");
const Xray = require("x-ray");
const xClient = Xray();
const getDateString = () => {
  const date = new Date();
  const timestr = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const dateStr = `(${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear().toString().slice(-2)})`;
  return timestr + dateStr;
};
const token = config.TELEGRAM_TOKEN_1;
let bot1 = null;
if (token && !bot1) {
  bot1 = new telegram(token, {});
}
let lastTelgramSendRequest = new Date();
let lastTelgramSendRequest1 = new Date();
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
const validChatArr = {
  approved: [],
  pending: [],
  deny: []
};
const isBotAddedInChat = async (chatId, botInstance) => {
  if (validChatArr.approved.includes(chatId)) {
    return true;
  } else if (validChatArr.deny.includes(chatId)) {
    return false;
  } else {
    try {
      console.log("validChatArr", JSON.stringify(validChatArr), chatId);
      const respq = await botInstance.getChatAdministrators(chatId);
      validChatArr.approved.push(chatId);
      return true;
    } catch (error) {
      validChatArr.pending.push(chatId);
      if (validChatArr.pending.includes(chatId)) {
        validChatArr.deny.push(chatId);
      }
      return false;
    }
  }
};
const getBotInstanseAndSleep = async ({
  bot,
  chatId
}) => {
  const remaingTime = Math.max(7000 - (new Date().getTime() - lastTelgramSendRequest.getTime()), 0);
  const remaingTime1 = Math.max(7000 - (new Date().getTime() - lastTelgramSendRequest1.getTime()), 0);
  if (remaingTime > remaingTime1 && bot1) {
    console.log("remaingTime1", remaingTime1);
    await sleep(Math.max(remaingTime1, 0));
    const isBotAdmin = await isBotAddedInChat(chatId, bot1);
    if (isBotAdmin) {
      lastTelgramSendRequest1 = new Date();
      return bot1;
    }
  }
  console.log("remaingTime", remaingTime);
  await sleep(Math.max(remaingTime, 0));
  lastTelgramSendRequest = new Date();
  return bot;
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
const convertMessageBody = links => {
  const header = config.MESSAGE_HEADER || "📥 𝐃𝐨𝐰𝐧𝐥𝐨𝐚𝐝 𝐋𝐢𝐧𝐤𝐬/👀𝐖𝐚𝐭𝐜𝐡 𝐎𝐧𝐥𝐢𝐧𝐞\n\n";
  const footer = config.MESSAGE_FOOTER || `#𝗦𝗘𝗔𝗥𝗖𝗛 𝐓𝐆 ➤ @primexmov 🔍\n⬤▬▬▬▬▬▬▬▬▬▬▬▬▬⬤\nhttps://t.me/primexmov`;
  let str = header;
  links.forEach((el, index) => {
    str = `${str}Video ${index + 1}. 👉 ${el} \n\n`;
  });
  str = `${str}\n${footer}`;
  return str;
};
const getVivdiskTitle = url => {
  return new Promise((resolve, reject) => {
    xClient(url, ".video-durations@html")(function (err, title) {
      if (err) reject(err);
      console.log(title.trim());
      return resolve(title.trim());
    });
  });
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
  convertMessageBody
};