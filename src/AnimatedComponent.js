import {Component} from 'react'
import Animate from './Animate'

export default class AnimatedComponent extends Component {
  constructor(props) {
    super(props)
    this.animator = new Animate(this)
    this.setAnimate = this.animator.animate
  }

  _getStateValue(prop) {
    return this.state[prop]
  }

  _updateStateValue(prop, v) {
    var updates = {}
    updates[prop] = v
    this.setState(updates)
  }
}
