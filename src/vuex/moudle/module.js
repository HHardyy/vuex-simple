/*
 * @version:
 * @Author: 黄炳圳
 * @Date: 2020-10-31 17:14:42
 * @Descripttion:
 */
import {
  forEach
} from "../utils";

export default class Module {
  constructor(rootModule) {
    this._raw = rootModule;
    this._children = {};
    this.state = rootModule.state;
  }
  get namespaced() {
    // 属性访问器
    return this._raw.namespace;
  }
  getChild(key) {
    return this._children[key];
  }
  addChild(key, module) {
    this._children[key] = module;
  }
  forEachMutations(fn) {
    if (this._raw.mutations) {
      forEach(this._raw.mutations, fn);
    }
  }
  forEachActions(fn) {
    if (this._raw.actions) {
      forEach(this._raw.actions, fn);
    }
  }
  forEachGetters(fn) {
    if (this._raw.getters) {
      forEach(this._raw.getters, fn);
    }
  }
  forEachChild(fn) {
    forEach(this._children, fn);
  }
}