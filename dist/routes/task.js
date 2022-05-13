const express = require("express");

const config = require("../config");

const axios = require("axios");

const {
  pushInMessageQueue,
  iMode
} = require("../lib/botplugins");

const {
  Logger
} = require("../utils/winston");

const serverUrl = config.SERVER_SITE;
const router = express.Router();
router.post("/add", async (req, res) => {
  const body = req.body;
  body.botToken = config.TELEGRAM_TOKEN;
  body.cname = config.CNAME;
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
        pageIncrementor = 1
      } = task;
      const taskUpdateRes = await axios.put(`${serverUrl}/task/${_id}`, {
        status: "processing",
        lastExecuted: new Date()
      });
      console.log("taskRes start", taskUpdateRes.data);
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
      messages.forEach(element => {
        const msg = {
          targetChatId: groupInfo.id,
          thumbUrl,
          imgDriveId: element.imgDriveId,
          maniChannelName: channelName,
          text: element.text
        };

        if (messages[messages.length - 1] === element) {
          msg["additionalAction"] = async (errorMess = "") => {
            const parsePage = parseInt(page);
            const parsepageIncrementor = parseInt(pageIncrementor);
            const nextPage = totalpages === parsePage ? 0 : parsePage + parsepageIncrementor;
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
module.exports = router;