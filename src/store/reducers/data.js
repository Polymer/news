import { START_FETCH_CATEGORY, ERROR_FETCH_CATEGORY,
         RECEIVE_CATEGORY, USE_CATEGORY_FROM_CACHE,
         START_FETCH_ARTICLE, ERROR_FETCH_ARTICLE,
         RECEIVE_ARTICLE, USE_ARTICLE_FROM_CACHE
        } from '../actions/data.js';
import { createSelector } from '../../../node_modules/reselect/es/index.js';
import { Debouncer } from '../../../node_modules/@polymer/polymer/lib/utils/debounce.js';

const pathSelector = action => action.path === '/' ? '/list/top_stories' : action.path;

const INITIAL_CATEGORIES = {
  top_stories: {name: 'top_stories', title: 'Top Stories'},
  doodles: {name: 'doodles', title: 'Doodles'},
  chrome: {name: 'chrome', title: 'Chrome'},
  search: {name: 'search', title: 'Search'},
  shopping_payments: {name: 'shopping_payments', title: 'Shopping & Payments'},
  nonprofits: {name: 'nonprofits', title: 'Nonprofits'}
};

const data = (state = INITIAL_CATEGORIES, action) => {
  const categoryName = action.categoryName;
  switch (action.type) {
    case ERROR_FETCH_CATEGORY:
    case USE_CATEGORY_FROM_CACHE:
    case START_FETCH_CATEGORY:
    case RECEIVE_CATEGORY:
      return {
        ...state,
        [categoryName]: category(action, state[categoryName], action.items)
      };
    case ERROR_FETCH_ARTICLE:
    case USE_ARTICLE_FROM_CACHE:
    case START_FETCH_ARTICLE:
    case RECEIVE_ARTICLE:
      const articleIndex = action.articleIndex;
      return {
        ...state,
        [categoryName]: category(action, state[categoryName], state[categoryName].items)
      };
    default:
      return state;
  }
}

const category = (action, state = {}, items) => {
  switch (action.type) {
    case START_FETCH_CATEGORY:
      return {
        ...state,
        failure: false,
        loading: true
      };
    case ERROR_FETCH_CATEGORY:
      return {
        ...state,
        failure: true,
        loading: false
      };
    case USE_CATEGORY_FROM_CACHE:
      return {
        ...state,
        failure: false,
        loading: false
      };
    case RECEIVE_CATEGORY:
      return {
        ...state,
        failure: false,
        loading: false,
        items: items
      };
    case START_FETCH_ARTICLE:
    case ERROR_FETCH_ARTICLE:
    case USE_ARTICLE_FROM_CACHE:
    case RECEIVE_ARTICLE:
      return {
        ...state,
        items: categoryItems(action, state.items, action.articleIndex)
      };
    default:
      return state;
  }
}

const categoryItems = (action, state = {}, articleIndex) => {
  switch (action.type) {
    case START_FETCH_ARTICLE:
    case ERROR_FETCH_ARTICLE:
    case USE_ARTICLE_FROM_CACHE:
    case RECEIVE_ARTICLE:
      state[articleIndex] = article(action, state[articleIndex], action.html);
      return state.slice(0);
  }
}

const article = (action, state = {}, html) => {
  switch (action.type) {
    case START_FETCH_ARTICLE:
      return {
        ...state,
        failure: false,
        loading: true
      };
    case ERROR_FETCH_ARTICLE:
      return {
        ...state,
        failure: true,
        loading: false
      };
    case USE_ARTICLE_FROM_CACHE:
      return {
        ...state,
        failure: false,
        loading: false
      };
    case RECEIVE_ARTICLE:
      return {
        ...state,
        failure: false,
        loading: false,
        html
      };
    default:
      return state;
  }
}

export default data;
