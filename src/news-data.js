import { Element } from '../node_modules/@polymer/polymer/polymer-element.js';
import { Debouncer } from '../node_modules/@polymer/polymer/lib/utils/debounce.js';
import { timeOut } from '../node_modules/@polymer/polymer/lib/utils/async.js';

import { store } from './redux/store.js';
import { categoryUpdated, articleUpdated, failureChanged, loadingChanged} from './redux/actions/data.js';

class NewsData extends Element {

  static get is() { return 'news-data'; }

  static get properties() { return {

    categories: Array,

    categoryName: {
      type: String,
      observer: '_categoryNameChanged'
    },
    category: Object,

    articleId: String,
    article: Object,

    offline: Boolean,
    loading: Boolean,
    failure: Boolean
  }}

  static get observers() { return [
    '_articleIdChanged(category.items, articleId)'
  ]}

  constructor() {
    super();
    store.subscribe(() => this.update());
    this.update();
  }

  update() {
    const state = store.getState();
    this.setProperties({
      categories: state.data.categories,
      category: state.data.category,
      article: state.data.article,
      failure: state.data.failure,
      loading: state.data.loading
    });
  }

  _articleIdChanged(categoryItems, articleId) {
    if (!categoryItems) {
      return;
    }
    let article = null;
    if (categoryItems && articleId) {
      for (let i = 0; i < categoryItems.length; ++i) {
        let a = categoryItems[i];
        if (a.id === articleId) {
          article = a;
          break;
        }
      }
    }
    store.dispatch(articleUpdated(article, this.offline, this.loading));
  }

  _categoryNameChanged(categoryName) {
    let category = null;
    for (let i = 0, c; c = this.categories[i]; ++i) {
      if (c.name === categoryName) {
        category = c;
        break;
      }
    }
    store.dispatch(categoryUpdated(category, this.offline, this.loading));
  }
}

customElements.define(NewsData.is, NewsData);
