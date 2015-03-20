import Loop from './Loop'

/*
 * React state animation wrapper
 *  - update state value by requestAnimationFrame loop
 */
export default class Animate {

    constructor(component) {
        this._component = component;
    }

    _start(loopCallback) {
        this._loop = new Loop(loopCallback)
        this._loop.start()
    }

    /*
     * start linear animation
     *  - prop is a react state property
     *  - end is a goal value of the state
     */
    linear(prop, end, duration) {
        return new Promise((resolve, reject) => {
            var begin = this._component.state[prop]
            if(begin === undefined){
                begin = this._component[prop]
            }
            this._start(() => {
                return this._linear(prop, begin, end, duration, resolve)
            })
        })
    }

    _linear(prop, begin, end, duration, resolve) {
        var progress = this._loop.timeDiff() / duration,
            distance = Math.abs(begin - end),
            diff = progress * distance,
            operator = begin > end ? -1 : 1,
            value = begin + diff * operator
        if(progress < 1) {
            // set new react state
            if(this._component.state[prop] !== undefined){
                var state = {}
                state[prop] = value
                this._component.setState(state)
            }else{
                this._component[prop] = value
                this._component.forceUpdate()
            }
            // keep the loop
            return true
        }else{
            this.stop()
            resolve()
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