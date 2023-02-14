"use strict";

// const disk = require("diskusage");
const prettyBytes = require("../utils/prettyBytes");
const os = require("os");
let osPath = os.platform() === "win32" ? "c:" : "/";
async function diskinfo(path = osPath) {
  try {
    // const res = await disk.check(path);
    const {
      available,
      free,
      total
    } = {};
    return {
      path,
      available: prettyBytes(available),
      free: prettyBytes(free),
      total: prettyBytes(total)
    };
  } catch (e) {
    console.log(e);
    return e.message;
  }
}
module.exports = diskinfo;