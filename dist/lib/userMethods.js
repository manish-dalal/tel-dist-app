"use strict";

const {
  Api,
  TelegramClient
} = require("telegram");
const {
  StringSession
} = require("telegram/sessions");
const config = require("../config");
let userClient = null;
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
const getUserClient = () => {
  return new Promise(async (resolve, reject) => {
    if (config.USER_TOKEN && !userClient) {
      const apiId = 8779238;
      const apiHash = "41a0189c83fa2f1fb2805a37db370878";
      const session = new StringSession(config.USER_TOKEN || ""); // You should put your string session here
      userClient = new TelegramClient(session, apiId, apiHash, {});
      await userClient.connect();
      return resolve(userClient);
    }
    return resolve(userClient);
  });
};
const checkConvertedWait = async ({
  link,
  numOfAttempt = 0,
  message
}) => {
  return new Promise(async (resolve, reject) => {
    const client = await getUserClient();
    await sleep(8000 * (numOfAttempt + 1));
    const result = await client.invoke(new Api.messages.GetHistory({
      peer: "@LinkConvertTerabot",
      addOffset: 0,
      limit: 4,
      maxId: 0,
      minId: 0
    }));
    const messages = result.messages;
    const fromId = message.fromId.userId;
    if (!messages[0].fromId && messages[0].message !== link) {
      return resolve(messages[0].message);
    } else if (numOfAttempt > 1) {
      return resolve("");
    } else {
      const resp = await checkConvertedWait({
        link,
        numOfAttempt: numOfAttempt + 1,
        message
      });
      return resolve(resp);
    }
  });
};
const convertTerboxLink = async ({
  link,
  numOfAttempt = 0
}) => {
  const client = await getUserClient();
  if (client) {
    const aaa = await client.sendMessage("@LinkConvertTerabot", {
      message: link
    });
    const resp = await checkConvertedWait({
      link,
      numOfAttempt: 0,
      message: aaa
    });
    if (resp !== link) {
      return resp;
    } else if (numOfAttempt > 0) {
      return "";
    } else {
      return convertTerboxLink({
        link,
        numOfAttempt: numOfAttempt + 1
      });
    }
  } else {
    return "";
  }
};
module.exports = {
  convertTerboxLink
};