require('../../scss/components/Loader.scss')

export default function Loader() {
  return(
    <div className='loader-wrapper'>
      <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>
  )
}
