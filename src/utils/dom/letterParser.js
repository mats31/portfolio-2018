export default function (textElement) {
  const childNodes = textElement.childNodes;

  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType === window.Node.TEXT_NODE) {
      const textNode = childNodes[i].textContent;
      const newText = document.createElement('div');
      newText.classList.add('js-letters__container');
      newText.classList.add('letters__container');

      for (let j = 0; j < textNode.length; j++) {
        const span = document.createElement('span');
        span.classList.add('js-textContainer__letter');
        span.classList.add('textContainer__letter');
        span.innerHTML = textNode[j];

        newText.appendChild(span);
      }

      childNodes[i].parentNode.replaceChild(newText, childNodes[i]);
    }
  }
}
