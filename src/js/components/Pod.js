import React, {useState, useEffect} from 'react'
require('../../scss/Pod.scss')

export default function Pod({id, heading, chatter, toggle, children, defaultToggle, source}) {

  const [filter, setFilter] = useState(defaultToggle)

  const handleClick = filter => setFilter(filter)

  let charts = toggle ? children.filter(c => c.props.filter === filter) : children

  return(
    <div id={`g-pod-${id}`} key={`g-pod-${id}`} className="g-main-container__pod">
    <a id={`g-pod-anchor-${id}`} className='offset-anchor'/>
    <h3 className='g-pod-heading'>{heading}</h3>
    {toggle ? <div className='g-pod-toggle'>{toggle.map(t => <button className={t.filter === filter ? 'active' : ''} onClick={() => handleClick(t.filter)}>{t.title}</button>)}</div> : ''}
    {chatter ? <div className='g-pod-chatter' dangerouslySetInnerHTML={{__html: chatter}} /> : ''}
      {charts}
    {source ? <div className='g-source' dangerouslySetInnerHTML={{__html: `SOURCE: ${source}`}}></div> : ''}
    </div>
  )
}
