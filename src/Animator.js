import {ease} from 'd3-ease'
import {timer} from 'd3-timer'
import {interpolate} from 'd3-interpolate'

let eases = [
  'linear-in',
  'linear-out',
  'linear-in-out',
  'quad-in',
  'quad-out',
  'quad-in-out',
  'cubic-in',
  'cubic-out',
  'cubic-in-out',
  'poly-in',
  'poly-out',
  'poly-in-out',
  'sin-in',
  'sin-out',
  'sin-in-out',
  'exp-in',
  'exp-out',
  'exp-in-out',
  'circle-in',
  'circle-out',
  'circle-in-out',
  'bounce-in',
  'bounce-out',
  'bounce-in-out',
  'back-in',
  'back-out',
  'back-in-out',
  'elastic-in',
  'elastic-out',
  'elastic-in-out'
], Easing = {};

/**
* React state animation wrapper
*  - update state value by requestAnimationFrame loop
*/
export default class Animate {

  /* Animation constructor accept data container and frames per second.
  */
  constructor(component, fps=60) {

    // keep internal reference to the component
    this._component = component;
    this._fps = fps;

    // generate an interface function for each ease.
    eases.forEach( (e) => {
      // convert to camelCase
      var easeName = e.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

      // add instance methods dynamically
      this[easeName] = function(prop, end, duration) {
        return this.animate(prop, end, duration, e)
      }

    });
  }

  /**
  * Get state value
  * if the prop is not in state regular property
  */
  _getStateValue(prop) {
    var c = this._component,
    v = c.state && c.state[prop]
    return v === undefined ? c[prop] : v
  }

  /**
  * Set value to state
  * if the prop is not in state, set value to regular property with force update
  */
  _updateStateValue(prop, v, resolve) {
    var c = this._component
    if(c.state && c.state[prop] !== undefined){
      var state = {}
      state[prop] = v
      c.setState(state)
    }else{
      c[prop] = v
      c.forceUpdate()
    }
  }

  animate(prop, end, duration, easing) {

    return new Promise((resolve, reject) => {
      var begin = this._getStateValue(prop),
      i = interpolate(begin, end),
      easeFun = ease(easing)

      timer( (elapsed,d) => {
        var progress = easeFun(elapsed / 1000),
        value = i(progress)

        this._updateStateValue(prop, value, resolve)

        if (elapsed > 1000) {
          this._updateStateValue(prop, end, resolve)
          resolve()
          return true;
        }

      })
    })
  }
}
