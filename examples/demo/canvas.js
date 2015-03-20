import React from 'react'
import Demo from './Demo'
import DemoCanvas from './DemoCanvas'
import DemoCanvasNoState from './DemoCanvasNoState'

var d = document,
    components = [],
    easingTypes = ['linear', 'easeInQuad', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic']

// set up DOM for each easing types
easingTypes.forEach((easing, i) => {
    var div = d.createElement("DIV"),
        html = ['<h3>', easing, "</h3>",
                "<code>reactStateAnimation." + easing + "('x', 350/*end value*/, 1000/*duration(ms)*/).then(() => reactStateAnimation." + easing + "('alpha', 0, 400))</code>",
                '<div class="floatContainer">',
                '<div class="floatLeftItem"><h4>Canvas w/ setState</h4><h4>Canvas w/o setState</h4></div>',
                '<div class="floatRightItem"><div class="with"></div><div class="without"></div></div>',
                '</div>']
    div.innerHTML = html.join("")
    // render React component
    components.push(React.render(
        <DemoCanvas easing={easing} />,
        div.querySelector('.with')
    ))
    // render React Canvas
    components.push(React.render(
        <DemoCanvasNoState easing={easing} />,
        div.querySelector('.without')
    ))
    d.getElementById('demo').appendChild(div)
})

// action buttons
d.getElementById('startBtn').addEventListener('click', () => {
    components.forEach(c => {
        if(c.state.x) {
            c.setState({x: 0, alpha: 1}, () => {
                c.start()
            })
        }else{
            c.x = 0
            c.alpha = 1
            c.start()
        }
    })
})

d.getElementById('resumeBtn').addEventListener('click', () => {
    components.forEach(c => {
        c.start()
    })
})

d.getElementById('stopBtn').addEventListener('click', () => {
    components.forEach(c => {
        c.stop()
    })
})


