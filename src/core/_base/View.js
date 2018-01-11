import _ from 'overscore';

let document = document || {};

export default class View {

  constructor(opt = {}) {
    this.opt = _.extend({}, opt, {
      componentClass: this.opt.componentClass || this.componentClass || 'without-class',
      isChild: this.opt.isChild || this.isChild || false,
      events: this.events || (opt.events ? opt.events : {}),
      exTemplateConfig: opt.exTemplateConfig || null,
      eventsRef: []
    });
    return this;
  }

  static extend(protoProps, staticProps) {
    let parent = this,
      child = protoProps && _.has(protoProps, 'constructor') ? protoProps.constructor : function () {
        return parent.apply(this, arguments);
      };
    child = _.extend({}, child, parent, staticProps, {
      prototype: _.extend({}, _.create(parent.prototype, protoProps), {
        constructor: child
      }),
      __super__: parent.prototype
    });
    return child;
  }

  delegateEvents() {
    this.cleanEvents();
    this.customEventDelegation();
  }

  customEventDelegation() {}
  hide() {}
  show() {}
  cleanEvents() {}

  render() {
    this.beforeRender();
    this.onRender();
    this.delegateEvents();
    this.afterRender();
    return this;
  }

  beforeRender() {}
  afterRender() {}
  onRender() {}

  remove() {
    this.beforeRemove();
    this.cleanEvents();
    this.onRemove();
    this.afterRemove();
    return this;
  }

  beforeRemove() {}
  afterRemove() {}
  onRemove() {}
}
