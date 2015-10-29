"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var ease = require("d3-ease").ease;

var timer = require("d3-timer").timer;

var interpolate = require("d3-interpolate").interpolate;

var eases = ["linear-in", "linear-out", "linear-in-out", "quad-in", "quad-out", "quad-in-out", "cubic-in", "cubic-out", "cubic-in-out", "poly-in", "poly-out", "poly-in-out", "sin-in", "sin-out", "sin-in-out", "exp-in", "exp-out", "exp-in-out", "circle-in", "circle-out", "circle-in-out", "bounce-in", "bounce-out", "bounce-in-out", "back-in", "back-out", "back-in-out", "elastic-in", "elastic-out", "elastic-in-out"];

/**
* React state animation wrapper
*  - update state value by requestAnimationFrame loop
*/

var Animate = (function () {

  /* Animation constructor accept data container and frames per second.
  */

  function Animate(component) {
    var _this = this;

    var fps = arguments[1] === undefined ? 60 : arguments[1];

    _classCallCheck(this, Animate);

    // keep internal reference to the component
    this._component = component;
    this._fps = fps;

    // generate an interface function for each ease.
    eases.forEach(function (e) {
      // convert to camelCase
      var easeName = e.replace(/-([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });

      // add instance methods dynamically
      _this[easeName] = function (prop, end, duration) {
        return this.animate(e, prop, end, duration);
      };
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
        var c = this._component;
        if (c.state && c.state[prop] !== undefined) {
          var state = {};
          state[prop] = v;
          c.setState(state);
        } else {
          c[prop] = v;
          c.forceUpdate();
        }
      }
    },
    stop: {
      value: function stop() {
        this.setStopped = true;
      }
    },
    animate: {
      value: function animate(easing, prop, end, duration) {
        var _this = this;

        return new Promise(function (resolve, reject) {
          var begin = _this._getStateValue(prop),
              i = interpolate(begin, end),
              easeFun = ease(easing);

          /* The timer stops when the callback retuns a truthy value */
          timer(function (elapsed, d) {

            if (_this.setStopped) {
              return true;
            }

            var progress = easeFun(elapsed / duration),
                value = i(progress);

            _this._updateStateValue(prop, value, resolve);

            if (elapsed > duration) {
              _this._updateStateValue(prop, end, resolve);
              resolve();
              return true;
            }
          });
        });
      }
    }
  });

  return Animate;
})();

module.exports = Animate;