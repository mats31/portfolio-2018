export default function distance2(p1, p2) {
  const a = p1.x - p2.x;
  const b = p1.y - p2.y;

  return Math.sqrt( a * a + b * b );
}
