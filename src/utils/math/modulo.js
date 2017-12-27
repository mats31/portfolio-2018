export default function (value, length) {
  return (value % length + length) % length;
}
