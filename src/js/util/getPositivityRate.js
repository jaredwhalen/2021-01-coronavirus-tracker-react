import getAverage from './getAverage.js'
export default function getPositivityRate(data, location) {
  let weekOfData = data.slice(Math.max(data.length - 7, 0))

  let testChangesArr = []
  let caseChangesArr = []

  weekOfData.map((d, i) => {
    let y = i ? weekOfData[i - 1] : null
    let testChange = y ? d[location + '_tests'] - y[location + '_tests'] : d[location + '_tests']
    let caseChange = y ? d[location + '_positiveTests'] - y[location + '_positiveTests'] : d[location + '_positiveTests']
    i && testChangesArr.push(testChange);
    i && caseChangesArr.push(caseChange)
  })

  return getAverage(caseChangesArr) / getAverage(testChangesArr) * 100
}
