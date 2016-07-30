/*
 * Loop utility using requestAnimationFrame
 */
var w = (global.window || 0),
    raf = w['requestAnimationFrame'] || w['webkitRequestAnimationFrame'] || w['mozRequestAnimationFrame'] || w['msRequestAnimationFrame'] || w['oRequestAnimationFrame'] || function(c){ global.setTimeout(c, 1000 / 60) },
    caf = w['cancelAnimationFrame'] || w['webkitCancelAnimationFrame'] || w['mozCancelAnimationFrame'] || w['msCancelAnimationFrame'] || w['oCancelAnimationFrame'] || global.clearTimeout

export default class Loop {

    constructor(callback) {
        this._callback = callback;
    }

    start() {
        // keep loop while the callback returns true
        this._startTime = Date.now()
        this._loop()
    }

    _loop() {
        if(!this._callback){ return }
        var keep = this._callback()
        if(keep) {
            var exec = ()=>{
                this._timer = raf(this._loop.bind(this));
            }
            // handle promise
            if(keep.then){
                keep.then(exec)
            }else{
                exec()
            }
        }
    }

    end() {
        if(this._timer) {
            caf(this._timer)
            this._timer = null
        }
        this._startTime = null
    }

    timeDiff() {
        return Date.now() - this._startTime
    }

}
