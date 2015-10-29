"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var Component = require("react").Component;

var Animate = _interopRequire(require("./Animate"));

var AnimatedComponent = (function (_Component) {
  function AnimatedComponent(props) {
    _classCallCheck(this, AnimatedComponent);

    _get(Object.getPrototypeOf(AnimatedComponent.prototype), "constructor", this).call(this, props);
    this.animator = new Animate(this);
    this.setAnimate = this.animator.animate;
  }

  _inherits(AnimatedComponent, _Component);

  _createClass(AnimatedComponent, {
    _getStateValue: {
      value: function _getStateValue(prop) {
        return this.state[prop];
      }
    },
    _updateStateValue: {
      value: function _updateStateValue(prop, v) {
        var updates = {};
        updates[prop] = v;
        this.setState(updates);
      }
    }
  });

  return AnimatedComponent;
})(Component);

module.exports = AnimatedComponent;