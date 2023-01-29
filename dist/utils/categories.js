"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.categories = exports.catOptions = void 0;
const _ = require("lodash");
const config = require("../config");
const isMainBot = JSON.parse(_.get(config, "ISFULLBOT", "false"));
const envcategories = isMainBot ? JSON.parse(config.CATEGORIES || "[]") : [];
const catOptions = [{
  label: "1Webseries",
  value: "1"
}, {
  label: "2English",
  value: "2"
}, {
  label: "3English Premium",
  value: "3"
}, {
  label: "4Desi",
  value: "4"
}, {
  label: "5English Bulk",
  value: "5"
}, {
  label: "6Tango&onlyfans",
  value: "6"
}, {
  label: "7-18+",
  value: "7"
}];
exports.catOptions = catOptions;
const categories = [...catOptions, ...envcategories];
exports.categories = categories;