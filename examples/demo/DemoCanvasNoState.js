import React from 'react'
import DemoCanvas from './DemoCanvas'

export default class DemoCanvasNoState extends DemoCanvas {
    constructor(props) {
        super(props)
        // initialize state
        this.state = {}
        // replace state to instance props
        this.x = 0
        this.alpha = 1
    }

    getStyle() {
        return {
            position: 'absolute',
            backgroundColor: "#009688",
            top: 0,
            // replace state to instance props
            alpha: this.alpha,
            left: this.x,
            width: this.props.width,
            height: this.props.height
        }
    }
}