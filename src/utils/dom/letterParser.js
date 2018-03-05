export default function (textElement) {
  const childNodes = textElement.childNodes;

  for (let i = 0; i < childNodes.length; i++) {
    if (childNodes[i].nodeType === window.Node.TEXT_NODE) {
      const textNode = childNodes[i].textContent;
      const newText = document.createElement('div');
      newText.classList.add('js-letters__container');
      newText.classList.add('letters__container');

      const words = textNode.split(' ');

      for (let j = 0; j < words.length; j++) {
        const div = document.createElement('div');
        div.classList.add('js-textContainer__word');
        div.classList.add('textContainer__word');

        for (let k = 0; k < words[j].length; k++) {
          const span = document.createElement('span');
          span.classList.add('js-textContainer__letter');
          span.classList.add('textContainer__letter');
          span.innerHTML = words[j][k];

          div.appendChild(span);
        }

        newText.appendChild(div);
      }

      childNodes[i].parentNode.replaceChild(newText, childNodes[i]);
    }
  }

  return childNodes;
}
