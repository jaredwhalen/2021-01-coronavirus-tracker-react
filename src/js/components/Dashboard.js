require('../../scss/components/Dashboard.scss')

export default function Dashboard(props) {

  const {cases, hospitalizations, vaccinations} = props.data

  const delawarePop = 973764;

  const getTail = (arr, n) => arr[arr.length - n]
  const addPrefix = (num) => {
    if (num >= 0) {
      return '+' + num.toLocaleString()
    } else {
      return num.toLocaleString()
    }
  }
  return(
    <div id='g-dashboard'>
      <div className="g-dashboard-pod-container">

        <div className="g-dashboard-pod">
          <div className="g-dashboard-pod-section cases">
            <div className="g-big-number">{getTail(cases, 1).delaware_cases.toLocaleString()}</div>
            <div className="g-big-number-label">confirmed cases</div>
            <div className="g-big-number-label rate"><b>{(getTail(cases, 1).delaware_cases / delawarePop * 10000).toFixed(0).toLocaleString()}</b> per 10k people</div>
            <div className="g-big-number-label secondary"><strong>+{getTail(cases, 1).delaware_cases - getTail(cases, 2).delaware_cases}</strong> since {getTail(cases, 2).date_confirmed.getMonth() + 1}/{getTail(cases, 2).date_confirmed.getDate()} update</div>
          </div>
        </div>

        <div className="g-dashboard-pod">
          <div className="g-dashboard-pod-section deaths">
            <div className="g-big-number">{getTail(cases, 1).delaware_deaths.toLocaleString()}</div>
            <div className="g-big-number-label">confirmed deaths</div>
            <div className="g-big-number-label rate"><b>{(getTail(cases, 1).delaware_deaths / delawarePop * 10000).toFixed(0).toLocaleString()}</b> per 10k people</div>
            <div className="g-big-number-label secondary"><strong>+{getTail(cases, 1).delaware_deaths - getTail(cases, 2).delaware_deaths}</strong> since {getTail(cases, 2).date_confirmed.getMonth() + 1}/{getTail(cases, 2).date_confirmed.getDate()} update</div>
          </div>
        </div>

        <div className="g-dashboard-pod">
          <div className="g-dashboard-pod-section vaccinations">
            <div className="g-big-number">{getTail(vaccinations, 1).vaccinated.toLocaleString()}</div>
            <div className="g-big-number-label">people fully vaccinated</div>
            <div className="g-big-number-label rate"><b>{Number((getTail(vaccinations, 1).vaccinated / delawarePop * 10000).toFixed(0)).toLocaleString()}</b> per 10k people</div>
            <div className="g-big-number-label secondary"><strong>+{(getTail(vaccinations, 1).vaccinated - getTail(vaccinations, 2).vaccinated).toLocaleString()}  </strong> since {getTail(vaccinations, 2).date_confirmed.getMonth() + 1}/{getTail(vaccinations, 2).date_confirmed.getDate()} update</div>
          </div>
        </div>

        <div className="g-dashboard-pod">
          <div className="g-dashboard-pod-section hospitalized">
            <div className="g-big-number">{getTail(hospitalizations, 1).delaware_hospitalized.toLocaleString()}</div>
            <div className="g-big-number-label">Hospitalized</div>
            <div className="g-big-number-label secondary"><strong>{ addPrefix((getTail(hospitalizations, 1).delaware_hospitalized - getTail(hospitalizations, 2).delaware_hospitalized).toLocaleString())}  </strong> since {getTail(hospitalizations, 2).date_confirmed.getMonth() + 1}/{getTail(hospitalizations, 2).date_confirmed.getDate()} update</div>
          </div>
        </div>

      </div>

      <div className='datestamp'>SOURCE: Delaware Division of Public Health. Data are current as of 6pm the previous day. Last update:&nbsp;{getTail(cases, 1).date_confirmed.getMonth() + 1}/{getTail(cases, 1).date_confirmed.getDate()}/{getTail(cases, 1).date_confirmed.getFullYear()}</div>
    </div>
  )


}
