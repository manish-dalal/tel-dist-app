"use strict";

const winston = require("winston");
const winstonDailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const logger = require("./logger");
const datePattern = `YYYY-MM-DD`;
const errorLogTransport = new winstonDailyRotateFile({
  level: "error",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/error-%DATE%.txt"),
  maxFiles: "7d"
});
const infoLogTransport = new winstonDailyRotateFile({
  level: "info",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/info-%DATE%.txt"),
  maxFiles: "7d"
});
const warnLogTransport = new winstonDailyRotateFile({
  level: "warn",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/warn-%DATE%.txt"),
  maxFiles: "7d"
});
const debugLogTransport = new winstonDailyRotateFile({
  level: "debug",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/debug-%DATE%.txt"),
  maxFiles: "7d"
});
const LoggerJSON = {
  error: winston.createLogger({
    transports: [errorLogTransport]
  }),
  info: winston.createLogger({
    transports: [infoLogTransport]
  }),
  warn: winston.createLogger({
    transports: [warnLogTransport]
  }),
  debug: winston.createLogger({
    transports: [debugLogTransport]
  })
};
const Logger = {
  error: (msg, ...other) => {
    logger("error ", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`);
    return LoggerJSON.error.log("error", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`, ...other);
  },
  info: (msg, ...other) => {
    logger("info ", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`);
    return LoggerJSON.info.log("info", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`, ...other);
  },
  warn: (msg, ...other) => {
    logger("warn ", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`);
    return LoggerJSON.warn.log("warn", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`, ...other);
  },
  debug: (msg, ...other) => {
    logger("debug ", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`);
    return LoggerJSON.debug.log("debug", `${new Date().toLocaleTimeString("en-IN")}=> ${msg}`, ...other);
  }
};
module.exports = {
  Logger,
  LoggerJSON
};