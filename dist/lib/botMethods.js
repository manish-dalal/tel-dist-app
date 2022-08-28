"use strict";

let telegramBot = null;

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

module.exports = {
  setBot,
  approveChatJoinRequest,
  declineChatJoinRequest
};