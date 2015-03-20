# react-state-animation

react-state-animation provides a capability to update React component's state value by requestAnimationFrame with a simple APIs. The file size is just **4KB** (minified).

This works with regular [React](http://facebook.github.io/react/) component and [React Canvas](https://github.com/Flipboard/react-canvas) 

## Installation
`npm install react-state-animation --save`  
Include the module by CommonJS way  
`import ReactStateAnimation from 'react-state-animation'` or `var ReactStateAnimation = require('react-state-animation');`

##Demo
[http://tejitak.github.io/react-state-animation/examples/demo/](http://tejitak.github.io/react-state-animation/examples/demo/)

## API

- linear(*stateProp*, *endStateValue*, *duration*)
- easeInQuad(*stateProp*, *endStateValue*, *duration*)
- easeInCubic(*stateProp*, *endStateValue*, *duration*)
- easeOutCubic(*stateProp*, *endStateValue*, *duration*)
- easeInOutCubic(*stateProp*, *endStateValue*, *duration*)

The above API returns Promise, so you can chain additinal processes by using then.

##Usage
### Example 1. Use outside of component 
```js:app.js
var yourComponent = React.render(
    <YourComponent />,
    document.getElementById('demo')
)
var reactStateAnimation = new ReactStateAnimation(yourComponent)
// your component's state 'x' will be updated to 350 with linear order in 1 sec, then alpha will be 0 on end of moving
reactStateAnimation.linear('x', 350/*end value*/, 1000/*duration(ms)*/).then(() => reactStateAnimation.linear('alpha', 0, 400))
```

### Example 2. Linear Move in React Component
Set any state (e.g. 'x') associated with position left style
```js:Demo.js
import React from 'react'
import ReactStateAnimation from 'react-state-animation'

export default class Demo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0
        }
        // react state animation wrapper
        this._animate = new ReactStateAnimation(this)
    }

    start() {
        // start animation
        this._animate.linear('x', 350/*end value*/, 1000/*duration(ms)*/)
    }

    stop() {
        this._animate.stop()
    }

    getStyle() {
        return {
            position: 'absolute',
            backgroundColor: "#009688",
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

Demo.defaultProps = {
    width: 50,
    height: 50
}
```

### Example 3. Linear Move in React Canvas
Set any state (e.g. 'x') associated with position left style
```js:DemoCanvas.js
import React from 'react'
import ReactCanvas from 'react-canvas'
import ReactStateAnimation from 'react-state-animation'

var Surface = ReactCanvas.Surface
var Group = ReactCanvas.Group
var Layer = ReactCanvas.Layer

export default class DemoCanvas extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            x: 0
        }
        // react state animation wrapper
        this._animate = new ReactStateAnimation(this)
    }

    start() {
        // start animation
        this._animate.linear('x', 350/*end value*/, 1000/*duration*/)
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
    height: 50
}
```

## Note
React setState is now asynchronously called as a batch. So, using regular instance properties instaed of state seems faste especially for React Canvas.

Please check the [demo for canvas performance between React Canvas with setState (asynchronous and batch) and without setStates](http://tejitak.github.io/react-state-animation/examples/demo/canvas.html)


## Development

1. Run "npm install"
2. Run "gulp"
3. Access to "http://localhost:8080/html/"

