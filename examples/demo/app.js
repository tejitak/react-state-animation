import React from 'react'
import Demo from './Demo'
import DemoCanvas from './DemoCanvas'

var d = document,
    components = [],
    easingTypes = ['linear', 'easeInQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic']

// set up DOM for each easing types
easingTypes.forEach((easing, i) => {
    var div = d.createElement("DIV"),
        html = ['<h3>', easing, "</h3>",
                "<code>reactStateAnimation." + easing + "('x', 350/*end value*/, 1000/*duration(ms)*/).then(() => reactStateAnimation." + easing + "('alpha', 0, 400))</code>",
                '<div class="floatContainer">',
                '<div class="floatLeftItem"><h4>React Component</h4><h4>React Canvas</h4></div>',
                '<div class="floatRightItem"><div class="container"></div><div class="canvasContainer"></div></div>',
                '</div>']
    div.innerHTML = html.join("")
    // render React component
    components.push(React.render(
        <Demo easing={easing} />,
        div.querySelector('.container')
    ))
    // render React Canvas
    components.push(React.render(
        <DemoCanvas easing={easing} />,
        div.querySelector('.canvasContainer')
    ))
    d.getElementById('demo').appendChild(div)
})

// action buttons
var start = () => {
    components.forEach(c => {
        c.setState({x: 0, alpha: 1}, () => {
            c.start()
        })
    })
}

var resume = () => {
    components.forEach(c => {
        c.start()
    })
}

var stop = () => {
    components.forEach(c => {
        c.stop()
    })
}

d.getElementById('startBtn1').addEventListener('click', start)
d.getElementById('startBtn2').addEventListener('click', start)
d.getElementById('resumeBtn1').addEventListener('click', resume)
d.getElementById('resumeBtn2').addEventListener('click', resume)
d.getElementById('stopBtn1').addEventListener('click', stop)
d.getElementById('stopBtn2').addEventListener('click', stop)