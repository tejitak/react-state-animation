import Loop from './Loop'
import Easing from './Easing'

/**
 * React state animation wrapper
 *  - update state value by requestAnimationFrame loop
 */
export default class Animate {

    constructor(component) {
        this._component = component;
    }

    /**
     * Get state value
     * if the prop is not in state regular property
     */
    _getStateValue(prop) {
        var c = this._component,
            v = c.state[prop]
        return v === undefined ? c[prop] : v
    }

    /**
     * Set value to state
     * if the prop is not in state, set value to regular property with force update
     */
    _updateStateValue(prop, v) {
        return new Promise((resolve, reject) => {
            var c = this._component
            if(c.state[prop] !== undefined){
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

    /**
     * Interfaces
     */
    linear(prop, end, duration) {
        return this.animate(prop, end, duration, 'linear')
    }

    easeInQuad(prop, end, duration) {
        return this.animate(prop, end, duration, 'easeInQuad')
    }

    easeInCubic(prop, end, duration) {
        return this.animate(prop, end, duration, 'easeInCubic')
    }

    easeOutCubic(prop, end, duration) {
        return this.animate(prop, end, duration, 'easeOutCubic')
    }

    easeInOutCubic(prop, end, duration) {
        return this.animate(prop, end, duration, 'easeInOutCubic')
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
            this._updateStateValue(prop, end).then(() => {
                this.stop()
                resolve()
            })
            return false
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