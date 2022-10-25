"use strict";

const express = require("express");

const config = require("../config");

const axios = require("axios");

const {
  pushInMessageQueue,
  iMode,
  getProcessStats
} = require("../lib/botplugins");

const {
  Logger
} = require("../utils/winston");

const serverUrl = config.SERVER_SITE;
const router = express.Router();
router.post("/add", async (req, res) => {
  const body = req.body;
  body.botToken = config.TELEGRAM_TOKEN;
  body.cname = body.cname || "v1";
  body.status = "active";
  const {
    data
  } = await axios.post(`${serverUrl}/task/`, body);

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
  const body = req.body; // body.botToken = config.TELEGRAM_TOKEN;

  body.cname = body.cname || "v1";
  const {
    data
  } = await axios.put(`${serverUrl}/task/${body._id}`, body);

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
  } = await axios.put(`${serverUrl}/task/${body._id}`, {
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
    } = await axios.get(`${serverUrl}/task/list?botToken=${config.TELEGRAM_TOKEN}`);
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
      const {
        size = 40,
        page = 0,
        category = "",
        cname = "v1",
        linkType = "mdisk",
        channelName,
        thumbUrl,
        groupInfo,
        _id,
        pageIncrementor = 1,
        isEuOrgLink = true,
        isNewMdisk
      } = task;
      let params = {
        category,
        cname,
        linkType,
        pageSize: size,
        page
      };
      const url = new URL(`${serverUrl}/message/list`);
      url.search = new URLSearchParams(params);
      const messageResponse = await axios.get(url.href);
      const {
        totalpages,
        messages
      } = messageResponse.data;
      const parsePage = parseInt(page);
      const parsepageIncrementor = parseInt(pageIncrementor);
      const expectedNextPage = parsePage + parsepageIncrementor;
      const nextPage = totalpages <= expectedNextPage ? parsePage % 2 : expectedNextPage;
      let taskUpdatedData = {
        status: "processing",
        lastExecuted: new Date()
      };

      if (!messages.length) {
        taskUpdatedData = {
          status: "Reset Active page",
          page: nextPage
        };
      }

      const taskUpdateRes = await axios.put(`${serverUrl}/task/${_id}`, taskUpdatedData);
      console.log("taskRes start", taskUpdateRes.data);
      messages.forEach(element => {
        const msg = { ...element,
          targetChatId: groupInfo.id,
          thumbUrl,
          maniChannelName: channelName,
          isEuOrgLink,
          isNewMdisk
        };

        if (messages[messages.length - 1] === element) {
          msg["additionalAction"] = async (errorMess = "") => {
            const taskUpdateRes = await axios.put(`${serverUrl}/task/${_id}`, {
              status: errorMess || "active",
              page: nextPage
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

    console.log("Send add response");
    res.json({
      error: false,
      msg: "Added in Queue"
    });
  } catch (e) {
    console.log("eeeeee", e);
    Logger.error(e.message || "taskstart error occured");
    res.json({
      error: true,
      errorMessage: e.message
    });
  }
});
router.get("/backupMessage", async (req, res) => {
  try {
    const defaultText = `Friends Now a days Telegram Is Banning Many Movies Channels. Our Channels Also Got Banned. So, Please Join This Backup Channel For Future Update.

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
      channel = ""
    } = req.query;
    const {
      data
    } = await axios.get(`${serverUrl}/task/list?botToken=${config.TELEGRAM_TOKEN}`);
    const filterData = data.tasks.filter(e => e.linkType === linkType);

    if (text) {
      filterData.forEach(el => {
        const mainChannel = channel ? channel : `@${el.channelName}`;
        const fText = text.replace(/_CHANNEL_/g, mainChannel);
        const msg = {
          text: fText,
          targetChatId: el.groupInfo.id,
          maniChannelName: el.channelName,
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
    return res.json(getProcessStats());
  } catch (error) {
    Logger.error(error.message || "processStats api error occured");
    return res.json({
      error: true,
      error: error.message
    });
  }
});
module.exports = router;