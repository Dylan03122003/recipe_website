import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup); // convert string html to actual elements
    const newElements = Array.from(newDom.querySelectorAll('*')); // return the NodeList of all new elements
    const curElements = Array.from(this._parentElement.querySelectorAll('*')); // return the NodeList of all current elements
    newElements.forEach((newElm, i) => {
      const curElm = curElements[i];
      // If new element is not equal to current element
      // And the first content inside the new element must be text (not div, not p, not span,...)
      if (
        !newElm.isEqualNode(curElm) &&
        newElm.firstChild?.nodeValue.trim() !== ''
      )
        curElm.textContent = newElm.textContent; // update the new serving text

      if (!newElm.isEqualNode(curElm)) {
        Array.from(newElm.attributes).forEach(attr => {
          curElm.setAttribute(attr.name, attr.value); // change value of attribute to new value, like class="preview" => class="active-preview"
        });
      }
    });
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpinner() {
    const markup = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
  <div class="error">
   <div>
    <svg>
      <use href="${icons}#icon-alert-triangle"></use>
    </svg>
   </div>
     <p>${message}</p>
  </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
