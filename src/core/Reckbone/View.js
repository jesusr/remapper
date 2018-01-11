import _ from 'overscore';
import $ from 'jquery';
import Handlebars from 'handlebars-template-loader/runtime';
import ViewGeneric from '../_base/View';

let document = document,
  navigator = navigator;
export default class View extends ViewGeneric {

  constructor(opt = {}) {
    super();
    this.template = this.processTemplate(this.template ? this.template : opt.template ? opt.template : null);
    return this.opt.manualInit ? this : this.render();
  }

  customEventDelegation() {
    let i, keys = Object.keys(this.opt.events);
    for (i = 0; i < keys.length; i++) {
      let arr = keys[i].split(' ');
      this.opt.eventsRef.push($(document).on(arr.shift(), getSelector.call(this, arr), this[this.opt.events[keys[i]]].bind(this)));
    }
  }

  cleanEvents() {
    _.map(this.eventsRef, (o) => {
      o.off();
    });
    this.eventsRef = [];
  }

  hide() {
    let name = getBrowser().name;
    if (name === 'IE' || name === 'Edge') {
      /* istanbul ignore next */
      this.$el.wrap('<span>').hide();
    } else {
      this.$el.hide();
    }
  }

  show() {
    this.$el.show();
  }

  onRender() {
    if (this.template) {
      registerTemplate.call(this);
      if (this.opt.container) this.opt.container.append(_render.call(this).el);
      else if (this.isChild) _render.call(this);
    }
  }

  onRemove() {
    _removeElement.call(this).afterRemove();
  }

  processTemplate(tpl) {
    return typeof tpl === 'string' || tpl instanceof String ?
      _.template(tpl) : tpl;
  }

}

function getSelector(arr) {
  let selector = this.$el && this.$el.parent ? '#' + this.$el.parent.id : '';
  selector += ' .' + this.componentClass + ' ';
  selector += arr.join(' ');
  return selector;
}

function registerTemplate() {
  /* istanbul ignore next */
  if (!_.isUndefined(this.templatePartials)) {
    for (let partialName in this.templatePartials) {
      if (!this.templatePartials.hasOwnProperty(partialName)) {
        continue;
      }
      Handlebars.default.registerPartial(partialName, this.templatePartials[partialName]);
    }
  }
}

function _getTemplateConfig() {
  let keys = Object.keys(this.exTemplateConfig);
  let aux = {};
  for (let i = 0; i < keys.length; i++) {
    aux[keys[i]] = this.exTemplateConfig[keys[i]];
  }
  this.templateConfig = _.extend({}, aux);
}

function _render() {
  if (this.exTemplateConfig) {
    _getTemplateConfig.call(this);
  }
  _setElement.call(this, this.template(this.templateConfig)).$el.addClass(this.componentClass);
  this.onRender();
  return this;
}

function _setElement(el) {
  /* istanbul ignore next */
  this.$el = typeof el === 'string' || el instanceof String ? $(el) : el;
  this.el = this.$el[0];
  return this;
}

function _removeElement() {
  this.$el.remove();
  this.el = null;
  return this;
}

/* istanbul ignore next */
function getBrowser() {
  let ua = navigator.userAgent,
    tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
  if (/trident/i.test(M[1])) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'IE',
      version: (tem[1] || '')
    };
  }
  if (/Edge\/\d./i.test(ua)) {
    tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
    return {
      name: 'Edge',
      version: (tem[1] || '')
    };
  }
  if (M[1] === 'Chrome') {
    tem = ua.match(/\bOPR\/(\d+)/);
    if (tem !== null) {
      return {
        name: 'Opera',
        version: tem[1]
      };
    }
  }
  M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
  if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
    M.splice(1, 1, tem[1]);
  }
  return {
    name: M[0],
    version: M[1]
  };
}
