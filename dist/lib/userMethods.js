"use strict";

const {
  Api,
  TelegramClient
} = require("telegram");
const axios = require("axios");
const get = require("lodash/get");
const {
  StringSession
} = require("telegram/sessions");
const config = require("../config");

// TERABOX_ADMIN_USER_TOKEN
// JOIN_CHANNEL_USER_TOKEN
let teraboxAdminUserClient = null;
let joinChannelUserClient = null;
const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
const getUserClient = type => {
  return new Promise(async (resolve, reject) => {
    let userClient = type === "joinChannelAdmin" ? joinChannelUserClient : teraboxAdminUserClient;
    const userSessionToken = type === "joinChannelAdmin" ? config.JOIN_CHANNEL_USER_TOKEN : config.TERABOX_ADMIN_USER_TOKEN;
    if (userSessionToken && !userClient) {
      const apiId = 8779238;
      const apiHash = "41a0189c83fa2f1fb2805a37db370878";
      const session = new StringSession(userSessionToken || ""); // You should put your string session here
      userClient = new TelegramClient(session, apiId, apiHash, {
        connectionRetries: 2,
        autoReconnect: false
      });
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
const getChatInviteLink = (token, chatId) => {
  return new Promise(async resolve => {
    try {
      const chatInfo = await axios.get(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
      const {
        result
      } = chatInfo.data;
      return resolve(result);
    } catch (error) {
      return resolve({});
    }
  });
};
const joinChannel = async ({
  client,
  link
}) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (link) {
        const result = await client.invoke(new Api.messages.ImportChatInvite({
          hash: link.replace("https://t.me/+", "")
        }));
      }
      return resolve({});
    } catch (error) {
      return resolve({});
    }
  });
};
const getFullChannel = async ({
  telegramToken,
  channel,
  maxRetry = 1
}) => {
  return new Promise(async (resolve, reject) => {
    const client = await getUserClient("joinChannelAdmin");
    const chatInvite = telegramToken && (await getChatInviteLink(telegramToken, channel));
    const link = get(chatInvite, "invite_link", "");
    try {
      await sleep(10 * 1000);
      const result = await client.invoke(new Api.channels.GetFullChannel({
        channel
      }));
      return resolve({
        result,
        chatInvite
      });
    } catch (error) {
      if (maxRetry >= 0) {
        await joinChannel({
          link,
          client
        });
        const resData = await getFullChannel({
          telegramToken,
          channel,
          maxRetry: maxRetry - 1
        });
        return resolve(resData);
      }
      return resolve({});
    }
  });
};
module.exports = {
  convertTerboxLink,
  getFullChannel
};