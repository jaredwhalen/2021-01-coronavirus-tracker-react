import React, {
  Component
} from 'react'

import { scaleLinear, scaleTime } from 'd3-scale'
import { max, extent } from 'd3-array'
import { select } from 'd3-selection'
import { timeFormat } from 'd3-time-format'
import { timeDays, timeMonth } from 'd3-time'
import { line, area } from 'd3-shape'
import {axisBottom, axisLeft } from 'd3-axis'
import {easeLinear} from 'd3-ease'
import {format} from 'd3-format'

import getPositivityRate from '../util/getPositivityRate.js'
import getDimensions from '../util/getDimensions.js'
import makeYGridlines from './makeYGridlines.js'
import reveal from './reveal.js'
import tooltip from './tooltip.js'

require('../../scss/charts.scss')

class LineChart extends Component {

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
    data.map(d => {
      // TEMPORARY VACCINE DATE FIX
      if (this.props.class === 'vaccinations') {
        let xd = new Date(d.date_confirmed)
        xd.setDate(xd.getDate()-1);
        d.date_confirmed = xd
      } else {
        d.date_confirmed = new Date(d.date_confirmed)
      }
    })

    // testing chart exception
    if (this.props.class === 'testing') {
      data.map((d, i) => {
        let date = d.date_confirmed
        let weekAgo = new Date(date.getDate() - 7);
        if (data[0].date_confirmed >= weekAgo) {
          let past_week = data.slice(i - 7, i)
          let rate = past_week.length && getPositivityRate(past_week, 'delaware')
          d['delaware_positivityRate'] = past_week.length && rate
        }
      })

    }

    let xAccessor = d => d.date_confirmed
    const yAccessorArr = typeof this.props.yAccessor === 'string' ? [this.props.yAccessor] : this.props.yAccessor
    let maxes = []
    yAccessorArr.forEach(a => maxes.push(max(data, d => d[a])))

    const yAccessor = d => d[yAccessorArr[0]]
    let dateRange = timeDays(xAccessor(data[0]), new Date())

    let dimensions = getDimensions(this.container.offsetWidth)

    let node = this.node
    select(node).html('')
    let bounds = select(node)
      .append("g")
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
      .domain([0, max(maxes) * 1.1]);

    makeYGridlines(bounds, yScale, dimensions)

    var chartGroup = bounds
      .append('g')
      .attr('class', 'chartGroup ' + this.props.class)


    const addLine = (f) => {

      let clipId = `rectClip-${f}-${this.props.class}`

      chartGroup.append("clipPath")
        .attr("id", clipId)
        .append("rect")
        .attr("width", 0)
        .attr("height", dimensions.boundedHeight)
        .transition()
        .duration(transitionDuration)
        .ease(easeLinear)
        .attr("width", dimensions.boundedWidth)

      if (!this.props.noArea) {
        chartGroup.append("path")
          .datum(data.filter(function(d) {
            return d[f]
          }))
          .attr('class', 'area')
          .attr("d", area()
            .x(function(d) {
              return xScale(xAccessor(d))
            })
            .y0(yScale(0))
            .y1(function(d) {
              return yScale(d[f])
            })
          )
          .attr("clip-path", `url(#${clipId})`)
      }


      var path = chartGroup.append("path")
        .datum(data.filter(function(d) {
          return d[f]
        }))
        .attr('class', 'line ' + f)
        .attr("fill", "none")
        .attr("d", line()
          .x(function(d) {
            return xScale(xAccessor(d))
          })
          .y(function(d) {
            return yScale(d[f])
          })
        )
        .attr("clip-path", `url(#${clipId})`)

      path
        .attr("clip-path", `url(#${clipId})`);



    }

    if (typeof this.props.yAccessor === 'string') {
      addLine(this.props.yAccessor)
    } else {
      this.props.yAccessor.forEach(f => addLine(f))
    }

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
      .tickFormat(d => this.props.class === 'testing' ? `${d}%` : format("~s")(d))

    let yAxis = bounds.append("g")
      .call(yAxisGenerator)
      .attr("class", "y axis")
      .call(el => reveal(el))

    tooltip(bounds, chartGroup, data, this.props.yAccessor, dimensions, xScale, yScale)

  }
    render() {
      const { dimensions } = this.state;
      return (
        <div className='g-pod-chart' ref={el => (this.container = el)}>
        <div className='g-pod-chart-label'>
          <h4>{this.props.label ? this.props.label : this.props.class}</h4>
          <div className='g-pod-chart-legend'>
            {this.props.legend.map(d => <div className='g-pod-chart-legend-item'><div className={`g-pod-chart-legend-item-symbol ${Object.getOwnPropertyNames(d)[0]} ${Object.values(d)[0].replace(' ', '').toLowerCase()} ${this.props.class}`}></div>{Object.values(d)[0]}</div>)}
          </div>
        </div>
        {dimensions && (
          <svg
            className='g-chart line'
            ref={node => this.node = node}
            width={dimensions.width}
            height={350}>
          </svg>
        )}
      </div>
    )
      }
  }
  export default LineChart
