export default function createHexagone({
  side = 0,
  size = 100,
  x = 0,
  y = 0,
  context = null,
  stroke = true,
  fill = false,
  strokeColor = 'black',
  fillColor = 'black',
  rotation = 0,
} = {}) {
  if (!context) {
    console.error('Create hexagone: no context provided.');
    return false;
  }

  context.beginPath();
  context.moveTo(x + size * Math.cos(0 + rotation), y + size * Math.sin(0 + rotation));

  for (side; side < 7; side++) {
    context.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6 + rotation), y + size * Math.sin(side * 2 * Math.PI / 6 + rotation));
  }

  if (stroke) {
    context.fillStyle = strokeColor;
    context.stroke();
  }

  if (fill) {
    context.fillStyle = fillColor;
    context.fill();
  }

  return true;
}
