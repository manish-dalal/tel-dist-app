"use strict";

const express = require("express");

const config = require("../config");

const axios = require("axios");

const set = require("lodash/set");

const {
  Logger
} = require("../utils/winston");

const botMethods = require("../lib/botMethods");

const MONGO_API_URL = config.MONGO_API_URL;
const router = express.Router();
const apiUrl = `${MONGO_API_URL}/joinrequest`;
router.post("/all", async (req, res) => {
  const body = req.body;
  set(body, "data.token", config.TELEGRAM_TOKEN);
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

const deleteRequests = async (ids = []) => {
  const newBody = {
    action: "remove",
    data: {
      ids,
      token: config.TELEGRAM_TOKEN
    }
  };
  const res = await axios.post(apiUrl, newBody);
  return res;
};

router.post("/approve", async (req, res) => {
  const body = req.body;
  const {
    requests = []
  } = body;
  const newIds = [];

  for (const request of requests) {
    try {
      const res = await botMethods.approveChatJoinRequest(request.chat.id, request.from.id);
      newIds.push({
        $oid: request._id
      });
    } catch (error) {
      Logger.error("Error approve chat requests", error.message);
    }
  }

  const {
    data
  } = await deleteRequests(newIds);
  res.send({
    error: false,
    message: "success",
    data
  });
});
router.post("/reject", async (req, res) => {
  const body = req.body;
  const {
    requests = []
  } = body;
  const newIds = [];

  for (const request of requests) {
    try {
      const res = await botMethods.declineChatJoinRequest(request.chat.id, request.from.id);
      newIds.push({
        $oid: request._id
      });
    } catch (error) {
      Logger.error("Error Reject chat requests", error.message);
    }
  }

  const {
    data
  } = await deleteRequests(newIds);
  res.send({
    error: false,
    message: "success",
    data
  });
});
module.exports = router;