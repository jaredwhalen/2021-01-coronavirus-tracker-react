export default function Intro() {

  let pList = document.querySelector('.article-inner') && document.querySelector('.article-inner').querySelectorAll('p:not(.g-intro-p)')
  let pComponents = pList && Array.from(pList).map((p, i) => <p key={'p-'+i} className='g-intro-p'>{p.textContent}</p>)

  return(
    <>
      <p className='g-intro-p'><em>We are providing this content free as a public service to readers during the coronavirus outbreak. Please support the work we're doing by <a href='https://cm.delawareonline.com/specialoffer'>subscribing to Delaware Online</a>.</em></p>
      {pComponents || ''}
    </>
  )
}
