"use strict";

const express = require("express");
const config = require("../config");
const axios = require("axios");
const isEmpty = require("lodash/isEmpty");
const get = require("lodash/get");
const {
  pushInMessageQueue,
  iMode,
  getProcessStats,
  getDataArray
} = require("../lib/botplugins");
const {
  getFullChannel
} = require("../lib/userMethods");
const {
  Logger
} = require("../utils/winston");
const getChatMembersCount = require("../utils/getChatMembersCount");
const serverUrl = config.SERVER_SITE;
let startQueue = [];
let channelMetaDataQueue = [];
let isQueueRunning = false;
setInterval(async () => {
  if (!isQueueRunning && (startQueue.length || channelMetaDataQueue.length)) {
    if (startQueue.length) {
      try {
        const tempstartQueue = [...startQueue];
        startQueue = [];
        isQueueRunning = true;
        for (const task of tempstartQueue) {
          const {
            categoryState = [],
            cname = "v1",
            linkType = "mdisk",
            channelName,
            backupChannelLink = "",
            thumbUrl,
            groupInfo,
            _id,
            isEuOrgLink = true,
            isNewMdisk,
            useCustomMessage,
            numberOfTimes = 1
          } = task;
          const newCategoryState = [];
          for (let cat of categoryState) {
            const {
              size = 40,
              page = 0,
              category = "",
              pageIncrementor = 1,
              isRealImage = false
            } = cat;
            let params = {
              category,
              cname,
              linkType,
              pageSize: size,
              page
            };
            const fetchMessages = [];
            let nextPage = 0;
            for (const [index, v] of Array(numberOfTimes).entries()) {
              const parsepageIncrementor = parseInt(pageIncrementor);
              const parsePage = parseInt(params.page);
              const url = new URL(`${serverUrl}/message/list`);
              url.search = new URLSearchParams(params);
              const messageResponse = await axios.get(url.href);
              const {
                totalpages,
                messages
              } = messageResponse.data;
              console.log("category=", category, "messages", messages.length, "totalpages", totalpages);
              const expectedNextPage = parsePage + parsepageIncrementor * (index + 1);
              nextPage = totalpages <= expectedNextPage ? parsePage % 2 : expectedNextPage;
              params.page = nextPage;
              fetchMessages.push(...messages);
            }
            newCategoryState.push({
              ...cat,
              page: nextPage
            });
            fetchMessages.forEach(element => {
              const thumbUrlObj = isRealImage ? {} : {
                thumbUrl
              };
              const msg = {
                ...element,
                targetChatId: groupInfo.id,
                ...thumbUrlObj,
                linkType,
                maniChannelName: channelName,
                backupChannelLink,
                isEuOrgLink,
                isNewMdisk,
                useCustomMessage
              };
              if (categoryState[categoryState.length - 1] === cat && fetchMessages[fetchMessages.length - 1] === element) {
                msg["additionalAction"] = async (errorMess = "") => {
                  const taskUpdateRes = await axios.put(`${serverUrl}/task/v1/${_id}`, {
                    status: errorMess || "active"
                  });
                  console.log("taskUpdateRes End", taskUpdateRes.data);
                };
              }
              pushInMessageQueue({
                msg,
                mode: iMode.DBMESSAGESENDER
              });
            });
          }
          const membersCount = await getChatMembersCount(config.TELEGRAM_TOKEN, groupInfo.id);
          const membersCountObj = membersCount ? {
            membersCount
          } : {};
          let taskUpdatedData = {
            status: "processing",
            lastExecuted: new Date(),
            ...membersCountObj,
            categoryState: newCategoryState
          };
          const taskUpdateRes = await axios.put(`${serverUrl}/task/v1/${_id}`, taskUpdatedData);
          console.log("taskRes start", taskUpdateRes.data);
        }
      } catch (error) {
        Logger.error("error startQueue" + error.message);
        isQueueRunning = false;
      }
    } else if (channelMetaDataQueue.length) {
      try {
        const tempstartQueue = [...channelMetaDataQueue];
        channelMetaDataQueue = [];
        isQueueRunning = true;
        for (const task of tempstartQueue) {
          const {
            groupInfo,
            _id
          } = task;
          const fullChat = await getFullChannel({
            telegramToken: config.TELEGRAM_TOKEN,
            channel: groupInfo.id
          });
          console.log("fullChat==", tempstartQueue.indexOf(task));
          console.log("fullChat==DATA", JSON.stringify(fullChat));
          const filteredfullChat = {};
          if (!isEmpty(fullChat.result)) {
            filteredfullChat["pts"] = get(fullChat, "result.fullChat.pts", 0);
            filteredfullChat["restrictionReason"] = get(fullChat, "result.chats[0].restrictionReason", null);
            const participantsCount = get(fullChat, "result.fullChat.participantsCount", 0);
            participantsCount && (filteredfullChat["membersCount"] = participantsCount);
          }
          const fullChatObj = !isEmpty(fullChat) ? {
            fullChat: filteredfullChat,
            membersCount: filteredfullChat.membersCount
          } : {};
          if (!isEmpty(fullChat.chatInvite)) {
            fullChatObj["groupInfo"] = {
              ...groupInfo,
              ...fullChat.chatInvite
            };
          }
          let taskUpdatedData = {
            ...fullChatObj
          };
          // console.log("taskUpdatedData", JSON.stringify(taskUpdatedData));
          const taskUpdateRes = await axios.put(`${serverUrl}/task/v1/${_id}`, taskUpdatedData);
          console.log("taskRes metaData updated", taskUpdateRes.data);
        }
      } catch (error) {
        Logger.error("error channelMetaDataQueue" + error.message);
        isQueueRunning = false;
      }
    }
    isQueueRunning = false;
  }
}, 30000);
const router = express.Router();
router.post("/add", async (req, res) => {
  const body = req.body;
  body.botToken = config.TELEGRAM_TOKEN;
  body.cname = body.cname || "v1";
  body.status = "active";
  const {
    data
  } = await axios.post(`${serverUrl}/task/v1/`, body);
  if (!data) {
    Logger.error("Error Add task");
    res.send({
      error: true,
      errorMessage: "Error message"
    });
  } else {
    res.send({
      error: false,
      message: "Task saved"
    });
  }
});
router.post("/update", async (req, res) => {
  const body = req.body;
  // body.botToken = config.TELEGRAM_TOKEN;
  body.cname = body.cname || "v1";
  const {
    data
  } = await axios.put(`${serverUrl}/task/v1/${body._id}`, body);
  if (!data) {
    Logger.error("Error update task");
    res.send({
      error: true,
      errorMessage: "Error message"
    });
  } else {
    res.send({
      error: false,
      message: "Task saved"
    });
  }
});
router.post("/remove", async (req, res) => {
  const body = req.body;
  const {
    data
  } = await axios.put(`${serverUrl}/task/v1/${body._id}`, {
    isDeleted: true
  });
  if (!data) {
    Logger.error("Error remove task");
    res.send({
      error: true,
      errorMessage: "Error message"
    });
  } else {
    res.send({
      error: false,
      message: "Task saved"
    });
  }
});
router.get("/list", async (req, res) => {
  try {
    const {
      data
    } = await axios.get(`${serverUrl}/task/v1/list?botToken=${config.TELEGRAM_TOKEN}`);
    res.json({
      error: false,
      ...data
    });
  } catch (e) {
    Logger.error(e.message || "tasklist error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
router.post("/start", async (req, res) => {
  try {
    for (const task of req.body) {
      startQueue.push(task);
    }
    console.log("Send add response");
    res.json({
      error: false,
      msg: "Added in Queue"
    });
  } catch (e) {
    // console.log("eeeeee", e);
    Logger.error(e.message || "taskstart error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
router.get("/getFullChat", async (req, res) => {
  try {
    const {
      channel
    } = req.query;
    const fullChat = await getFullChannel({
      channel,
      maxRetry: 0
    });
    // console.log("getFullChat response=", JSON.stringify(fullChat));
    res.json(fullChat);
  } catch (e) {
    // console.log("eeeeee", e);
    Logger.error(e.message || "getFullChat error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
router.get("/getMetaData", async (req, res) => {
  try {
    const {
      linkType
    } = req.query;
    const {
      data
    } = await axios.get(`${serverUrl}/task/v1/list?botToken=${config.TELEGRAM_TOKEN}`);
    for (const task of data.tasks) {
      channelMetaDataQueue.push(task);
    }
    console.log("Send add response", data.tasks.length);
    res.json({
      error: false,
      msg: "Added meta Queue"
    });
  } catch (e) {
    // console.log("eeeeee", e);
    Logger.error(e.message || "taskmeta error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
router.get("/autostartbot", async (req, res) => {
  try {
    const {
      linkType,
      numberOfTimes = 1
    } = req.query;
    const {
      data
    } = await axios.get(`${serverUrl}/task/v1/list?botToken=${config.TELEGRAM_TOKEN}&linkType[0]=${linkType}`);
    for (const task of data.tasks) {
      startQueue.push(task.map(e => ({
        ...e,
        numberOfTimes
      })));
    }
    console.log("Send add response", data.tasks.length);
    res.json({
      error: false,
      msg: "Added in Queue"
    });
  } catch (e) {
    // console.log("eeeeee", e);
    Logger.error(e.message || "taskstart error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
router.get("/backupMessage", async (req, res) => {
  try {
    const defaultText = `Friends Nowadays Telegram Is Banning Many Movies Channels. Our Channels Also Got Banned. So, Please Join This Backup Channel For Future Updates.

  If Telegram Ban Our Channel We Will Give You New Channel Link On This Channel.  


दोस्तों आजकल टेलीग्राम कई चैनलों पर प्रतिबंध लगा रहा है। हमारे कई चैनलों पर भी प्रतिबंध लगा दिया। इसलिए, भविष्य के अपडेट के लिए कृपया इस बैकअप चैनल से जुड़ें। 
    
यदि टेलीग्राम द्वारा हमारे चैनल पर प्रतिबंध लगाया गया तो हम आपको इस चैनल पर नए चैनल लिंक देंगे ।
    
👇👇👇👇👇👇👇👇👇👇👇👇   
🔋🔋
Channel:-
_CHANNEL_
_CHANNEL_
_CHANNEL_
🔋🔋🔋`;
    const {
      linkType,
      text = defaultText,
      thumbUrl = "",
      channel = "",
      entities = ""
    } = req.query;
    const {
      data
    } = await axios.get(`${serverUrl}/task/v1/list?botToken=${config.TELEGRAM_TOKEN}&linkType[0]=${linkType}`);
    const filterData = data.tasks.filter(e => e.linkType === linkType);
    if (text) {
      filterData.forEach(el => {
        const mainChannel = channel ? channel : `@${el.channelName}`;
        const fText = text.replace(/_CHANNEL_/g, mainChannel);
        const entitiesObj = entities ? {
          entities,
          linkType
        } : {};
        const msg = {
          text: fText,
          targetChatId: el.groupInfo.id,
          maniChannelName: el.channelName,
          isEuOrgLink: false,
          isNewMdisk: false,
          thumbUrl,
          ...entitiesObj,
          ignoreRemoveChannelName: true
        };
        pushInMessageQueue({
          msg,
          mode: iMode.DBMESSAGESENDER
        });
      });
    }
    res.json({
      error: false,
      msg: text ? "Sucess" : "No text found"
    });
  } catch (e) {
    Logger.error(e.message || "tasklist error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});

// {
//   "msg": {
//     "imgDriveId": "1r-1bIKFFTIFDXGmVrzTrYkFmZAecOW3w",
//     "text": "Latest Exclusive ",
//     "cloudinaryUrl": "",
//     "targetChatId": -1001655567871,
//     "thumbUrl": "",
//     "linkType": "mdisk",
//     "maniChannelName": "primexmov",
//     "backupChannelLink": "",
//     "isEuOrgLink": true,
//     "isNewMdisk": false,
//     "useCustomMessage": false
//   },
//   "mode": 121
// },
router.post("/sendMessages", async (req, res) => {
  try {
    const defaultText = `..`;
    const {
      linkType,
      text = defaultText,
      thumbUrl = "",
      channels = "[]"
    } = req.body;
    const filterData = JSON.parse(channels);
    if (text) {
      filterData.forEach(el => {
        const msg = {
          text,
          targetChatId: `-100${el.channelId}`,
          maniChannelName: "",
          isEuOrgLink: false,
          isNewMdisk: false,
          thumbUrl,
          ignoreRemoveChannelName: true
        };
        pushInMessageQueue({
          msg,
          mode: iMode.DBMESSAGESENDER
        });
      });
    }
    res.json({
      error: false,
      msg: text ? "Sucess" : "No text found"
    });
  } catch (e) {
    Logger.error(e.message || "tasklist error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
router.get("/telegramget", async (req, res) => {
  try {
    const {
      data = {}
    } = await axios.get(req.query.url.replace("_bot_token_", config.TELEGRAM_TOKEN));
    return res.json({
      data
    });
  } catch (error) {
    Logger.error(error.message || "telegramget error occured");
    return res.json({
      error: true,
      error: error.message
    });
  }
});
router.get("/processStats", async (req, res) => {
  try {
    return res.json({
      isQueueRunning,
      ...getProcessStats()
    });
  } catch (error) {
    Logger.error(error.message || "processStats api error occured");
    return res.json({
      error: true,
      error: error.message
    });
  }
});
router.get("/dataarray", async (req, res) => {
  try {
    return res.json(getDataArray());
  } catch (error) {
    Logger.error(error.message || "getDataArray api error occured");
    return res.json({
      error: true,
      error: error.message
    });
  }
});
module.exports = router;