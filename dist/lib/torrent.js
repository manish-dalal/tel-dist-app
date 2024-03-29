"use strict";

function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const WebTorrent = require("webtorrent");
const fs = require("fs");
const prettyBytes = require("../utils/prettyBytes");
const humanTime = require("../utils/humanTime");
const mkfile = require("../utils/mkfile");
const ziper = require("../utils/ziper");
const {
  uploadWithLog
} = require("../utils/gdrive");
const config = require("../config");
const site = config.SITE || "SET SITE ENVIORMENT VARIABLE. READ DOCS";
if (!site) console.log("SET SITE ENVIORMENT VARIABLE. READ DOCS\n");
class Torrent {
  constructor() {
    _defineProperty(this, "statusLoader", torrent => {
      return {
        status: torrent.done ? "Downloaded" : torrent.name ? "Downloading" : "Getting metadata",
        magnetURI: torrent.magnetURI,
        name: torrent.name,
        speed: `${prettyBytes(torrent.downloadSpeed)}/s`,
        downloaded: prettyBytes(torrent.downloaded),
        total: prettyBytes(torrent.length),
        progress: parseInt(torrent.progress * 100),
        timeRemaining: parseInt(torrent.timeRemaining),
        redableTimeRemaining: humanTime(torrent.timeRemaining),
        downloadLink: `${site}downloads/${torrent.infoHash}`,
        done: torrent.done
      };
    });
    _defineProperty(this, "download", (magnetURI, onStart, onDone, onDriveUpload, onDriveUploadStart) => {
      if (!this.client.get(magnetURI)) {
        const torrent = this.client.add(magnetURI);
        torrent.once("metadata", () => {
          if (onStart) onStart(this.get(torrent.magnetURI));
        });
        torrent.once("done", () => {
          this.saveFiles(torrent, onDriveUpload, onDriveUploadStart);
          if (onDone) onDone(this.get(torrent.magnetURI));
        });
        return torrent;
      } else if (!this.client.get(magnetURI).done) {
        const torrent = this.client.get(magnetURI);
        return torrent;
      } else {
        const torrent = this.client.get(magnetURI);
        if (onDone) onDone(this.get(this.client.get(magnetURI).magnetURI));
        return torrent;
      }
    });
    _defineProperty(this, "remove", magnetURI => {
      this.client.get(magnetURI) ? this.client.remove(magnetURI) : undefined;
      return null;
    });
    _defineProperty(this, "list", () => this.downloads);
    _defineProperty(this, "get", magnetURI => {
      const torr = this.client.get(magnetURI);
      return torr ? this.statusLoader(torr) : null;
    });
    _defineProperty(this, "saveFiles", async (torrent, onDriveUpload, onDriveUploadStart) => {
      torrent.files.forEach((file, i) => {
        let filePath;
        if (torrent.files.length === 1) filePath = `./downloads/${torrent.infoHash}/${file.path}/${file.path}`;else filePath = `./downloads/${torrent.infoHash}/${file.path}`;
        mkfile(filePath);
        let toFile = fs.createWriteStream(filePath);
        let torrentFile = file.createReadStream();
        torrentFile.pipe(toFile);
      });
      try {
        ziper(`./downloads/${torrent.infoHash}/${torrent.name}`);
        const torr = this.statusLoader(torrent);
        if (onDriveUploadStart) onDriveUploadStart(torr);
        const url = await uploadWithLog(`./downloads/${torrent.infoHash}/${torrent.name}`);
        if (onDriveUpload) onDriveUpload(torr, url);
      } catch (e) {
        console.log(e);
      }
    });
    this.downloads = [];
    this.client = new WebTorrent();
    setInterval(() => {
      this.downloads = this.client.torrents.map(torrent => this.get(torrent.magnetURI));
    }, 3000);
  }
}
module.exports = Torrent;