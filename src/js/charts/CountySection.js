import React, {useState} from 'react'

import LineChart from "./LineChart.js"

require('../../scss/components/CountySection.scss')

export default function CountySection(props) {

  let [filter, setFilter] = useState('total')

  let handleClick = filter => setFilter(filter)

  let county_pops = {
    newcastle: 558753,
    kent: 180786,
    sussex: 234225
  }

  let { data } = props
  data = JSON.parse(JSON.stringify(data))

  data.map(d => {
    d.date_confirmed = new Date(d.date_confirmed)
    for (var county of Object.keys(county_pops)) {
      ['cases', 'deaths'].forEach(a => d[county + '_' + a + '_per10k'] = d[county + '_' + a] / county_pops[county] * 10000)
    }
  })

  let t = data[data.length - 1];
  let y = data[data.length - 2];

  let getLatest = (county, property, t, y) => {
    let l = t[county + '_' + property] - y[county + '_' + property]
    return l > 0 ? `+${l.toLocaleString()}` : 0
  }

  let rowletructor = countyFull => {
    let county = countyFull.replace(' ', '').toLowerCase()

    return (
      <tr className='g-row'>
        <td className='g-cell g-name'>{countyFull}</td>
        <td className='g-cell g-cases'>{t[county + '_cases'].toLocaleString()}</td>
        <td className='g-cell g-cases-per'>{t[county + '_cases_per10k'].toFixed(1).toLocaleString()}</td>
        <td className='g-cell g-cases-latest'>{getLatest(county, 'cases', t, y)}</td>
        <td className='g-cell g-deaths'>{t[county + '_deaths'].toLocaleString()}</td>
        <td className='g-cell g-deaths-per'>{t[county + '_deaths_per10k'].toFixed(1).toLocaleString()}</td>
        <td className='g-cell g-deaths-latest'>{getLatest(county, 'deatjs', t, y)}</td>
      </tr>
    )
  }

  return (
    <>
      <div className='g-pod-toggle'>
        <button className={filter === 'total' ? 'active' : ''} onClick={() => handleClick('total')}>Total</button>
        <button className={filter === 'rate' ? 'active' : ''} onClick={() => handleClick('rate')}>Per 10k people</button>
      </div>

      { //chek filter
        (filter === 'total' )
        ? (<>
          <LineChart class='county_cases' noArea={true} label='Total cases' data={data} filter='total' yAccessor={['newcastle_cases', 'kent_cases', 'sussex_cases']} legend={[{line: 'New Castle'},{line: 'Kent'},{line: 'Sussex'}]}/>
          <LineChart class='county_deaths' noArea={true} label='Total deaths' data={data} filter='total' yAccessor={['newcastle_deaths', 'kent_deaths', 'sussex_deaths']} legend={[{line: 'New Castle'},{line: 'Kent'},{line: 'Sussex'}]}/>
          </>)
        : (<>
          <LineChart class='county_cases' noArea={true} label='Cases per 10k people' data={data} filter='total' yAccessor={['newcastle_cases_per10k', 'kent_cases_per10k', 'sussex_cases_per10k']} legend={[{line: 'New Castle'},{line: 'Kent'},{line: 'Sussex'}]}/>
          <LineChart class='county_deaths' noArea={true} label='Deaths per 10k people' data={data} filter='total' yAccessor={['newcastle_deaths_per10k', 'kent_deaths_per10k', 'sussex_deaths_per10k']} legend={[{line: 'New Castle'},{line: 'Kent'},{line: 'Sussex'}]}/>
          </>)
      }
      <div className='g-h-scroll-table-wrapper'>
        <table>
          <thead>
            <tr className='g-row'>
              <th className='g-cell g-name'></th>
              <th className='g-cell g-cases'>Cases</th>
              <th className='g-cell g-cases-per'>Per 10k</th>
              <th className='g-cell g-cases-latest'>Latest</th>
              <th className='g-cell g-deaths'>Deaths</th>
              <th className='g-cell g-deaths-per'>Per 10k </th>
              <th className='g-cell g-deaths-per'>Latest</th>
            </tr>
          </thead>
          {rowletructor('New Castle')}
          {rowletructor('Kent')}
          {rowletructor('Sussex')}
        </table>
      </div>

    </>
  )
}
