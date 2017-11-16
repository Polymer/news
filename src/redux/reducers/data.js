import { CATEGORY_UPDATED, ARTICLE_UPDATED, FAILURE_CHANGED, LOADING_CHANGED,
         ARTICLE_FETCHED, CATEGORY_FETCHED } from '../actions/data.js';
import { createSelector } from '../../../node_modules/reselect/es/index.js';

const pathSelector = action => action.path === '/' ? '/list/top_stories' : action.path;

let categoryList = [
  {name: 'top_stories', title: 'Top Stories'},
  {name: 'doodles', title: 'Doodles'},
  {name: 'chrome', title: 'Chrome'},
  {name: 'search', title: 'Search'},
  {name: 'shopping_payments', title: 'Shopping & Payments'},
  {name: 'nonprofits', title: 'Nonprofits'}
];

const data = (state = {categories: categoryList}, action) => {
  switch (action.type) {
    case CATEGORY_UPDATED:
      return {
        ...state,
        category: action.category
      };
    case ARTICLE_UPDATED:
      return {
        ...state,
        article: action.article
      };
    case FAILURE_CHANGED:
      return {
        ...state,
        failure: action.failure
      };
    case LOADING_CHANGED:
      return {
        ...state,
        loading: action.loading
      };
    case ARTICLE_FETCHED:
    debugger
      state.article.html = action.html;
      return state;
    case CATEGORY_FETCHED:
      state.category.items = action.items;
      return state;
    default:
      return state;
  }
}
export default data;
