const winston = require("winston");

const winstonDailyRotateFile = require("winston-daily-rotate-file");

const path = require("path");

const datePattern = `YYYY-MM-DD`;
const errorLogTransport = new winstonDailyRotateFile({
  level: "error",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/errorLogs/log"),
  maxFiles: "7d"
});
const infoLogTransport = new winstonDailyRotateFile({
  level: "info",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/infoLogs/log"),
  maxFiles: "7d"
});
const warnLogTransport = new winstonDailyRotateFile({
  level: "warn",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/warnLogs/log"),
  maxFiles: "7d"
});
const debugLogTransport = new winstonDailyRotateFile({
  level: "debug",
  datePattern,
  filename: path.join(__dirname, "../winstonLogs/debugLogs/log"),
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
  error: (msg, ...other) => LoggerJSON.error.log("error", msg, ...other),
  info: (msg, ...other) => LoggerJSON.info.log("info", msg, ...other),
  warn: (msg, ...other) => LoggerJSON.warn.log("warn", msg, ...other),
  debug: (msg, ...other) => LoggerJSON.debug.log("debug", msg, ...other)
};
module.exports = {
  Logger,
  LoggerJSON
};