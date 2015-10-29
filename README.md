# react-state-animation

react-state-animation provides a Promise based API for mutating the value of a React component; built with
D3's timer, ease and interpolation routines.

This works with [React](http://facebook.github.io/react/) v0.14.
It is planned to work with [React Canvas](https://github.com/Flipboard/react-canvas) when it adds support for 0.14.

## Installation
```
npm install react-state-animation --save
```

Include the module by CommonJS way  

```
import {Animate, AnimatedComponent} from 'react-state-animation'
```
or
```
var ReactStateAnimation = require('react-state-animation').Animated;
```  

This will require ES5 modules converted by babel. ES6 sources are in /src and converted ES5 modules are located in /lib.

##Demo

[http://tejitak.github.io/react-state-animation/examples/demo/](http://tejitak.github.io/react-state-animation/examples/demo/)

## API

  - linearIn(*stateProp*, *endStateValue*, *duration*)
  - linearOut(*stateProp*, *endStateValue*, *duration*)
  - linearInOut(*stateProp*, *endStateValue*, *duration*)
  - quadIn(*stateProp*, *endStateValue*, *duration*)
  - quadOut(*stateProp*, *endStateValue*, *duration*)
  - quadInOut(*stateProp*, *endStateValue*, *duration*)
  - cubicIn(*stateProp*, *endStateValue*, *duration*)
  - cubicOut(*stateProp*, *endStateValue*, *duration*)
  - cubicInOut(*stateProp*, *endStateValue*, *duration*)
  - polyIn(*stateProp*, *endStateValue*, *duration*)
  - polyOut(*stateProp*, *endStateValue*, *duration*)
  - polyInOut(*stateProp*, *endStateValue*, *duration*)
  - sinIn(*stateProp*, *endStateValue*, *duration*)
  - sinOut(*stateProp*, *endStateValue*, *duration*)
  - sinInOut(*stateProp*, *endStateValue*, *duration*)
  - expIn(*stateProp*, *endStateValue*, *duration*)
  - expOut(*stateProp*, *endStateValue*, *duration*)
  - expInOut(*stateProp*, *endStateValue*, *duration*)
  - circleIn(*stateProp*, *endStateValue*, *duration*)
  - circleOut(*stateProp*, *endStateValue*, *duration*)
  - circleInOut(*stateProp*, *endStateValue*, *duration*)
  - bounceIn(*stateProp*, *endStateValue*, *duration*)
  - bounceOut(*stateProp*, *endStateValue*, *duration*)
  - bounceInOut(*stateProp*, *endStateValue*, *duration*)
  - backIn(*stateProp*, *endStateValue*, *duration*)
  - backOut(*stateProp*, *endStateValue*, *duration*)
  - backInOut(*stateProp*, *endStateValue*, *duration*)
  - elasticIn(*stateProp*, *endStateValue*, *duration*)
  - elasticOut(*stateProp*, *endStateValue*, *duration*)
  - elasticInOut(*stateProp*, *endStateValue*, *duration*)

All of these functions return a process that is resolved when the transition is complete.

##Usage

### Example 0. Extend AnimatedComponent

```js:extend.js
import {AnimatedComponent} from 'react-state-animation'

class MyAnimatedComponent extends AnimatedComponent {
  handleClick() {
    // animate this.state.x over 2000ms with final value of 1000
    this.setAnimate('linear-in', 'x', 1000, 2000)
  }
}
```

### Example 1. Use outside of component

```js:app.js
var yourComponent = React.render(
    <YourComponent />,
    document.getElementById('demo')
)
var reactStateAnimation = new ReactStateAnimation(yourComponent)
// your component's state 'x' will be updated to 350 with linear order in 1 sec, then alpha will be 0 on end of moving
reactStateAnimation.linearInOut('x', 350/*end value*/, 1000/*duration(ms)*/).then(() => reactStateAnimation.linearInOut('alpha', 0, 400))
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
        this._animate.linearInOut('x', 350/*end value*/, 1000/*duration(ms)*/)
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
        this._animate.linearInOut('x', 350/*end value*/, 1000/*duration*/)
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
React setState is now asynchronously called as a batch. So, using regular instance properties instead of state seems fast especially for React Canvas.

Please check the [demo for canvas performance between React Canvas with setState (asynchronous and batch) and without setStates](http://tejitak.github.io/react-state-animation/examples/demo/canvas.html)


## Development

1. Run "npm install"
2. Run "gulp"
3. Access to "http://localhost:8080/html/"
