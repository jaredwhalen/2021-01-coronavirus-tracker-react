import React, {
  Component
} from 'react'

import { scaleLinear, scaleTime } from 'd3-scale'
import { max, extent } from 'd3-array'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'
import { timeDays, timeMonth } from 'd3-time'
import { line } from 'd3-shape'
import {axisBottom, axisLeft } from 'd3-axis'
import {easeLinear} from 'd3-ease'

import getAverage from '../util/getAverage.js'
import getDimensions from '../util/getDimensions.js'
import makeYGridlines from './makeYGridlines.js'
import reveal from './reveal.js'
import tooltip from './tooltip.js'

require('../../scss/charts.scss')

class BarChart extends Component {

  constructor(props) {
  super(props)
  this.state = {
    dimensions: null,
  };

  this.createChart = this.createChart.bind(this)
}

componentDidMount() {
  this.setState({
    dimensions: {
      width: this.container.offsetWidth,
      height: this.container.offsetHeight,
    },
  });

  this.state.dimensions && this.createChart()
}

componentDidUpdate() {
  this.createChart()
}

createChart() {

  let { data } = this.props
  data = JSON.parse(JSON.stringify(data))
  data.map(d => d.date_confirmed = new Date(d.date_confirmed))

  let xAccessor = d => d.date_confirmed
  let yAccessor = typeof this.props.yAccessor === 'string' ? d => d[this.props.yAccessor] : d => d[this.props.yAccessor[0]]
  let dateRange = timeDays(xAccessor(data[0]), new Date())

  data.map((d, i) => {
    let y = i ? data[i - 1] : null
    let change = y ? yAccessor(d) - yAccessor(y) : yAccessor(d)
    d['change'] = change


    let date = d.date_confirmed
    let weekAgo = new Date(date);
    weekAgo.setDate( weekAgo.getDate() - 7 );
    let numberOfDays;
    if (data[0].date_confirmed <= weekAgo){
      numberOfDays = 7
    } else {
      numberOfDays = (date - data[0].date_confirmed) / (60*60*24*1000)
    }

      let past_week = data.slice(i-numberOfDays, i)
      let values = []
      past_week.map(x => values.push(x.change))
      if (values.length) {
        let average = getAverage(values)
        d['average'] = average
      }

  })


  let dimensions = getDimensions(this.container.offsetWidth)

  let node = this.node
  select(node).html('')

  let bounds = select(node).append("g")
    .style("transform", `translate(${
                dimensions.margin.left
              }px, ${
                dimensions.margin.top
              }px)`)

  let transitionDuration = 800

  let xScale = scaleTime()
    .range([0, dimensions.boundedWidth])
    .domain(extent(data, xAccessor));

  let yScale = scaleLinear()
    .range([dimensions.boundedHeight, 0])
    .domain([0, max(data, d => d.change) * 1.1]);


  makeYGridlines(bounds, yScale, dimensions)


    var chartGroup = bounds
      .append('g')
      .attr('class', 'chartGroup ' + this.props.class)

    // Create bar and append data.close and x position set based on barWidth equidistant
    var barWidth = dimensions.boundedWidth / data.length;

    var bar = chartGroup
    .selectAll('g.bar')
        .data(data, d => d.change)
        .enter()
        .append('g')
        .attr('transform', (d,i) => `translate(${(i * barWidth) + (barWidth/2)},0)`)

    // Add rectangles to bar
    bar.append('rect')
      .attr('class', 'bar')
      .attr('height', 0)
      .attr('y', dimensions.boundedHeight)
      .transition()
      .duration(transitionDuration)
      .attr('height', d => {let v = dimensions.boundedHeight - yScale(d.change); return v > 0 ? v : 0})
      .attr('width', barWidth - 0.5)
      .attr('y', function(d) {
        if (d.change === 0) {
          return 0
        } else {
          return yScale(d.change)
        }
      })

    // Add the line
    var path = chartGroup.append("path")
      .datum(data.filter(function(d) { return d.average; }))
      .attr("fill", "none")
      .attr("stroke-width", 1.5)
      .attr("d", line()
        .x(function(d, i) { return xScale(d.date_confirmed) })
        .y(function(d) { return yScale(d.average) })
      )
      .attr('class','line')

      var totalLength = path.node().getTotalLength();
      path
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(transitionDuration)
      .ease(easeLinear)
      .attr("stroke-dashoffset", 0)


  let xAxisGenerator = axisBottom()
    .tickFormat(this.props.class === 'vaccinations' ? timeFormat('%b. %d') : timeFormat('%b.'))
    .scale(xScale)
    .tickSize(0);

  let xAxis = bounds.append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)
    .attr("class", "x axis")

  let yAxisGenerator = axisLeft()
    .scale(yScale)
    .ticks(4, "s")

  let yAxis = bounds.append("g")
    .call(yAxisGenerator)
    .attr("class", "y axis")
    .call(el => reveal(el))


    tooltip(bounds, chartGroup, data, ['change', 'average'], dimensions, xScale, yScale)


  }

    render() {
      const { dimensions } = this.state;

      return (
        <div className='g-pod-chart' ref={el => (this.container = el)}>
        <div className='g-pod-chart-label'>
          <h4>{this.props.label ? this.props.label : this.props.class}</h4>
          <div className='g-pod-chart-legend'>
            {this.props.legend.map(d => <div className='g-pod-chart-legend-item'><div className={`g-pod-chart-legend-item-symbol ${Object.getOwnPropertyNames(d)[0]} ${this.props.class}`}></div>{Object.values(d)[0]}</div>)}
          </div>
        </div>
        {dimensions && (
          <svg
            key={`bar-${this.props.class}-${this.props.filter}`}
            className='g-chart bar'
            ref={node => this.node = node}
            width={dimensions.width}
            height={350}>
          </svg>
        )}
        </div>
      )
      }
  }

  export default BarChart
