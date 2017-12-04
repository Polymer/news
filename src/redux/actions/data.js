export const FETCH_FAILED = 'FETCH_FAILED';
export const FETCH_OK = 'FETCH_OK';
export const START_LOADING = 'START_LOADING';
export const FINISH_LOADING = 'FINISH_LOADING';
export const FETCH_ARTICLE = 'FETCH_ARTICLE';
export const FETCH_CATEGORY = 'FETCH_CATEGORY';

let textarea = document.createElement('textarea');

export const fetchCategory = () => (dispatch, getState) => {
  const state = getState();

  const categoryName = state.path.category;
  const categories = state.data.categories;
  const category = _findCategory(categories, categoryName);
  const loading = category.loading;
  const offline = !state.app.online;

  // Don't fail if we become offline but already have a cached version, or if there's
  // nothing to fetch, or if already loading.
  if ((offline && category && category.items) || !category || loading) {
    dispatch({
      type: FETCH_OK
    });
  } else {
    fetch('data/' + category.name + '.json',
      (response) => {
        const items = _parseCategoryItems(JSON.parse(response), category.name);
        const state = getState();

        dispatch({
          type: FETCH_CATEGORY,
          category: category.name,
          items: items
        });

        const articleName = state.path.article;
        if (articleName) {
          const [article, index] = _findArticle(items, articleName);
          if (!article.html) {
            dispatch(articleUpdated(article, index, categoryName, offline, loading));
          }
        }
      }, 1 /* attempts */, true /* isRaw */, dispatch);
    }
};

export const articleUpdated = (article, articleIndex, categoryName, offline, loading) => (dispatch) => {
  // Don't fail if we become offline but already have a cached version, or if there's
  // nothing to fetch, or if already loading.
  if ((offline && article && article.html) || !article || loading) {
    dispatch({
      type: FETCH_OK
    });
  } else {
    fetch('data/articles/' + article.id + '.html',
      (response) => {
        dispatch({
          type: FETCH_ARTICLE,
          index: articleIndex,
          category: categoryName,
          html: _formatHTML(response)
        });
      }, 1 /* attempts */, true /* isRaw */, dispatch);
  }
};

function fetch(url, callback, attempts, isRaw, dispatch) {
  let xhr = new XMLHttpRequest();
  xhr.addEventListener('load', (e) => {
    dispatch({
      type: FINISH_LOADING
    });
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
      dispatch({
        type: FINISH_LOADING
      });
      dispatch({
        type: FETCH_FAILED
      });
    }
  });

  dispatch({
    type: START_LOADING
  });
  dispatch({
    type: FETCH_OK
  });
  xhr.open('GET', url);
  xhr.send();
}

function _findCategory(categories, categoryName) {
  for (let c in categories) {
    if (c === categoryName) {
      return categories[c];
    }
  }
  return null;
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
