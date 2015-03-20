import React from 'react'
import ReactStateAnimation from 'react-state-animation'
import Demo from '../demo/Demo'
import DemoCanvas from '../demo/DemoCanvas'

var d = document,
    demo = React.render(
        <Demo />,
        d.getElementById('demo')
    ),
    anim = new ReactStateAnimation(demo),
    demoDuration = 1000

anim.onProcess = () => {
    stats.update();
}

d.getElementById('startDemoBtn').addEventListener('click', () => {
    // demo.setState({x: 0}, () => {
        // anim.linear('x', 350/*end value*/, demoDuration)
    // })
    demo.x = 0;
    anim.linear('x', 350/*end value*/, demoDuration)
})

d.getElementById('durationDemoInput').addEventListener('change', (e) => {
    demoDuration = e.target.value - 0
})

var demoCanvas = React.render(
        <DemoCanvas />,
        d.getElementById('demoCanvas')
    ),
    animCanvas = new ReactStateAnimation(demoCanvas),
    demoCanvasDuration = 1000

animCanvas.onProcess = () => {
    stats.update();
}

d.getElementById('startDemoCanvasBtn').addEventListener('click', () => {
    demoCanvas.x = 0;
    animCanvas.linear('x', 350/*end value*/, demoCanvasDuration)
    // demoCanvas.setState({x: 0}, () => {
        // animCanvas.linear('x', 350/*end value*/, demoCanvasDuration)
    // })
})

d.getElementById('durationDemoCanvasInput').addEventListener('change', (e) => {
    demoCanvasDuration = e.target.value - 0
})