"use strict";

var Xray = require("x-ray");
var x = Xray();

// x(
//   "https://vivdisk.com/convertor/play/WiQQce",
//   ".video-durations@html"
// )(function (err, title) {
//   console.log(`==${title.trim()}==`); // Google
// });

// x("https://vivdisk.com/convertor/play/WiQQce", ".disk-details", ["span@html"])(function (err, ...rest) {
//   console.log(rest); // Google
// });

// x(
//   "https://vivdisk.com/convertor/play/WiQQce",
//   ".disk-video",
//   "a@href"
// )(function (err, ...rest) {
//   console.log(rest); // Google
// });

x("https://teraboxapp.com/s/1Eos7hTbZrdwUQVENu9iWGw", ".main-box@html")(function (err, ...rest) {
  console.log("err", err);
  console.log("rest", rest); // Google
});

x("https://teraboxapp.com/s/1Eos7hTbZrdwUQVENu9iWGw", "title")(function (err, title) {
  const newTitle = title.split("- Share Files")[0];
  console.log(newTitle); // Google
});

// #cover > div.video-durations.t-14.t-white
// #app > div > div.disk-details > div > span.info-time