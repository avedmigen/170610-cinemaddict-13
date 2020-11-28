import {createElement} from "../mock/utils";

const createFooterStatisticsTemplate = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStatisticsView {
  constructor(count) {
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createFooterStatisticsTemplate(this._count);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
