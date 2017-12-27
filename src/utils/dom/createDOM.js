export default function createDOM(value) {
  const temp = document.createElement('div');
  temp.innerHTML = value;

  return temp.firstChild;
}
