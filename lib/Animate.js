"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Loop = _interopRequire(require("./Loop"));

var ease = require("d3-ease").ease;

var eases = ["linear-in", "linear-out", "linear-in-out", "quad-in", "quad-out", "quad-in-out", "cubic-in", "cubic-out", "cubic-in-out", "poly-in", "poly-out", "poly-in-out", "sin-in", "sin-out", "sin-in-out", "exp-in", "exp-out", "exp-in-out", "circle-in", "circle-out", "circle-in-out", "bounce-in", "bounce-out", "bounce-in-out", "back-in", "back-out", "back-in-out", "elastic-in", "elastic-out", "elastic-in-out"],
    Easing = {};

/**
 * React state animation wrapper
 *  - update state value by requestAnimationFrame loop
 */

var Animate = (function () {
    function Animate(component) {
        var _this = this;

        _classCallCheck(this, Animate);

        this._component = component;

        // generate an interface function for each ease.
        eases.forEach(function (e) {
            // convert to camelCase
            var easeName = e.replace(/-([a-z])/g, function (g) {
                return g[1].toUpperCase();
            });

            // add instance methods dynamically
            _this[easeName] = function (prop, end, duration) {
                return this.animate(prop, end, duration, easeName);
            };

            Easing[easeName] = ease(e);
        });
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
        _updateStateMap: {

            /**
             * Updates multiple properties within
             * @param prop {Array} array of targeted states= {state: {string}, target: {number}}
             * @param values {Array} array of values to be set
             * @returns {Promise}
             */

            value: function _updateStateMap(prop, values) {
                var _this = this;

                return new Promise(function (resolve, reject) {
                    var c = _this._component,
                        state = {};
                    // build up changed state
                    for (var i = 0; i < prop.length; i++) {
                        state[prop[i].state] = values[i];
                    }
                    c.setState(state, resolve);
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
        manimate: {
            value: function manimate(prop, duration, easing) {
                var _this = this;

                if (!Easing[easing]) {
                    console.log("Specified easing does not exist: " + easing);
                    return;
                }
                return new Promise(function (resolve, reject) {
                    // gather array begin States
                    var begins = [],
                        ends = [];
                    for (var i = 0; i < prop.length; i++) {
                        var b = _this._getStateValue(prop[i].state);
                        var e = prop[i].target;
                        begins.push(b);
                        ends.push(e);
                    }
                    // start multi-anim
                    _this._start(function () {
                        return _this._multianim(prop, begins, ends, duration, easing, resolve);
                    });
                });
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
        _multianim: {
            value: function _multianim(prop, begins, ends, duration, easing, resolve) {
                if (!this._loop) {
                    resolve();
                    return false;
                }
                var progress = Easing[easing](this._loop.timeDiff() / duration),
                    newValues = [];

                // step through all states
                for (var i = 0; i < prop.length; i++) {
                    var begin = begins[i],
                        end = ends[i],
                        p = prop[i].state,
                        distance = Math.abs(begin - end),
                        diff = progress * distance,
                        operator = begin > end ? -1 : 1,
                        value = begin + diff * operator;

                    this.onProcess(p, value, progress);

                    newValues.push(value);
                }

                if (progress < 1) {
                    return this._updateStateMap(prop, newValues);
                } else {
                    this.stop();
                    this._updateStateMap(prop, ends).then(function () {
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