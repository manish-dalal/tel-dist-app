"use strict";

const axios = require("axios");
const getChatMembersCount = (token, chatId) => new Promise(async resolve => {
  try {
    const countResponse = await axios.get(`https://api.telegram.org/bot${token}/getChatMembersCount?chat_id=${chatId}`);
    const {
      result
    } = countResponse.data;
    return resolve(result);
  } catch (error) {
    return resolve(0);
  }
});
module.exports = getChatMembersCount;