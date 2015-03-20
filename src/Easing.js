class Easing {

    linear(t) {
        return t
    }

    easeInQuad(t) {
        return Math.pow(t, 2)
    }

    easeInCubic(t) {
        return t * t * t
    }

    easeOutCubic(t) {
        return (--t) * t * t + 1
    }

    easeInOutCubic(t) {
        return t < .5 ? 4 * t * t * t : (t-1) * (2*t - 2) * (2*t - 2) + 1
    }

}

var instance = new Easing()

export default instance