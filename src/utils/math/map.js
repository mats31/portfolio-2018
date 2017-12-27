export default function (value, minA, maxA, minB, maxB) {
  return (value - minA) / (maxA - minA) * (maxB - minB) + minB;
}
