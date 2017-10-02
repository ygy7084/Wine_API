"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (obj, propertyName) {
  return Object.prototype.hasOwnProperty.call(obj, propertyName);
};