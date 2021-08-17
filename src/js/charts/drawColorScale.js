import { select } from 'd3-selection'
import {format} from 'd3-format'

var format2 = format(".1f")

export default function drawColorScale(sbg) {
  var pallete = svg.append('g')
    .attr('id', 'pallete');

  var swatch = pallete.selectAll('rect').data(colorscale);
  swatch.enter().append('rect')
    .attr('fill', function(d) {
      return d;
    })
    .attr('x', function(d, i) {
      return i * 50;
    })
    .attr('y', 50)
    .attr('width', 50)
    .attr('height', 10);

  var texts = pallete.selectAll("foo")
    .data(color.range())
    .enter()
    .append("text")
    .attr("font-size", "10px")
    .attr("text-anchor", "middle")
    .attr("y", 80)
    .attr('x', function(d, i) {
      return i * 50 + 25;
    })
    .text(function(d) {
      return format2(color.invertExtent(d)[0])
    })
    .append("tspan")
    .attr("dy", "1.3em")
    .attr('x', function(d, i) {
      return i * 50 + 25;
    })
    .text("to")
    .append("tspan")
    .attr("dy", "1.3em")
    .attr('x', function(d, i) {
      return i * 50 + 25;
    })
    .text(function(d) {
      return format2(color.invertExtent(d)[1])
    })

}
