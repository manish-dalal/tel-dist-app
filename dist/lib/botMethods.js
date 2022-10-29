"use strict";

const telegram = require("node-telegram-bot-api");
const config = require("../config");
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
module.exports = {
  setBot,
  approveChatJoinRequest,
  declineChatJoinRequest,
  getBotInstanseAndSleep,
  sleep
};