"use strict";

var Xray = require("x-ray");
var x = Xray();
x("https://vivdisk.com/convertor/play/WiQQce", ".video-durations@html")(function (err, ...rest) {
  console.log(rest); // Google
});

x("https://vivdisk.com/convertor/play/WiQQce", ".disk-details", ["span@html"])(function (err, ...rest) {
  console.log(rest); // Google
});

x("https://vivdisk.com/convertor/play/WiQQce", ".disk-video", "a@href")(function (err, ...rest) {
  console.log(rest); // Google
});

// #cover > div.video-durations.t-14.t-white
// #app > div > div.disk-details > div > span.info-time