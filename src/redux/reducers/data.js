import { CATEGORY_FETCHED,
         ARTICLE_UPDATED, ARTICLE_FETCHED,
         FAILURE_HAPPENED, FAILURE_DIDNT_HAPPEN,
         LOADING_STARTED, LOADING_ENDED } from '../actions/data.js';
import { createSelector } from '../../../node_modules/reselect/es/index.js';
import { Debouncer } from '../../../node_modules/@polymer/polymer/lib/utils/debounce.js';

const pathSelector = action => action.path === '/' ? '/list/top_stories' : action.path;

let categoryList = {
  top_stories: {name: 'top_stories', title: 'Top Stories'},
  doodles: {name: 'doodles', title: 'Doodles'},
  chrome: {name: 'chrome', title: 'Chrome'},
  search: {name: 'search', title: 'Search'},
  shopping_payments: {name: 'shopping_payments', title: 'Shopping & Payments'},
  nonprofits: {name: 'nonprofits', title: 'Nonprofits'}
};

const data = (state = {categories: categoryList}, action) => {
  switch (action.type) {
    case ARTICLE_UPDATED:
      return {
        ...state,
        article: action.article
      };
    case FAILURE_HAPPENED:
      return {
        ...state,
        failure: true
      };
    case FAILURE_DIDNT_HAPPEN:
      return {
        ...state,
        failure: false
      };
    case LOADING_STARTED:
      return {
        ...state,
        loading: true
      };
    case LOADING_ENDED:
      return {
        ...state,
        loading: false
      };
    case ARTICLE_FETCHED:
    debugger
      return {
        ...state,
        article: {...state.article, html: action.html}
      }
    case CATEGORY_FETCHED:
      return {
        ...state,
        categories: updateCategories(state.categories, action.category, action.items)
      }
    default:
      return state;
  }
}
export default data;

const updateCategories = (state = {}, categoryId, items) => {
  const updateCategory = (state = {}, items) => {
    return {
      ...state,
      items
    };
  };

  return {
    ...state,
    [categoryId]: updateCategory(state[categoryId], items)
  }
};
