import { createSelector } from '../../../node_modules/reselect/es/index.js';

export const START_FETCH_CATEGORY = 'START_FETCH_CATEGORY';
export const RECEIVE_CATEGORY = 'RECEIVE_CATEGORY';
export const USE_CATEGORY_FROM_CACHE = 'USE_CATEGORY_FROM_CACHE';
export const ERROR_FETCH_CATEGORY = 'ERROR_FETCH_CATEGORY';
export const START_FETCH_ARTICLE = 'START_FETCH_ARTICLE';
export const RECEIVE_ARTICLE = 'RECEIVE_ARTICLE';
export const USE_ARTICLE_FROM_CACHE = 'USE_ARTICLE_FROM_CACHE';
export const ERROR_FETCH_ARTICLE = 'ERROR_FETCH_ARTICLE';

export const fetchCategory = (attempts=1) => (dispatch, getState) => {
  const state = getState();

  const categoryName = state.path.category;
  const categories = state.data;
  const category = categorySelector(state);
  const loading = category.loading;
  const offline = !state.app.online;

  // Don't fail if we become offline but already have a cached version, or if there's
  // nothing to fetch, or if already loading.
  if ((offline && category && category.items) || !category || loading) {
    dispatch({
      type: USE_CATEGORY_FROM_CACHE
    });
    dispatch(fetchArticle());
  } else {
    dispatch({
      type: START_FETCH_CATEGORY,
      categoryName
    });

    fetch('data/' + category.name + '.json',
      (response) => {
        if (!response) {
          dispatch({
            type: ERROR_FETCH_CATEGORY,
            categoryName
          });
          return;
        }
        dispatch({
          type: RECEIVE_CATEGORY,
          categoryName: category.name,
          items: _parseCategoryItems(JSON.parse(response), category.name)
        });

        dispatch(fetchArticle());
      },
      attempts, true /* isRaw */, dispatch);
    }
};

const fetchArticle = () => (dispatch, getState) => {
  const state = getState();
  const articleName = state.path.article;
  const category = categorySelector(state);
  if (articleName) {
    const [article, index] = _findArticle(category.items, articleName);
    if (!article.html) {
      dispatch(articleUpdated(article, index, category.name, article.offline, article.loading));
    }
  }
}

export const articleUpdated = (article, articleIndex) => (dispatch, getState) => {
  const state = getState();

  const categoryName = state.path.category;
  const loading = article.loading;
  const offline = !state.app.online;

  // Don't fail if we become offline but already have a cached version, or if there's
  // nothing to fetch, or if already loading.
  if ((offline && article && article.html) || !article || loading) {
    dispatch({
      type: USE_ARTICLE_FROM_CACHE
    });
  } else {
    dispatch({
      type: START_FETCH_ARTICLE,
      categoryName: categoryName,
      articleIndex: articleIndex
    });
    fetch('data/articles/' + article.id + '.html',
      (response) => {
        if (!response) {
          dispatch({
            type: ERROR_FETCH_ARTICLE,
            articleIndex: articleIndex,
            categoryName: categoryName,
          });
          return;
        }
        dispatch({
          type: RECEIVE_ARTICLE,
          articleIndex: articleIndex,
          categoryName: categoryName,
          html: _formatHTML(response)
        });
      },
      1 /* attempts */, true /* isRaw */, dispatch);
  }
};

function fetch(url, callback, attempts, isRaw, dispatch) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', (e) => {
    if (isRaw) {
      callback(e.target.responseText);
    } else {
      callback(JSON.parse(e.target.responseText));
    }
  });
  xhr.addEventListener('error', (e) => {
    // Flaky connections might fail fetching resources
    if (attempts > 1) {
      this._fetchDebouncer = Debouncer.debounce(this._fetchDebouncer,
        timeOut.after(200), fetch.bind(this, url, callback, attempts - 1, isRaw, dispatch));
    } else {
      callback(null);
    }
  });

  xhr.open('GET', url);
  xhr.send();
}

function _findArticle(categoryItems, articleName) {
  if (!categoryItems || !articleName) {
    return;
  }
  for (let i = 0; i < categoryItems.length; ++i) {
    let a = categoryItems[i];
    if (a.id === articleName) {
      return [a, i];
    }
  }
  return [null, null];
}

function _parseCategoryItems(response, categoryName) {
  let items = [];
  for (let i = 0, item; item = response[i]; ++i) {
    items.push({
      headline: _unescapeText(item.title),
      href: _getItemHref(item, categoryName),
      id: item.id,
      imageUrl: _getItemImage(item),
      placeholder: item.placeholder,
      category: item.category,
      timeAgo: _timeAgo(new Date(item.time).getTime()),
      author: item.author,
      summary: _trimRight(item.summary, 100),
      readTime: Math.max(2, Math.round(item.contentLength / 3000)) + ' min read'
    });
  }
  return items;
}

function _formatHTML(html) {
  let template = document.createElement('template');
  template.innerHTML = html;

  // Remove h1, .kicker, and .date from content.
  // let h1 = template.content.querySelector('h1');
  // h1 && h1.remove();
  // let kicker = template.content.querySelector('.kicker');
  // kicker && kicker.remove();
  // let date = template.content.querySelector('.date');
  // date && date.remove();

  // Remove the first image if it's the same as the item image.
  // let image = template.content.querySelector('img');
  // if (image && this._isSameImageSrc(image.src, this.article.imageUrl)) {
  //   image.remove();
  // }

  // Remove width/height attributes from all images.
  let images = template.content.querySelectorAll('img');
  for (let i = 0; i < images.length; ++i) {
    let img = images[i];
    img.removeAttribute('width');
    img.removeAttribute('height');
  }

  return template.content.querySelector('.content').innerHTML;
}

let textarea = document.createElement('textarea');
function _unescapeText(text) {
  textarea.innerHTML = text;
  return textarea.textContent;
}

function _getItemHref(item, categoryName) {
  return item.id ? '/article/' + categoryName + '/' + encodeURIComponent(item.id) : null;
}

function _getItemImage(item) {
  return item.imgSrc ? 'data/' + item.imgSrc : '';
}

function _timeAgo(timestamp) {
  if (!timestamp)
    return ''

  let minutes = (Date.now() - timestamp) / 1000 / 60;
  if (minutes < 2)
    return '1 min ago';
  if (minutes < 60)
    return Math.floor(minutes) + ' mins ago';
  if (minutes < 120)
    return '1 hour ago';

  let hours = minutes / 60;
  if (hours < 24)
    return Math.floor(hours) + ' hours ago';
  if (hours < 48)
    return '1 day ago';

  return Math.floor(hours / 24) + ' days ago';
}

function _trimRight(text, maxLength) {
  let breakIdx = text.indexOf(' ', maxLength);
  return breakIdx === -1 ? text : text.substr(0, breakIdx) + '...';
}

const categoriesSelector = state => (state.data);
const categoryNameSelector = state => (state.path.category);
const articleNameSelector = state => (state.path.article);

const categorySelector = createSelector(
  categoriesSelector,
  categoryNameSelector,
  (categories, category) => {
    return categories[category];
  }
);
const articleSelector = createSelector(
  categorySelector,
  articleNameSelector,
  (category, article) => {
    if (category.items) {
      return 'ok';
    }
    return null;
  }
);
