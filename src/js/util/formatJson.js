import parseDate from './parseDate.js'

const formatJson = objects => {
  for (var i = 0; i < objects.length; i++) {
    var obj = objects[i];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop] !== null && !isNaN(obj[prop])) {
        obj[prop] = +obj[prop];
      } else if (obj[prop] === 'NA') {
        obj[prop] = null
      } else if (obj.hasOwnProperty(prop) && obj[prop] !== null && prop === 'date_confirmed') {
        obj[prop] = parseDate(obj[prop])
      }
    }
  }
}

export default formatJson
