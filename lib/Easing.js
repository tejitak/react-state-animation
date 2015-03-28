"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Easing = (function () {
    function Easing() {
        _classCallCheck(this, Easing);
    }

    _createClass(Easing, {
        linear: {
            value: function linear(t) {
                return t;
            }
        },
        easeInQuad: {
            value: function easeInQuad(t) {
                return Math.pow(t, 2);
            }
        },
        easeInCubic: {
            value: function easeInCubic(t) {
                return t * t * t;
            }
        },
        easeOutCubic: {
            value: function easeOutCubic(t) {
                return --t * t * t + 1;
            }
        },
        easeInOutCubic: {
            value: function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
            }
        }
    });

    return Easing;
})();

var instance = new Easing();

module.exports = instance;