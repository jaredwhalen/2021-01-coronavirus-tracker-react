import parseDate from './parseDate.js'

const getGsxProp = (prop) => {
  let obj = {};
  for (const [key, value] of Object.entries(prop)) {
    if (key.includes('gsx$')) {
      let property = key.replace('gsx$', '')
      if (property === 'dateconfirmed') {
        obj[property] = parseDate(value.$t)
      } else {
        obj[property] = Number(value.$t)
      }
    }
  }
  return obj
}

export default getGsxProp
