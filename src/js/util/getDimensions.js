export default function getDimensions(width) {
  let dimensions = {
    width: width,
    height: 350,
    margin: {
      top: 10,
      right: 20,
      bottom: 50,
      left: 10,
    },
  }
  dimensions.boundedWidth = dimensions.width -
    dimensions.margin.left -
    dimensions.margin.right
  dimensions.boundedHeight = dimensions.height -
    dimensions.margin.top -
    dimensions.margin.bottom

  return dimensions
}
