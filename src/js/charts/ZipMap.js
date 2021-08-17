import React, { Component } from 'react'
import { geoMercator, geoPath } from 'd3-geo'
import * as topojson from "topojson-client";
import topology from '../../data/delaware_zip_polygon.json'
import { min, max, extent } from 'd3-array'
import { scaleQuantize } from 'd3-scale'
import { select } from 'd3-selection'
import {format} from 'd3-format'

require('../../scss/components/ZipMap.scss')

class ZipMap extends Component {

  constructor(props) {
    super(props)
    this.state = {
        dimensions: null,
        method: 'total',
        metric: 'cases'
      };

      this.handleClick = this.handleClick.bind(this);
      this.handleHover = this.handleHover.bind(this);
  }

  componentDidMount() {
    this.setState({
      dimensions: {
        width: this.container.offsetWidth,
        height: this.container.offsetHeight,
      },
    });
    this.handleHover()
  }

  componentDidUpdate() {
    this.handleHover()
  }

  handleClick(e) {
    e.target.dataset.metric && this.setState({metric: e.target.dataset.metric})
    e.target.dataset.method && this.setState({method: e.target.dataset.method})
  }

  handleHover() {

    let node = this.node
    const tooltip = select("body")
      .append('div')
      .attr('class', 'g-tooltip')
      .style('display', 'none');

    select(node)
      .selectAll('path')
      .on("mouseover", function() {
        select(this).raise()
        tooltip.style("display", null)
      })
      .on("mouseout", function() {
        tooltip.style("display", "none")
      })
      .on('mousemove', mousemove);

    function mousemove(event) {
      let pathData = JSON.parse(event.target.dataset.object)
      let tooltipContent = `
      <h4>ZIP code ${pathData.zip}</h4>
      <div>Cases: ${pathData.cases ? `<strong>${pathData.cases}</strong>` : '<em>No cases reported.</em>'}</div>
      <div>Cases per 10k: ${pathData.casesPer10k ? `<strong>${pathData.casesPer10k}</strong>` : '<em>No cases reported.</em>'}</div>
      <div>Deaths: ${pathData.deaths ? `<strong>${pathData.deaths}</strong>` : '<em>No deaths reported.</em>'}</div>
      <div>Deaths per 10k: ${pathData.deathsPer10k ? `<strong>${pathData.deathsPer10k}</strong>` : '<em>No deaths reported.</em>'}</div>
      `
      let shift = event.pageX < window.innerWidth / 2 ? 20 : 120
      tooltip
        .html(tooltipContent)
        .style("left", (event.pageX - shift) + "px")
        .style("top", (event.pageY - 110) + "px");
    }

  }

   render() {

     let { data } = this.props
     let getColor;
     data = JSON.parse(JSON.stringify(data))
     data.map(d => d.date_confirmed = new Date(d.date_confirmed))

     const { dimensions } = this.state;

     let zips, cities;
     let mapHeight = 600
     let subset = []

     if (dimensions) {
       var geojson = topojson.feature(topology, topology.objects.delaware_zip_polygon);
        const projection = geoMercator()
        .fitSize([dimensions.width, mapHeight], geojson)

        const pathGenerator = geoPath().projection(projection)

        let property = `${this.state.metric}${this.state.method === 'rate' ? `Per10k` : ``}`

        geojson.features
           .forEach((d,i) => {
            let fillData = data.filter(v => v.zip == d.properties.zip_code)[0]
            fillData && fillData[property] && subset.push(fillData[property])

           }
         )

         const colors = this.state.metric === 'cases' ? ['#c6dbef','#9ecae1','#6baed6','#4292c6','#2171b5','#084594'] : ["#b2bcd4","#94a3c0","#6e84af","#566996","#3e5181","#263467"]

         getColor = scaleQuantize().domain([min(subset), max(subset)]).range(colors);



        zips = geojson.features
           .map((d,i) => {

             let fillData = data.filter(v => v.zip == d.properties.zip_code)[0]
             fillData && fillData[property] && subset.push(fillData[property])
             let value = fillData && fillData[property] ? fillData[property] : 0

            return(<path
             key={'path' + i}
             d={pathGenerator(d)}
             className='g-polygon'
             style={{fill: value ? getColor(value) : '#dddddd'}}
             data-object={JSON.stringify(fillData)}
             />)
            }
          )

          let citiesArr = [{
              city: 'Wilmington',
              coordinates: [-75.55042814256949, 39.747833202175016]
            },
            {
              city: 'Newark',
              coordinates: [-75.7550818620012, 39.67831983969895]
            },
            {
              city: 'Dover',
              coordinates: [-75.5247506120598, 39.15958952260507]
            }, {
              city: 'Millsboro',
              coordinates: [-75.29742753108563, 38.59048608966282]
            }
          ]

          cities = citiesArr.map((d, i)=> {
            return(
              <g>
                <circle
                  key={'circle' + i}
                  cx={projection(d.coordinates)[0]}
                  cy={projection(d.coordinates)[1]}
                  r='5px'
                  className='g-city-marker'
                  />
                <text
                  key={'text' + i}
                  x={projection(d.coordinates)[0] + 10}
                  y={projection(d.coordinates)[1]}
                  className='g-city-label halo'
                  >{d.city}
                </text>
                <text
                  key={'text' + i}
                  x={projection(d.coordinates)[0] + 10}
                  y={projection(d.coordinates)[1]}
                  className='g-city-label'
                  >{d.city}
                </text>
              </g>
            )
          })

        }




      return (
        <div className='g-pod-chart' ref={el => (this.container = el)}>
        <div className='g-pod-toggle-group'>
          <div className='g-pod-toggle'>
            <button className={this.state.metric === 'cases' ? 'active' : ''} data-metric='cases' onClick={this.handleClick}>Cases</button>
            <button className={this.state.metric === 'deaths' ? 'active' : ''} data-metric='deaths' onClick={this.handleClick}>Deaths</button>
          </div>
          <div className='g-pod-toggle'>
            <button className={this.state.method === 'total' ? 'active' : ''} data-method='total' onClick={this.handleClick}>Total</button>
            <button className={this.state.method === 'rate' ? 'active' : ''} data-method='rate' onClick={this.handleClick}>Per 10k people</button>
          </div>
        </div>
        <div className='g-pod-chart-label'>
          <h4>{this.state.metric === 'cases' ? 'Confirmed cases' : 'Deaths'} {this.state.method === 'total' ? '' : ' per 10k people'}</h4>
          <div className='g-pod-chart-legend scale'>
            <div className='g-pod-chart-legend-item'><div className='g-pod-chart-legend-item-symbol' style={{backgroundColor: '#dddddd'}}></div><div>No data</div></div>
            {getColor && (getColor.range().map(function(d){
              return(<div className='g-pod-chart-legend-item'><div className='g-pod-chart-legend-item-symbol' style={{backgroundColor: getColor(getColor.invertExtent(d)[0])}}></div><div>{format(".2s")(getColor.invertExtent(d)[0])}</div></div>)
            }))
            }
          </div>
        </div>
          {dimensions && (
            <svg width={dimensions.width} height={mapHeight} ref={node => this.node = node}>
              <g>{zips}</g>
              <g>{cities}</g>
            </svg>
          )}
        </div>
        )
   }
}

export default ZipMap
