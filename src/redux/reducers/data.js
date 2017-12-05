import { START_LOADING_CATEGORY, RECEIVE_CATEGORY,
         START_LOADING_ARTICLE, RECEIVE_ARTICLE,
         FETCH_FAILED, FETCH_OK
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
    case FETCH_FAILED:
    case FETCH_OK:
    case START_LOADING_CATEGORY:
    case RECEIVE_CATEGORY:
      return {
        ...state,
        [categoryName]: category(action, state[categoryName], action.items)
      };
    case START_LOADING_ARTICLE:
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
    case FETCH_FAILED:
      return {
        ...state,
        failure: true,
        loading: false
      };
    case FETCH_OK:
      return {
        ...state,
        failure: false,
        loading: false
      };
    case START_LOADING_CATEGORY:
      return {
        ...state,
        failure: false,
        loading: true
      };
    case RECEIVE_CATEGORY:
      return {
        ...state,
        failure: false,
        loading: false,
        items: items
      };
    case START_LOADING_ARTICLE:
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
    case START_LOADING_ARTICLE:
      return state.slice(0);
    case RECEIVE_ARTICLE:
      state[articleIndex] = article(action, state[articleIndex], action.html);
      return state.slice(0);
  }
}

const article = (action, state = {}, html) => {
  switch (action.type) {
    case START_LOADING_ARTICLE:
      return {
        ...state,
        failure: false,
        loading: true
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
