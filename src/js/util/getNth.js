export default function getNth(data, property, n = 1) {
  return `<span class='${`g-inline-span ${property.split('_')[1]}'`}>${data[data.length-n][property].toLocaleString()}</span>`
}
