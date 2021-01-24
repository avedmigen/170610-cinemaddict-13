import CardView from "../view/card.js";
import PopupView from "../view/popup.js";
import CommentView from "../view/comment.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  POPUP: `POPUP`
};

const Keys = {
  ESC: `Escape` || `Esc`,
  ENTER: `Enter`,
};

const siteBodyElement = document.querySelector(`body`);

export default class Movie {
  constructor(moviesListContainer, changeData, changeMode) {
    this._moviesListContainer = moviesListContainer;

    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._popupComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleShowPopupClick = this._handleShowPopupClick.bind(this);
    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleCtrlEnterKeysDown = this._handleCtrlEnterKeysDown.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);

    this._handleEmojiClick = this._handleEmojiClick.bind(this);
  }

  init(movie) {
    this._movie = movie;

    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;

    this._cardComponent = new CardView(movie);
    this._popupComponent = new PopupView(movie);

    this._cardComponent.setShowPopupClickHandler(this._handleShowPopupClick);

    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._cardComponent.setFavoritesClickHandler(this._handleFavoritesClick);

    this._popupComponent.setCloseButtonClickHandler(this._handlePopupCloseButtonClick);

    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritesClickHandler(this._handleFavoritesClick);

    this._popupComponent.setEmojiClickHandler(this._handleEmojiClick);


    if (prevCardComponent === null) {
      render(this._moviesListContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._cardComponent, prevCardComponent);
      replace(this._popupComponent, prevPopupComponent);
    }
  }

  destroy() {
    remove(this._cardComponent);
    remove(this._popupComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closePopup();
    }
  }

  _openPopup() {
    render(siteBodyElement, this._popupComponent, RenderPosition.BEFOREEND);
    siteBodyElement.classList.add(`hide-overflow`);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    document.addEventListener(`keydown`, this._handleCtrlEnterKeysDown);
    this._changeMode();
    this._mode = Mode.POPUP;
  }

  _closePopup() {
    this._popupComponent.getElement().remove();
    siteBodyElement.classList.remove(`hide-overflow`);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    document.removeEventListener(`keydown`, this._handleCtrlEnterKeysDown);
    this._mode = Mode.DEFAULT;
  }

  _handleEscKeyDown(e) {
    if (e.key === Keys.ESC) {
      e.preventDefault();
      this._closePopup();
    }
  }

  _handleCtrlEnterKeysDown(e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === Keys.ENTER)) {
      e.preventDefault();
      console.log(`контрол энтер`);
    }
  }

  _handleShowPopupClick() {
    this._openPopup();
  }

  _handleWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._movie,
            {
              isWatchlist: !this._movie.isWatchlist
            }
        )
    );
  }

  _handleWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._movie,
            {
              isWatched: !this._movie.isWatched
            }
        )
    );
  }

  _handleFavoritesClick() {
    this._changeData(
        Object.assign(
            {},
            this._movie,
            {
              isFavorite: !this._movie.isFavorite
            }
        )
    );
  }

  _handlePopupCloseButtonClick() {
    this._closePopup();
  }

  _handleEmojiClick() {
    console.log(`_handleEmojiClick`);
  }

}
