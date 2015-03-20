import React from 'react'
import ReactCanvas from 'react-canvas'
import ReactStateAnimation from 'react-state-animation'

var Surface = ReactCanvas.Surface
var Group = ReactCanvas.Group
var Layer = ReactCanvas.Layer

export default class DemoCanvas extends React.Component {
    constructor(props) {
        super(props)
        // initialize state
        this.state = {
            x: 0,
            alpha: 1
        }
        // react state animation wrapper
        this._animate = new ReactStateAnimation(this)
    }

    start() {
        this._animate[this.props.easing]('x', 350/*end value*/, 1000/*duration*/)
            .then(() => this._animate[this.props.easing]('alpha', 0, 400))
    }

    stop() {
        this._animate.stop()
    }

    getGroupStyle() {
        return {
            position: 'absolute',
            backgroundColor: "#f4f4f4",
            top: 0,
            left: 0,
            width: this.props.canvasWidth,
            height: this.props.canvasHeight
        }
    }

    getStyle() {
        return {
            position: 'absolute',
            backgroundColor: "#009688",
            top: 0,
            alpha: this.state.alpha,
            left: this.state.x,
            width: this.props.width,
            height: this.props.height
        }
    }

    render() {
        return (
            <Surface ref="surface" top={0} left={0} width={this.props.canvasWidth} height={this.props.canvasHeight} enableCSSLayout={true}>
               <Group style={this.getGroupStyle()}>
                    <Layer style={this.getStyle()} />
                </Group>
            </Surface>
        )
    }
}

DemoCanvas.defaultProps = {
    canvasWidth: 400,
    canvasHeight: 50,
    width: 50,
    height: 50,
    easing: ''
}