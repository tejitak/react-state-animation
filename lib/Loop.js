"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

/*
 * Loop utility using requestAnimationFrame
 */
var w = global.window || 0,
    raf = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.mozRequestAnimationFrame || w.msRequestAnimationFrame || w.oRequestAnimationFrame || function (c) {
    global.setTimeout(c, 1000 / 60);
},
    caf = w.cancelAnimationFrame || w.webkitCancelAnimationFrame || w.mozCancelAnimationFrame || w.msCancelAnimationFrame || w.oCancelAnimationFrame || global.clearTimeout;

var Loop = (function () {
    function Loop(callback) {
        _classCallCheck(this, Loop);

        this._callback = callback;
    }

    _createClass(Loop, {
        start: {
            value: function start() {
                // keep loop while the callback returns true
                this._startTime = Date.now();
                this._loop();
            }
        },
        _loop: {
            value: function _loop() {
                var _this = this;

                if (!this._callback) {
                    return;
                }
                var keep = this._callback();
                if (keep) {
                    var exec = function () {
                        _this._timer = raf(_this._loop.bind(_this));
                    };
                    // handle promise
                    if (keep.then) {
                        keep.then(exec);
                    } else {
                        exec();
                    }
                }
            }
        },
        end: {
            value: function end() {
                if (this._timer) {
                    caf(this._timer);
                    this._timer = null;
                }
                this._startTime = null;
            }
        },
        timeDiff: {
            value: function timeDiff() {
                return Date.now() - this._startTime;
            }
        }
    });

    return Loop;
})();

module.exports = Loop;