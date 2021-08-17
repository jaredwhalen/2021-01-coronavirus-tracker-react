import { axisLeft } from 'd3-axis'
import reveal from './reveal.js'

const makeYGridlines = (bounds, yScale, dimensions) => {
  bounds.append("g")
    .call(axisLeft(yScale).ticks(4)
      .tickSize(-dimensions.boundedWidth)
      .tickFormat("")
    )
    .attr("class", "gridlines")
    .call(el => reveal(el))
}

export default makeYGridlines
