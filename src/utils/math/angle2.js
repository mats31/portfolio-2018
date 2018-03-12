export default function (p1, p2, degree = false) {

  if (degree) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
  }

  return Math.atan(p2.y - p1.y, p2.x - p2.y);
}
