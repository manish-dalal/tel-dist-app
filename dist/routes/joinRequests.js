"use strict";

const express = require("express");

const config = require("../config");

const axios = require("axios");

const {
  Logger
} = require("../utils/winston");

const botMethods = require("../lib/botMethods");

const MONGO_API_URL = config.MONGO_API_URL;
const router = express.Router();
const apiUrl = `${MONGO_API_URL}/joinrequest`;
router.post("/all", async (req, res) => {
  const body = req.body;
  body["data"]["token"] = config.TELEGRAM_TOKEN;
  const {
    data
  } = await axios.post(apiUrl, body);

  if (!data) {
    Logger.error("Error chat requests");
    res.send({
      error: true,
      errorMessage: "Error message"
    });
  } else {
    res.send({
      error: false,
      message: "success",
      data
    });
  }
});
router.post("/approve", async (req, res) => {
  const body = req.body;
  const {
    requests = []
  } = body;

  try {
    for (const request of requests) {
      const res = await botMethods.approveChatJoinRequest(request.chat.id, request.from.id);
    }

    const newBody = {
      action: "remove",
      data: {
        ids: requests.map(e => ({
          $oid: e._id
        }))
      }
    };
    newBody["data"]["token"] = config.TELEGRAM_TOKEN;
    const {
      data
    } = await axios.post(apiUrl, newBody);
    res.send({
      error: false,
      message: "success",
      data
    });
  } catch (error) {
    Logger.error("Error approve chat requests", error.message);
    res.send({
      error: true,
      errorMessage: "Error message"
    });
  }
});
router.post("/reject", async (req, res) => {
  const body = req.body;
  const {
    requests = []
  } = body;

  try {
    for (const request of requests) {
      const res = await botMethods.declineChatJoinRequest(request.chat.id, request.from.id);
    }

    const newBody = {
      action: "remove",
      data: {
        ids: requests.map(e => ({
          $oid: e._id
        }))
      }
    };
    newBody["data"]["token"] = config.TELEGRAM_TOKEN;
    const {
      data
    } = await axios.post(apiUrl, newBody);
    res.send({
      error: false,
      message: "success",
      data
    });
  } catch (error) {
    Logger.error("Error Reject chat requests", error.message);
    res.send({
      error: true,
      errorMessage: "Error message"
    });
  }
});
module.exports = router;