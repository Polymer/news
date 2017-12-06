import { NAVIGATE } from '../actions/app.js';

const path = (state = {}, action) => {
  switch (action.type) {
    case NAVIGATE:
      const route = action.path === '/' ? '/list/top_stories' : action.path;
      const splitPath = route.slice(1).split('/') || [];
      const page = splitPath[0] || list;
      const category = splitPath[1] || 'top_stories';
      const article = splitPath[2] || '';
      return {
        ...state,
        route,
        page,
        category,
        article
      };
    default:
      return state;
  }
}

export default path;
