import Loop from './Loop'
import {ease} from 'd3-ease'

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

    constructor(component) {
        this._component = component;

        // generate an interface function for each ease.
        eases.forEach( (e) => {
            // convert to camelCase
            var easeName = e.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });

            // add instance methods dynamically
            this[easeName] = function(prop, end, duration) {
                return this.animate(prop, end, duration, easeName)
            }

            Easing[easeName] = ease(e)

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
    _updateStateValue(prop, v) {
        return new Promise((resolve, reject) => {
            var c = this._component
            if(c.state && c.state[prop] !== undefined){
                var state = {}
                state[prop] = v
                c.setState(state, resolve)
            }else{
                c[prop] = v
                c.forceUpdate()
                resolve()
            }
        })
    }

    /**
     * Updates multiple properties within
     * @param prop {Array} array of targeted states= {state: {string}, target: {number}}
     * @param values {Array} array of values to be set
     * @returns {Promise}
     */
    _updateStateMap(prop, values) {

        return new Promise((resolve, reject) => {
            var c = this._component,
                state = {};
            // build up changed state
            for(var i = 0; i < prop.length; i++) {
                state[prop[i].state] = values[i];
            }
            c.setState(state, resolve);
        });
    }

    _start(loopCallback) {
        this._loop = new Loop(loopCallback)
        this._loop.start()
    }

    animate(prop, end, duration, easing) {
        if(!Easing[easing]) {
            console.log("Specified easing does not exist: " + easing)
            return
        }
        return new Promise((resolve, reject) => {
            var begin = this._getStateValue(prop)
            this._start(() => {
                return this._anim(prop, begin, end, duration, easing, resolve)
            })
        })
    }

    manimate(prop, duration, easing) {
        if (!Easing[easing]) {
            console.log("Specified easing does not exist: " + easing);
            return;
        }
        return new Promise((resolve, reject) => {
            // gather array begin States
            var begins = [],
                ends = [];
            for(var i = 0; i < prop.length; i++) {
                var b = this._getStateValue(prop[i].state);
                var e = prop[i].target;
                begins.push(b);
                ends.push(e);
            }
            // start multi-anim
            this._start(() => {
                return this._multianim(prop, begins, ends, duration, easing, resolve);
            });
        });
    }

    // for override on each loop
    onProcess(prop, value, progress) {
    }

    /**
     * Start animation
     *  - prop is a react state property
     *  - end is a goal value of the state
     */
    _anim(prop, begin, end, duration, easing, resolve) {
        if(!this._loop){
            resolve()
            return false
        }
        var progress = Easing[easing](this._loop.timeDiff() / duration),
            distance = Math.abs(begin - end),
            diff = progress * distance,
            operator = begin > end ? -1 : 1,
            value = begin + diff * operator
        this.onProcess(prop, value, progress)
        if(progress < 1) {
            // return promise to keep loop
            return this._updateStateValue(prop, value)
        }else{
            this.stop()
            this._updateStateValue(prop, end).then(() => {
                resolve()
            })
            return false
        }
    }

    _multianim(prop, begins, ends, duration, easing, resolve) {
        if(!this._loop) {
            resolve();
            return false;
        }
        var progress = Easing[easing](this._loop.timeDiff() / duration),
            newValues = [];

        // step through all states
        for(var i = 0; i < prop.length; i++) {
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

        if(progress < 1) {
            return this._updateStateMap(prop, newValues);
        } else {
            this.stop();
            this._updateStateMap(prop, ends).then(function () {
                resolve();
            });
            return false;
        }
    }

    stop() {
        if(this._loop) {
            this._loop.end()
            this._loop = null
        }
        return this
    }

}
