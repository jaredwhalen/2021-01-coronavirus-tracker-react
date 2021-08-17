import React, {useState, useEffect} from 'react'
let zipCities = require('../../data/delaware_zip_cities.json')
require('../../scss/components/ZipTable.scss')
export default function ZipTable(props) {

  let mapHeight = 670

  const [filter, setFilter] = useState(undefined)
  const [showAll, setShowAll] = useState(undefined)
  const [clicked, setClicked] = useState(false)

  const onInput = (e, handler) => e.target.value.length ? setFilter(e.target.value) : setFilter(undefined)

useEffect(() => {
  (props.dimensions.width > 500) ? setShowAll(true) : !clicked && setShowAll(false)
})

useEffect(() => {
  setShowAll(true)
}, [clicked])

  let { data } = props
  data = JSON.parse(JSON.stringify(data))
  data.map(d => d.city = zipCities.filter(z => z.zip === d.zip)[0].city)

  return (
    <div className='g-pod-chart'>
      <input className='g-search' type="text" placeholder="Search by ZIP code or city..." onChange={e => onInput(e)} />
      <div className='g-y-scroll-table-wrapper' style={{height: mapHeight}}>
        <table>
          <thead>
            <tr className='g-row'>
              <th className='g-cell g-name'>Location</th>
              <th className='g-cell'>Cases</th>
              <th className='g-cell g-cell-subdued g-cell-divide'>Per 10k</th>
              <th className='g-cell'>Deaths</th>
              <th className='g-cell g-cell-subdued'>Per 10k</th>
            </tr>
          </thead>
          <tbody>
            {data
              .filter(d => filter ? (String(d.zip).includes(filter) || String(d.city).toLowerCase().includes(filter.toLowerCase())) : d )
              .filter((d, i) => showAll ? d : i < 10)
              .map(d => {
              return(
                <tr className='g-row'>
                  <td className='g-cell g-name'>
                    {d.zip}
                    <div className='g-cell-city'>{d.city}</div>
                  </td>
                  <td className='g-cell'>{d.cases ? d.cases.toLocaleString() : '-'}</td>
                  <td className='g-cell g-cell-subdued g-cell-divide'>{d.casesPer10k ? d.casesPer10k.toLocaleString() : '-'}</td>
                  <td className='g-cell'>{d.deaths ? d.deaths.toLocaleString() : '-'}</td>
                  <td className='g-cell g-cell-subdued'>{d.deathsPer10k ? d.deathsPer10k.toLocaleString() : '-'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {(!showAll && !clicked)
        ? <button className='g-standalone-button' onClick={() => {
          setClicked(true)
        }}
        >Show all</button>
      : ''}
      </div>
    </div>
  )
}
