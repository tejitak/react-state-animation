import React from 'react'
import ReactStateAnimation from 'react-state-animation'

export default class Demo extends React.Component {
    constructor(props) {
        super(props)
        // initialize state
        this.state = {
            x: 0,
            alpha: 1
        }
        // this.x = 0
        // this.alpha = 1
        // react state animation wrapper
        this._animate = new ReactStateAnimation(this)
    }

    start() {
        this._animate[this.props.easing]('x', 350/*end value*/, 1000/*duration(ms)*/)
            .then(() => this._animate[this.props.easing]('alpha', 0, 500))
    }

    stop() {
        this._animate.stop()
    }

    getStyle() {
        return {
            position: 'absolute',
            backgroundColor: "#009688",
            top: 0,
            // opacity: this.alpha,
            // left: this.x + "px",
            opacity: this.state.alpha,
            left: this.state.x + "px",
            width: this.props.width,
            height: this.props.height
        }
    }

    render() {
        return (
            <div style={this.getStyle()}></div>
        )
    }
}

Demo.defaultProps = {
    width: 50,
    height: 50,
    easing: ''
}