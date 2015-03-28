"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var Animate = _interopRequire(require("./Animate"));

var Loop = _interopRequire(require("./Loop"));

var ReactStateAnimation = Animate;
ReactStateAnimation.Loop = Loop;

module.exports = ReactStateAnimation;