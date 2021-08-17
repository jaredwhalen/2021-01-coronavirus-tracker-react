import getAverage from './getAverage.js'
export default function getWeekAverage(data, property) {
  let weekOfData = data.slice(Math.max(data.length - 7, 0))
  let changesArr = []
  weekOfData.map((d, i) => {
    let y = i ? weekOfData[i - 1] : null
    let change = y ? d[property] - y[property] : d[property]
    i && changesArr.push(change)
  })

  return `<span class='${`g-inline-span ${property.split('_')[1]}'`}>${getAverage(changesArr).toLocaleString(undefined,{'minimumFractionDigits':0,'maximumFractionDigits':0})}</span>`
}
