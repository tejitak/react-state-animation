import React from 'react'
import ReactStateAnimation from 'react-state-animation'

export default class Linear extends React.Component {
    constructor(props) {
        super(props)
        // initialize state
        this.state = {
            x: props.initialX
        }
        // react state animation wrapper
        this._animate = new ReactStateAnimation(this)
    }

    componentDidMount() {
        // strat moving animation
        this._animate.linear('x', 360, 1000)
    }

    componentWillUnmount() {
        this.stop()
    }

    stop() {
        this._animate.stop()
    }

    getStyle() {
        return {
            position: 'absolute',
            backgroundColor: "red",
            top: 0,
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

Linear.defaultProps = {
    initialX: 0,
    width: 40,
    height: 40
}