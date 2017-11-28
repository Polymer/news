import { FETCH_CATEGORY, FETCH_ARTICLE,
         FETCH_FAILED, FETCH_OK,
         START_LOADING, FINISH_LOADING } from '../actions/data.js';
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
    case FETCH_FAILED:
      return {
        ...state,
        failure: true
      };
    case FETCH_OK:
      return {
        ...state,
        failure: false
      };
    case START_LOADING:
      return {
        ...state,
        loading: true
      };
    case FINISH_LOADING:
      return {
        ...state,
        loading: false
      };
    case FETCH_ARTICLE:
      var f = {
        ...state,
        articleIndex: action.index,
        categories: updateCategoriesWithArticle(state.categories, action.category, action.index, action.html)
      }
      return f;
    case FETCH_CATEGORY:
      return {
        ...state,
        categories: updateCategories(state.categories, action.category, action.items)
      }
    default:
      return state;
  }
}
export default data;

const updateCategoriesWithArticle = (state = {}, categoryId, articleName, html) => {
  const updateArticleForCategory = (state = {}, articleName, html) => {
    const updateItems = (state = [], articleName, html) => {
      state[articleName].html = html;
  //    state[articleName] = Object.assign({}, state[articleName]);
      return state;
    }

    return {
      ...state,
      items: updateItems(state.items, articleName, html)
    }
  }

  return {
    ...state,
    [categoryId]: updateArticleForCategory(state[categoryId], articleName, html)
  }
}

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
