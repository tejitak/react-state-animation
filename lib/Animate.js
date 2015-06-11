"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Loop = _interopRequire(require("./Loop"));

var Easing = _interopRequire(require("./Easing"));

/**
 * React state animation wrapper
 *  - update state value by requestAnimationFrame loop
 */

var Animate = (function () {
    function Animate(component) {
        _classCallCheck(this, Animate);

        this._component = component;
    }

    _createClass(Animate, {
        _getStateValue: {

            /**
             * Get state value
             * if the prop is not in state regular property
             */

            value: function _getStateValue(prop) {
                var c = this._component,
                    v = c.state && c.state[prop];
                return v === undefined ? c[prop] : v;
            }
        },
        _updateStateValue: {

            /**
             * Set value to state
             * if the prop is not in state, set value to regular property with force update
             */

            value: function _updateStateValue(prop, v) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    var c = _this._component;
                    if (c.state && c.state[prop] !== undefined) {
                        var state = {};
                        state[prop] = v;
                        c.setState(state, resolve);
                    } else {
                        c[prop] = v;
                        c.forceUpdate();
                        resolve();
                    }
                });
            }
        },
        _start: {
            value: function _start(loopCallback) {
                this._loop = new Loop(loopCallback);
                this._loop.start();
            }
        },
        animate: {
            value: function animate(prop, end, duration, easing) {
                var _this = this;

                if (!Easing[easing]) {
                    console.log("Specified easing does not exist: " + easing);
                    return;
                }
                return new Promise(function (resolve, reject) {
                    var begin = _this._getStateValue(prop);
                    _this._start(function () {
                        return _this._anim(prop, begin, end, duration, easing, resolve);
                    });
                });
            }
        },
        linear: {

            /**
             * Interfaces
             */

            value: function linear(prop, end, duration) {
                return this.animate(prop, end, duration, "linear");
            }
        },
        easeInQuad: {
            value: function easeInQuad(prop, end, duration) {
                return this.animate(prop, end, duration, "easeInQuad");
            }
        },
        easeInCubic: {
            value: function easeInCubic(prop, end, duration) {
                return this.animate(prop, end, duration, "easeInCubic");
            }
        },
        easeOutCubic: {
            value: function easeOutCubic(prop, end, duration) {
                return this.animate(prop, end, duration, "easeOutCubic");
            }
        },
        easeInOutCubic: {
            value: function easeInOutCubic(prop, end, duration) {
                return this.animate(prop, end, duration, "easeInOutCubic");
            }
        },
        onProcess: {

            // for override on each loop

            value: function onProcess(prop, value, progress) {}
        },
        _anim: {

            /**
             * Start animation
             *  - prop is a react state property
             *  - end is a goal value of the state
             */

            value: function _anim(prop, begin, end, duration, easing, resolve) {
                if (!this._loop) {
                    resolve();
                    return false;
                }
                var progress = Easing[easing](this._loop.timeDiff() / duration),
                    distance = Math.abs(begin - end),
                    diff = progress * distance,
                    operator = begin > end ? -1 : 1,
                    value = begin + diff * operator;
                this.onProcess(prop, value, progress);
                if (progress < 1) {
                    // return promise to keep loop
                    return this._updateStateValue(prop, value);
                } else {
                    this.stop();
                    this._updateStateValue(prop, end).then(function () {
                        resolve();
                    });
                    return false;
                }
            }
        },
        stop: {
            value: function stop() {
                if (this._loop) {
                    this._loop.end();
                    this._loop = null;
                }
                return this;
            }
        }
    });

    return Animate;
})();

module.exports = Animate;