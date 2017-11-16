import { PATH_CHANGED } from '../actions/app.js';
import { createSelector } from '../../../node_modules/reselect/es/index.js';

const pathSelector = action => action.path === '/' ? '/list/top_stories' : action.path;

export const splitPathSelector = createSelector(
  pathSelector,
  path => path.slice(1).split('/') || []
);
const pageSelector = createSelector(
  splitPathSelector,
  splitPath => splitPath[0] || 'list'
);
const categorySelector = createSelector(
  splitPathSelector,
  splitPath => splitPath[1] || 'top_stories'
);
const articleIdSelector = createSelector(
  splitPathSelector,
  splitPath => splitPath[2] || ''
);

const path = (state = {}, action) => {
  switch (action.type) {
    case PATH_CHANGED:
      return {
        ...state,
        fullPath: pathSelector(action),
        page: pageSelector(action),
        category: categorySelector(action),
        article: articleIdSelector(action)
      };
    default:
      return state;
  }
}

export default path;
