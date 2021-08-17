import React, {
  useState,
  useEffect,
  useRef
} from 'react';
import * as d3 from 'd3'
import '../scss/App.scss';

import Loader from "./components//Loader.js"
import Dashboard from "./components/Dashboard.js"
import Intro from './components/Intro.js'
import Navigation from './components/Navigation.js'
import Pod from './components/Pod.js'

// Charts
import LineChart from "./charts/LineChart.js"
import BarChart from "./charts/BarChart.js"
import CountySection from './charts/CountySection.js'
import ZipMap from './charts/ZipMap.js'
import ZipTable from './charts/ZipTable.js'

import getGsxProp from './util/getGsxProp.js'
import formatJson from './util/formatJson.js'
import makeid from './util/makeId.js'
import getWeekAverage from './util/getWeekAverage.js'
import getNth from './util/getNth.js'
import getPositivityRate from './util/getPositivityRate.js'


function debounce(fn, ms) {
  let timer
  return _ => {
    clearTimeout(timer)
    timer = setTimeout(_ => {
      timer = null
      fn.apply(this, arguments)
    }, ms)
  };
}


function App() {

  const [data, setData] = useState(undefined)

  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth
  })

  useEffect(() => {



    const debouncedHandleResize = debounce(function handleResize() {

      if (dimensions.width !== window.innerWidth) {
            console.log(window.innerWidth)
            setDimensions({
              width: window.innerWidth
            })
      }

    }, 1000)

    window.addEventListener('resize', debouncedHandleResize)

    return _ => {
      window.removeEventListener('resize', debouncedHandleResize)
    }
  })


  useEffect(() => {

    Promise.all([
        d3.csv("https://www.gannett-cdn.com/delaware-online/storytelling-embeds/master/projects/2021-01-coronavirus-tracker-react/data/delaware-cases-data.csv?" + makeid(100)),
        d3.csv("https://www.gannett-cdn.com/delaware-online/storytelling-embeds/master/projects/2021-01-coronavirus-tracker-react/data/delaware-hospitalization-data.csv?" + makeid(100)),
        d3.csv("https://www.gannett-cdn.com/delaware-online/storytelling-embeds/master/projects/2021-01-coronavirus-tracker-react/data/delaware-vaccination-data-3.csv?" + makeid(100)),
        d3.csv("https://www.gannett-cdn.com/delaware-online/storytelling-embeds/master/projects/2021-01-coronavirus-tracker-react/data/delaware-zip-code-case-data.csv?" + makeid(100)),
    ]).then(function(files) {
        files.map(f => formatJson(f))
        files.map(f => f.sort((a, b) => a.date_confirmed.getTime() - b.date_confirmed.getTime()))
        console.log(files[1])
        setData({
          cases: files[0],
          hospitalizations: files[1],
          vaccinations: files[2].filter(d => d.date_confirmed >= new Date('2020-12-01')),
          zipData: files[3]
        })
    }).catch(function(err) {
        // handle error here
    })
    // document.querySelector('.topper__timestamp').innerHTML = 'test'
  }, [])

console.log(data)

  return ( <div className = "App" > {
      data ?
      <>
        <Dashboard data={data}/>
        <Intro />

        <div className="g-main-container">

          <Navigation />

          <Pod
            id='cases-and-deaths'
            heading='Cases and deaths'
            chatter={`Over the past week, there have been an average of ${getWeekAverage(data.cases, 'delaware_cases')} new cases and ${getWeekAverage(data.cases, 'delaware_deaths')} deaths each day in Delaware. In total, there have been ${getNth(data.cases, 'delaware_cases')} cases and ${getNth(data.cases, 'delaware_deaths')} deaths.`}
            toggle={[{filter: 'daily', title: 'daily'}, {filter: 'total', title: 'total'}]}
            defaultToggle='daily'
            source='<a target="_blank" href="https://myhealthycommunity.dhss.delaware.gov/locations/state">Delaware Division of Public Health</a>'
            >
            <LineChart class='cases' label='Cases' data={data.cases} filter='total' yAccessor='delaware_cases' legend={[{line: 'Total cases'}]}/>
            <LineChart class='deaths' label='Deaths' data={data.cases} filter='total' yAccessor='delaware_deaths' legend={[{line: 'Total deaths'}]} />
            <BarChart class='cases' label='Cases' data={data.cases} filter='daily' yAccessor='delaware_cases' legend={[{square: 'Daily cases'}, {line: '7-day average'}]}/>
            <BarChart class='deaths' label='Deaths' data={data.cases} filter='daily' yAccessor='delaware_deaths' legend={[{square: 'Daily deaths'}, {line: '7-day average'}]}/>
          </Pod>


          {/*<Pod
            id='testing'
            heading='Testing'
            chatter={`Over the past week, Delaware reported an average of ${getWeekAverage(data.cases, 'delaware_tests')} new test results each day and an average positivity rate of <span class='g-inline-span tests'>${getPositivityRate(data.cases, 'delaware').toFixed(1)}%</span>. In total, there have been ${getNth(data.cases, 'delaware_tests')} reported tests. Percent of tests that are positive indicates the total number of specimens tested, including when an individual is tested more than once.`}
            source='<a target="_blank" href="https://myhealthycommunity.dhss.delaware.gov/locations/state">Delaware Division of Public Health</a>'
            >
            <BarChart class='testing' label='Tests per day' data={data.cases} yAccessor='delaware_tests' legend={[{square: 'Daily tests'}, {line: '7-day average'}]}/>
            <LineChart class='testing' label='Positivity rate' data={data.cases} yAccessor='delaware_positivityRate' legend={[{line: '7-day average'}]}/>
          </Pod>*/}

          <Pod
            id='hospitalizations'
            heading='Hospitalizations'
            chatter={`There are currently ${getNth(data.hospitalizations, 'delaware_hospitalized')} people hospitalized due to the coronavirus in Delaware.`}
            source='<a target="_blank" href="https://myhealthycommunity.dhss.delaware.gov/locations/state">Delaware Division of Public Health</a>'
            >
            <LineChart class='hospitalizations' label=' '  data={data.hospitalizations} yAccessor='delaware_hospitalized' legend={[{line: 'Current hospitalizations'}]}/>
          </Pod>



          <Pod
            id='vaccinations'
            heading='Vaccinations'
            chatter={`In total, ${getNth(data.vaccinations, 'vaccinated')} people have been fully vaccinated in Delaware.`}
            source='<a target="_blank" href="https://myhealthycommunity.dhss.delaware.gov/locations/state">Delaware Division of Public Health</a>'
            >
            <BarChart class='vaccinations' label='People fully vaccinated daily' data={data.vaccinations} filter='daily' yAccessor='vaccinated' legend={[{square: 'People fully vaccinated daily'}, {line: '7-day average'}]}/>
            <LineChart class='vaccinations' label='Total people fully vaccinated' data={data.vaccinations} yAccessor='vaccinated' legend={[{line: 'Total people fully vaccinated'}]}/>
          </Pod>

          <Pod
            id='county-data'
            heading='Infection numbers and deaths by county'
            source='<a target="_blank" href="https://myhealthycommunity.dhss.delaware.gov/locations/state">Delaware Division of Public Health</a>; U.S. Census Bureau'
            >
            <CountySection data={data.cases} />
          </Pod>

          <Pod
            id='zip-code-data'
            heading='Infection rate by ZIP code'
            chatter='In order to protect privacy, the state only releases case and death data for locations where the number of cases is ten or more. As a result, ZIP codes with no available data may have cases not shown.'
            source='<a target="_blank" href="https://myhealthycommunity.dhss.delaware.gov/locations/state">Delaware Division of Public Health</a>'
            >
            <ZipMap data={data.zipData}/>
            <ZipTable data={data.zipData} dimensions={dimensions}/>
          </Pod>

        </div>
      </>
      : <Loader/>
    } </div>
  );
}

export default App;


// chatter={`Over the past week, an average of ${getWeekAverage(data.vaccinations, 'vaccinated')} doses of the coronavirus vaccine were were administered daily in Delaware. In total, ${getNth(data.vaccinations, 'delaware_delivered')} doses have been delivered and ${getNth(data.vaccinations, 'vaccinated')} doses have been administered.`}
