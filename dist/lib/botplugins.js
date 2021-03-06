"use strict";

const {
  uploadFileStream
} = require("../utils/gdrive");

const config = require("../config");

const axios = require("axios");

const _ = require("lodash");

const {
  tall
} = require("tall");

var emojiStrip = require("emoji-strip");

const {
  Logger
} = require("../utils/winston");

const {
  getCloudinarySignature
} = require("../utils/getCloudinarySignature");

let dataArray = [];
let isMessageProcessing = false;
let processStats = {};
const iMode = {
  THUMB: 1,
  CHANNELREMOVER: 2,
  COIN: 3,
  MDISK: 4,
  DUPLICATE: 5,
  MDISKDUPLICATE: 6,
  SAVEDB: 7,
  DBMESSAGESENDER: 121,
  MESSAGEINFO: 8
};
const replaceTextArr = JSON.parse(config.REPLACE_TEXTS);
const replaceWords = replaceTextArr.filter(el => !el.includes(" ")); // get

const infoUrl = "https://diskuploader.mypowerdisk.com/v1/tp/filename"; // params = { token: 'l3ae9WQ7ru5ys5Dxxc3O', rid: 'MZdAES ' };
// post

const renameUrl = "https://diskuploader.mypowerdisk.com/v1/tp/info"; // param = {'token': 'l3ae9WQ7ru5ys5Dxxc3O','rid':'MZdAES','filename':'name_1'}

const mongoApiUrl = config.MONGO_API_URL === "null" ? "" : config.MONGO_API_URL || "https://data.mongodb-api.com/app/tracker1-smsai/endpoint";

const getDateString = () => {
  const date = new Date();
  const timestr = `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
  const dateStr = `(${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear().toString().slice(-2)})`;
  return timestr + dateStr;
};

const getFileData = (msg, activeLinkType) => {
  let mimeType = "";
  let fileName = "";
  let fileId = "";

  if (msg.document) {
    mimeType = msg.document.mimeType;
    fileName = msg.document.file_name;
    fileId = msg.document.file_id;
  } else if (msg.video) {
    mimeType = msg.video.mimeType;
    fileName = msg.video.file_name;
    fileId = msg.video.file_id;
  } else if (msg.audio) {
    mimeType = msg.audio.mimeType;
    fileName = msg.audio.file_name;
    fileId = msg.audio.file_id;
  } else if (msg.photo) {
    const lastPhoto = msg.photo[msg.photo.length - 1];
    mimeType = (lastPhoto === null || lastPhoto === void 0 ? void 0 : lastPhoto.mimeType) || "image/jpeg";
    fileName = `${activeLinkType}-${getDateString()}-${msg.message_id}.jpeg`;
    fileId = lastPhoto.file_id;
  }

  return {
    mimeType,
    fileName,
    fileId
  };
};

const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

const removeUsername = (str, maniChannelName = config.CHANNEL) => {
  const channelName = "@" + maniChannelName;
  const newStr = replaceTextArr.reduce((ac = "", cu) => {
    const re = new RegExp(cu, "gi");
    return ac.replace(re, "");
  }, str);
  const msgLines = newStr.split("\n");
  const finalStr = msgLines.map((line, lineNumber) => {
    const strArr = line.trimStart().split(" ");
    const newStrArr = strArr.map((el = "") => {
      const elLower = el.toLowerCase().trim();

      if (el === "@") {
        return channelName;
      } else if (el.includes("@")) {
        if ((lineNumber === 0 || lineNumber === 1) && !el.startsWith("@")) {
          return el;
        } else {
          return el.replace(/@.[a-zA-Z0-9_-]*/g, channelName);
        }
      } else if (el.includes("t.me") || el.includes("telegra.ph")) {
        if (el.lastIndexOf("/") >= 0) {
          return el.slice(0, el.lastIndexOf("/") + 1) + maniChannelName;
        } else {
          return channelName;
        }
      }

      return el;
    });
    return newStrArr.join(" ");
  });
  return finalStr.join("\n");
};

const mdiskUp = async (url, maniChannelName = config.CHANNEL) => {
  let link = url;

  try {
    if (link.includes("bit")) {
      const unshortenedUrl = await tall(link);
      link = unshortenedUrl;
    }

    if (link.includes("mdisk") && config.MDISK_TOKEN) {
      const reqUrl = "https://diskuploader.mypowerdisk.com/v1/tp/cp";
      const param = {
        token: config.MDISK_TOKEN,
        link: link
      };
      const res = await axios.post(reqUrl, param);
      console.log("mdisk data", res.data);

      const newLink = _.get(res, "data.sharelink", _.get(res, "data.msg", "")); // Rename video name


      const elArr = newLink.split("/");
      const videoRid = elArr[elArr.length - 1];
      let params = {
        token: config.MDISK_TOKEN,
        rid: videoRid
      };
      const url = new URL(infoUrl);
      url.search = new URLSearchParams(params);
      const mdiskLinkInfo = await axios.get(url.href);

      const originalName = _.get(mdiskLinkInfo, "data.filename", "");

      let filename = emojiStrip(originalName).replace(/@.[a-zA-Z0-9_-]*/g, `@${maniChannelName}`);
      filename = replaceWords.reduce((ac, cu) => {
        const re = new RegExp(cu, "gi"); // const re = new RegExp(`\\b${cu}\\b`, "gi");

        return ac.replace(re, "");
      }, filename);

      if (filename !== originalName) {
        params["filename"] = filename.replace(/[`~!#$%^&*()|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, " ");
        axios.post(renameUrl, params);
      }

      return newLink;
    } else if (link.includes("doo") && config.DOODSTREAM_API_KEY) {
      const reqUrl = `https://doodapi.com/api/upload/url?key=${config.DOODSTREAM_API_KEY}&url=${link}`;
      const res = await axios.get(reqUrl); // console.log("Doodstream data", res.data);

      const filecode = _.get(res, "data.result.filecode", _.get(res, "data.msg", ""));

      const newLink = filecode !== "No file" ? "https://dood.sh/d/" + filecode : "";
      return newLink;
    } else {
      return "";
    }
  } catch (error) {
    Logger.error(error.message || "mdiskUp error occured");
    return "";
  }
};

const newCoinLink = link => {
  const linkArr = link.split("/");
  const v_id = linkArr[linkArr.length - 1];
  const converted_link = link.includes("mdisk.me") ? `https://mdisk.eu.org/${v_id}` : `https://dood.eu.org/${v_id}`;
  return converted_link;
};

const duplicateFinder = async link => {
  try {
    const linkArr = link.split("/");
    const v_id = linkArr[linkArr.length - 1];
    const params = {
      link
    };

    if (config.CNAME) {
      params.cname = config.CNAME;
    }

    if (link.includes("mdisk")) {
      const mdiskInfoUrl = `https://diskuploader.entertainvideo.com/v1/file/cdnurl?param=${v_id}`;
      const {
        data: mdiskLinkInfo
      } = await axios.get(mdiskInfoUrl);

      if (mdiskLinkInfo.source) {
        params["source"] = mdiskLinkInfo.source;
      }
    } else if (link.includes("dood.")) {
      const {
        data: res1
      } = await axios.get(`https://doodapi.com/api/file/info?key=${config.DOODSTREAM_API_KEY}&file_code=${v_id}`);

      const info = _.get(res1, "result[0]", {});

      params.length = info.length;
      params.title = info.title;
    }

    let u_url = link;

    if (mongoApiUrl) {
      const url = `${mongoApiUrl}/r1addurl`;
      const {
        data
      } = await axios.post(url, params);
      console.log("Insert into DB", data);

      const errorMsg = _.get(data, "msg", "");

      if (errorMsg.includes("Already have url")) {
        u_url = "";
      }
    }

    return u_url;
  } catch (error) {
    console.log("error", error);
    return "";
  }
};

const getConvertedLink = async (urls, mode) => {
  const new_urls = [];
  const urls_dict = {};

  for (const i of urls || []) {
    if (urls_dict[i]) {
      new_urls.push(urls_dict[i]);
    } else {
      let converted_link = "";

      switch (mode) {
        case iMode.DUPLICATE:
          converted_link = await duplicateFinder(i);
          break;

        case iMode.COIN:
          converted_link = newCoinLink(i);
          break;

        case iMode.CHANNELREMOVER:
          converted_link = i;
          break;

        case iMode.MDISK:
          await sleep(0.2);
          converted_link = await mdiskUp(i);
          break;

        case iMode.MDISKDUPLICATE:
          await sleep(0.2);
          const temp_link = await mdiskUp(i);
          converted_link = temp_link ? await duplicateFinder(temp_link) : "";
          break;
      }

      urls_dict[i] = converted_link;
      new_urls.push(converted_link);
    }
  }

  return new_urls;
};

const multiLinkCon = async (mlStr, mode, maniChannelName = config.CHANNEL) => {
  const clStr = removeUsername(mlStr, maniChannelName);
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = clStr.match(urlRegex);
  const newUrls = await getConvertedLink(urls, mode);

  if (!newUrls.filter(n => n).length) {
    // No link in msg
    return "";
  }

  const finalStr = urls.reduce((acStr, element, index) => {
    return acStr.replace(urls[index], newUrls[index]);
  }, clStr);
  return finalStr;
};

const processMessages = async bot => {
  // console.log("isMessageProcessing", isMessageProcessing);
  // console.log("dataArray", JSON.stringify(dataArray));
  if (dataArray.length && !isMessageProcessing) {
    isMessageProcessing = true;
    const tempData = dataArray;
    dataArray = [];
    let lastMessageData = {};

    for (const el of tempData) {
      var _msg$chat;

      const {
        msg = {},
        match,
        mode,
        category,
        activeLinkType
      } = el;
      processStats.total = tempData.length;
      processStats.current = tempData.indexOf(el) + 1;
      processStats.nextData = dataArray.length;
      console.log("inddddddex", processStats.current, "of ", processStats.total);
      console.log("Next data Length", processStats.nextData);
      const chatId = msg === null || msg === void 0 ? void 0 : (_msg$chat = msg.chat) === null || _msg$chat === void 0 ? void 0 : _msg$chat.id;

      try {
        // for for saving message to db
        if (mode === iMode.SAVEDB && mongoApiUrl) {
          try {
            let imgDriveId = "";
            let cloudinaryUrl = "";
            const clStr = removeUsername(msg.caption || msg.text);

            if (msg.photo) {
              const {
                mimeType,
                fileName,
                fileId
              } = getFileData(msg, activeLinkType);
              const uploadedFile = await uploadFileStream(fileName, bot.getFileStream(fileId));
              imgDriveId = uploadedFile.data.id;
              const sigData = getCloudinarySignature(`${activeLinkType}1`);

              if (imgDriveId && sigData.apikey && sigData.signature) {
                try {
                  const formData = new URLSearchParams(); // `https://drive.google.com/uc?export=view&id=${imgDriveId}`

                  const driveUrl = `${config.SITE}api/v1/drive/file/temp.jpg?id=${imgDriveId}`;
                  formData.append("file", driveUrl);
                  formData.append("api_key", sigData.apikey);
                  formData.append("timestamp", sigData.timestamp);
                  formData.append("signature", sigData.signature);
                  formData.append("folder", sigData.folder);
                  const url = "https://api.cloudinary.com/v1_1/" + sigData.cloudname + "/auto/upload";
                  const {
                    data: cuData = {}
                  } = await axios.post(url, formData);
                  cloudinaryUrl = cuData.secure_url;
                } catch (cuerror) {
                  console.log("cuerror", cuerror);
                }
              }
            }

            const params = {
              imgDriveId,
              text: clStr,
              category: category.toString(),
              linkType: activeLinkType
            };

            if (cloudinaryUrl && cloudinaryUrl.length) {
              params.cloudinaryUrl = cloudinaryUrl;
            }

            if (config.CNAME) {
              params.cname = config.CNAME;
            }

            const res1 = await axios.post(`${mongoApiUrl}/savemessage`, params); // if (lastMessageData.message_id && chatId === lastMessageData.chat.id) {
            //   bot.deleteMessage(chatId, lastMessageData.message_id);
            // }
            // const messageData = await bot.sendMessage(chatId, `Uploaded ${tempData.indexOf(el) + 1}/${tempData.length}`);
            // lastMessageData = messageData;
          } catch (error) {
            Logger.error(error.message || "SaveMsg error occured");
          }
        } else if (mode === iMode.MDISK || mode === iMode.DUPLICATE || mode === iMode.COIN || mode === iMode.MDISKDUPLICATE || mode === iMode.CHANNELREMOVER) {
          const convertedStr = await multiLinkCon(msg.caption || msg.text, mode);

          if ((msg.document || msg.video || msg.audio || msg.photo) && convertedStr) {
            const {
              fileId
            } = getFileData(msg);
            const opts = {
              caption: convertedStr
            };

            if (msg.document) {
              await bot.sendDocument(chatId, fileId, opts);
            } else if (msg.video) {
              await bot.sendVideo(chatId, fileId, opts);
            } else if (msg.audio) {
              await bot.sendAudio(chatId, fileId, opts);
            } else if (msg.photo) {
              await bot.sendPhoto(chatId, fileId, opts);
            }
          } else if (msg.text && convertedStr) {
            await bot.sendMessage(chatId, convertedStr);
          }
        } else if (mode === iMode.THUMB) {
          const clStr = removeUsername(msg.caption || msg.text);
          const opts = {
            caption: clStr
          };
          await bot.sendPhoto(chatId, config.THUMB_FILE_ID, opts);
        } else if (mode === iMode.DBMESSAGESENDER) {
          let imageUrl = "";

          try {
            const {
              targetChatId,
              additionalAction,
              thumbUrl = "",
              imgDriveId = "",
              maniChannelName = config.CHANNEL,
              isNewMdisk = false,
              isEuOrgLink = true,
              cloudinaryUrl
            } = msg;
            await sleep(7000);
            let clStr = removeUsername(msg.text, maniChannelName);
            const clStrTemp = isNewMdisk ? await multiLinkCon(clStr, iMode.MDISK, maniChannelName) : clStr;
            clStr = isEuOrgLink ? await multiLinkCon(clStrTemp, iMode.COIN, maniChannelName) : clStrTemp;
            const opts = {
              caption: clStr.slice(0, 1025)
            };

            if (additionalAction) {
              opts["reply_markup"] = {
                inline_keyboard: [[{
                  text: additionalAction ? "???? Join Backup Channel ????" : "???????? All Channel Link ??????????",
                  url: `https://t.me/${maniChannelName}`
                }]]
              };
            }

            if (thumbUrl || imgDriveId || cloudinaryUrl) {
              const tempUrl = `${config.SITE}api/v1/drive/file/temp.jpg?id=${imgDriveId}`;
              imageUrl = thumbUrl || (cloudinaryUrl ? `${cloudinaryUrl}?${(Math.random() * 100).toFixed()}` : tempUrl); // `https://drive.google.com/uc?export=view&id=${imgDriveId}`;

              console.log("imageUrl##", imageUrl);
              const sendData = await bot.sendPhoto(targetChatId, imageUrl, opts); // console.log("sendData###", sendData);
            } else {
              await bot.sendMessage(targetChatId, clStr);
            }

            additionalAction && additionalAction();
          } catch (errorDb) {
            msg.additionalAction && msg.additionalAction(errorDb.message);
            console.log("errorDb#####", errorDb.message);
            Logger.error(`DBMESSAGESENDER  ${errorDb.message}` || "Sendgp error occured");
            Logger.error(`Img=  ${imageUrl}`); // Logger.error(serializeError(errorDb) || "serializeError====");
          }
        } else if (mode === iMode.MESSAGEINFO) {
          msg.text && delete msg.text;
          msg.caption && delete msg.caption;
          msg.caption_entities && delete msg.caption_entities;
          await bot.sendMessage(chatId, JSON.stringify(msg, null, 4));
        }
      } catch (error) {
        isMessageProcessing = false;
        Logger.error(error.message || "An error occured"); // Logger.error(serializeError(error) || "serializeError====error ");

        bot.sendMessage(chatId, error.message || "An error occured");
      }

      if (el === tempData[tempData.length - 1]) {
        isMessageProcessing = false;
        console.log("I am free. Next data=", dataArray.length);
      }
    } // isMessageProcessing = false;

  }
};

const pushInMessageQueue = element => {
  dataArray.push(element);
};

const getProcessStats = () => processStats;

module.exports = {
  processMessages,
  pushInMessageQueue,
  iMode,
  getProcessStats
};