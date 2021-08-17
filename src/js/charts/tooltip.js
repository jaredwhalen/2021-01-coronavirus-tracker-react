import {
  bisector
} from 'd3-array'
import {
  select,
  pointer
} from 'd3-selection'

const variableDisplayNames = require('../../data/variableDisplayNames.json')
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

export default function tooltip(bounds, chartGroup, data, yAccessor, dimensions, xScale, yScale) {

  const yAccessorArr = typeof yAccessor === 'string' ? [yAccessor] : yAccessor

  const tooltipLine = chartGroup.append('line').style('display', 'none');

  // const focus = chartGroup
  //   .append('g')
  //   .attr('class', 'focus')
  //   .style('display', 'none');

  // focus
  //   .append('circle')
  //   .attr('r', 4)
  //   .attr('class', 'circle')
  //   .attr('stroke-width', 2)
  //   .attr('stroke', 'white')


    const focus = chartGroup
      .append('g')
      .attr('class', 'focus')
      .style('display', 'none');

      focus
        .selectAll('.circle')
        .data(yAccessorArr)
        .enter()
        .append('circle')
        .attr('r', 4)
        .attr('class', d => 'circle ' + d)
        .attr('stroke-width', 2)
        .attr('stroke', 'white')


  const tooltip = select("body")
    .append('div')
    .attr('class', 'g-tooltip')
    .style('display', 'none');

  chartGroup
    .append('rect')
    .attr('class', 'overlay')
    .attr('width', dimensions.boundedWidth)
    .attr('height', dimensions.boundedHeight)
    .style('opacity', 0)
    .on("mouseover", function() {
      focus.style("display", null)
      tooltip.style("display", null)
      tooltipLine.style("display", null)
    })
    .on("mouseout", function() {
      focus.style("display", "none")
      tooltip.style("display", "none")
      tooltipLine.style("display", "none")
    })
    .on('mousemove', mousemove);



  function mousemove(event) {
    const bisect = bisector(d => d.date_confirmed).left;
    const xPos = pointer(event)[0];

    const x0 = bisect(data, xScale.invert(xPos));
    const d0 = data[x0];

    let tooltipContent = ''
    tooltipContent += `<h4>${months[d0.date_confirmed.getMonth()]}. ${d0.date_confirmed.getDate()}</h4>`


    yAccessorArr.forEach((y, i) => {

      if (d0[y]) {
        focus.style("display", null)
        tooltip.style("display", null)
        tooltipLine.style("display", null)
      } else {
        focus.style("display", "none")
        tooltip.style("display", "none")
        tooltipLine.style("display", "none")
      }

      focus.style("display", null)

      focus
      .selectAll('.circle')
      .filter(function (d, i) { return d === y})
      .attr(
        'transform',
        `translate(${xScale(d0.date_confirmed)},${yScale(d0[y])})`,
      );

      // make tooltip content
      tooltipContent += `<div>${variableDisplayNames[y]}: <strong>${d0[y] ? Number(d0[y].toFixed(0)).toLocaleString() : 0}${y === 'delaware_positivityRate' ? '%' : ''}</strong></div>`
    })



    tooltipLine.attr('stroke', '#ddd')
      .attr('x1', xScale(d0.date_confirmed))
      .attr('x2', xScale(d0.date_confirmed))
      .attr('y1', 0)
      .attr('y2', dimensions.boundedHeight);

    let shift = event.pageX < window.innerWidth / 2 ? 20 : 120

    tooltip
        .html(tooltipContent)
        .style("left", (event.pageX - shift) + "px")
        .style("top", (event.pageY - ((100)) + "px");




  }


}
