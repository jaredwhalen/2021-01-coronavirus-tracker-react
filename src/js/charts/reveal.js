import { select } from 'd3-selection'
let transitionDuration = 800

const reveal = el => {
  el
    .attr('opacity', 0)
    .transition()
    .duration(transitionDuration)
    .attr('opacity', 1)
}

export default reveal
