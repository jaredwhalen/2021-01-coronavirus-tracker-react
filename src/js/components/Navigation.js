import React from 'react'
require('../../scss/components/Navigation.scss')

export default function Navigation() {

  const sections = ['Cases and deaths', 'Hospitalizations', 'Vaccinations', 'County data', 'ZIP code data']
  const NavigationComponents = sections.map(d => <a href={`#g-pod-anchor-${d.toLowerCase().replace(/ /g, '-')}`}>{d}</a>)

  return(
    <div className='g-navigation'>
      <h4>Jump to a section</h4>
      {NavigationComponents}
    </div>
  )
}
