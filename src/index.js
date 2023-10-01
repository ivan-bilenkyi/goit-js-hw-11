import { Loading, Notify } from 'notiflix';
import { creareApiGet } from './js/api';
import { createMarkup } from './js/createMarkup';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.js-load-more');

const paramsForNotify = {
  position: 'center-center',
  timeout: 3000,
  width: '350px',
  fontSize: '22px',
};

form.addEventListener('submit', onFormSearch);
let page = null;
let value = '';

function onFormSearch(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loadMoreBtn.classList.replace('load-more', 'load-more-hidden');

  value = event.currentTarget.elements['searchQuery'].value
    .trim()
    .toLowerCase();

  if (value === '') {
    Notify.info('Enter your request, please!', paramsForNotify);
    return;
  }
  createApiRequest(value);
}
async function createApiRequest(keyForSearch) {
  Loading.standard({
    clickToClose: true,
    svgSize: '150px',
  });
  try {
    const apiResponse = await creareApiGet(keyForSearch, (page = 1));
    renderMarkup(apiResponse);
  } catch (error) {
    Notify.failure(`${error}`);
  } finally {
    Loading.remove();
  }
}
function renderMarkup(apiResponse) {
  const { totalHits, total, hits } = apiResponse;
  const maxPage = Math.ceil(totalHits / hits.length);

  const markup = createMarkup(hits);
  gallery.innerHTML = markup;

  if (!total) {
    Notify.info(
      'Sorry, there are no images matching your search query. Please try again.',
      paramsForNotify
    );
    return;
  } else if (maxPage === page) {
    loadMoreBtn.classList.replace('load-more', 'load-more-hidden');
  }
  if (maxPage !== page) {
    loadMoreBtn.classList.replace('load-more-hidden', 'load-more');
    loadMoreBtn.addEventListener('click', onLoadMore);
  }
}
async function onLoadMore() {
  page += 1;
  Loading.standard({
    clickToClose: true,
    svgSize: '150px',
  });
  try {
    const apiResponsePage = await creareApiGet(value, page);
    const { hits } = apiResponsePage;
    const markupPage = createMarkup(hits);
    gallery.insertAdjacentHTML('beforeend', markupPage);
    if (hits.length < 40) {
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        paramsForNotify
      );
      loadMoreBtn.classList.replace('load-more', 'load-more-hidden');
      loadMoreBtn.removeEventListener('click', onLoadMore);
    }
  } catch (error) {
    Notify.failure(`${error}`);
  } finally {
    Loading.remove();
  }
}
