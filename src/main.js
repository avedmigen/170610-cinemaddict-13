import {createProfileTemplate} from "./view/profile.js";
import {createMainNavigationTemplate} from "./view/main-navigation.js";
import {createSortTemplate} from "./view/sort.js";
import {createFilmsTemplate} from "./view/films.js";
import {createFilmCardTemplate} from "./view/film-card.js";
import {createShowMoreButtonTemplate} from "./view/show-more-button.js";
import {createFooterStatisticsTemplate} from "./view/footer-statistics.js";
import {createFilmDetailsPopupTemplate} from "./view/film-details-popup.js";
import {createCommentTemplate} from "./view/comment.js";
import {sortByFieldDescending} from "./mock/utils.js";
import {generateFilm} from "./mock/film.js";
import {generateComment} from "./mock/comment.js";

const FILMS_CARDS_COUNT = 5;
const FILMS_CARDS_EXTRA_COUNT = 2;
const MAX_MOCK_FILMS_COUNT = 13;

const Key = {
  ESC: `Escape`,
};

const films = new Array(MAX_MOCK_FILMS_COUNT).fill(0).map(generateFilm);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const removeActiveClass = (array, className) => {
  array.forEach((item) => {
    item.classList.remove(className);
  });
};

const clearRenderedFilms = () => {
  while (filmsListContainerElement.firstChild) {
    filmsListContainerElement.removeChild(filmsListContainerElement.lastChild);
  }
};

const siteBodyElement = document.querySelector(`body`);
const siteHeaderElement = siteBodyElement.querySelector(`.header`);
const siteMainElement = siteBodyElement.querySelector(`.main`);

render(siteHeaderElement, createProfileTemplate(), `beforeend`);
render(siteMainElement, createMainNavigationTemplate(), `afterbegin`);

const watchlistFilms = films.filter((item) => {
  return item.isWatchlist === true;
});

const watchlistElement = siteMainElement.querySelector(`a[href="#watchlist"]`);
watchlistElement.children[0].textContent = watchlistFilms.length;

const watchedFilms = films.filter((item) => {
  return item.isWatched === true;
});

const historyElement = siteMainElement.querySelector(`a[href="#history"]`);
historyElement.children[0].textContent = watchedFilms.length;

const favoritesFilms = films.filter((item) => {
  return item.isFavorite === true;
});

const favoritesElement = siteMainElement.querySelector(`a[href="#favorites"]`);
favoritesElement.children[0].textContent = favoritesFilms.length;

render(siteMainElement, createSortTemplate(), `beforeend`);

const sortMenuItems = siteMainElement.querySelectorAll(`.sort__button`);

const onSortMenuItemClick = (e) => {
  e.preventDefault();
  removeActiveClass(sortMenuItems, `sort__button--active`);
  e.target.classList.toggle(`sort__button--active`);

  let sortCount = FILMS_CARDS_COUNT;

  switch (e.target.textContent) {
    case `Sort by default`:
      clearRenderedFilms();
      const byDefaultFilms = films.slice();

      for (let i = 0; i < sortCount; i++) {
        render(filmsListContainerElement, createFilmCardTemplate(byDefaultFilms[i]), `beforeend`);
      }
      break;
    case `Sort by date`:
      clearRenderedFilms();

      const byDateFilms = films.slice().sort(sortByFieldDescending(`year`));
      for (let i = 0; i < sortCount; i++) {
        render(filmsListContainerElement, createFilmCardTemplate(byDateFilms[i]), `beforeend`);
      }
      break;
    case `Sort by rating`:
      clearRenderedFilms();
      const byRatingFilms = films.slice().sort(sortByFieldDescending(`rating`));
      for (let i = 0; i < sortCount; i++) {
        render(filmsListContainerElement, createFilmCardTemplate(byRatingFilms[i]), `beforeend`);
      }
      break;
    default:
      break;
  }
};

sortMenuItems.forEach((item) => {
  item.addEventListener(`click`, onSortMenuItemClick);
});

render(siteMainElement, createFilmsTemplate(), `beforeend`);

const filmsElement = document.querySelector(`.films`);
const filmsListElement = filmsElement.querySelector(`.films-list`);

const filmsListContainerElement = filmsListElement.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_CARDS_COUNT; i++) {
  render(filmsListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
}

render(filmsListElement, createShowMoreButtonTemplate(), `beforeend`);

const showMoreButton = filmsListElement.querySelector(`.films-list__show-more`);

const onShowMoreButtonClick = (e) => {
  e.preventDefault();
  clearRenderedFilms();

  let count = FILMS_CARDS_COUNT;

  for (let i = 0; i < count; i++) {
    render(filmsListContainerElement, createFilmCardTemplate(films[i]), `beforeend`);
  }

  if (count >= MAX_MOCK_FILMS_COUNT) {
    showMoreButton.classList.add(`visually-hidden`);
    showMoreButton.removeEventListener(`click`, onShowMoreButtonClick);
  }
};

showMoreButton.addEventListener(`click`, onShowMoreButtonClick);


const filmsListExtraElements = filmsElement.querySelectorAll(`.films-list--extra`);

const extraFilms = films.slice();

const topRatedFilms = extraFilms.sort(sortByFieldDescending(`rating`)).slice(0, FILMS_CARDS_EXTRA_COUNT);
const mostCommentedFilms = extraFilms.sort(sortByFieldDescending(`comments`)).slice(0, FILMS_CARDS_EXTRA_COUNT);

filmsListExtraElements.forEach((element, i) => {
  const filmsListExtraContainerElement = element.querySelector(`.films-list__container`);

  if (i === 0) {
    for (let x = 0; x < FILMS_CARDS_EXTRA_COUNT; x++) {
      render(filmsListExtraContainerElement, createFilmCardTemplate(topRatedFilms[x]), `beforeend`);
    }
  } else {
    for (let x = 0; x < FILMS_CARDS_EXTRA_COUNT; x++) {
      render(filmsListExtraContainerElement, createFilmCardTemplate(mostCommentedFilms[x]), `beforeend`);
    }
  }
});

const footerElement = siteBodyElement.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createFooterStatisticsTemplate(films.length), `beforeend`);

const filmsListContainerElements = filmsElement.querySelectorAll(`.films-list__container`);
filmsListContainerElements.forEach((element) => {
  const onFilmsListContainerElementClick = (e) => {
    e.preventDefault();

    const filmId = e.target.parentNode.id;
    const film = films.find((item) => item.id === filmId);

    if (e.target.classList.contains(`film-card__title`) || e.target.classList.contains(`film-card__poster`) || e.target.classList.contains(`film-card__comments`)) {

      render(footerElement, createFilmDetailsPopupTemplate(film), `afterend`);
      siteBodyElement.classList.add(`modal-open`);

      const filmDetailsElement = siteBodyElement.querySelector(`.film-details`);
      const commentsListElement = filmDetailsElement.querySelector(`.film-details__comments-list`);

      const commentsCount = film.comments;
      const comments = new Array(commentsCount).fill(0).map(generateComment);

      for (let i = 0; i < comments.length; i++) {
        render(commentsListElement, createCommentTemplate(comments[i]), `afterend`);
      }

      const commentsCountElement = filmDetailsElement.querySelector(`.film-details__comments-count`);
      commentsCountElement.textContent = commentsCount;

      const closePopupButton = filmDetailsElement.querySelector(`.film-details__close-btn`);

      const onClosePopupButtonClick = (evt) => {
        evt.preventDefault();
        filmDetailsElement.remove();
        siteBodyElement.classList.remove(`modal-open`);
        closePopupButton.removeEventListener(`click`, onClosePopupButtonClick);
      };

      closePopupButton.addEventListener(`click`, onClosePopupButtonClick);

      const onFilmDetailsPopupKeydown = (event) => {
        if (event.code === Key.ESC) {
          event.preventDefault();
          filmDetailsElement.remove();
          siteBodyElement.classList.remove(`modal-open`);
        }
        document.removeEventListener(`keydown`, onFilmDetailsPopupKeydown);
      };

      document.addEventListener(`keydown`, onFilmDetailsPopupKeydown);
    }
  };

  element.addEventListener(`click`, onFilmsListContainerElementClick);
});
