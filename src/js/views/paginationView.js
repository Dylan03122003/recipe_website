import View from './view.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');
  _generateMarkup() {
    const currentPage = this._data.page;
    const numberOfPages = Math.ceil(
      this._data.result.length / this._data.resultsPerPage
    );
    // Page 1, and there are still other pages
    if (currentPage === 1 && numberOfPages > 1) {
      return `${this._generateMarkupPageNextBtn(currentPage)}`;
    }
    // In last page
    if (currentPage === numberOfPages && numberOfPages > 1) {
      return `${this._generateMarkupPagePreviousBtn(currentPage)}`;
    }
    // In other page, like between
    if (currentPage < numberOfPages) {
      return `${this._generateMarkupPagePreviousBtn(
        currentPage
      )}${this._generateMarkupPageNextBtn(currentPage)}`;
    }
    // Page 1, and there is no other page
    return '';
  }
  _generateMarkupPagePreviousBtn(currentPage) {
    return `
   <button data-goto="${
     currentPage - 1
   }" class="btn--inline pagination__btn--prev">
     <svg class="search__icon">
      <use href="${icons}#icon-arrow-left"></use>
     </svg>
     <span>Page ${currentPage - 1}</span>
   </button>
   `;
  }
  _generateMarkupPageNextBtn(currentPage) {
    return `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
       <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
   `;
  }
  addHandlerPagination(handler) {
    this._parentElement.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const gotoPage = +btn.dataset.goto;
      handler(gotoPage);
    });
  }
}
export default new PaginationView();
