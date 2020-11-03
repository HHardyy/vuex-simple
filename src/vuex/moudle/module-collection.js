/*
 * @version:
 * @Author: 黄炳圳
 * @Date: 2020-10-31 15:04:28
 * @Descripttion:
 */
import {
  forEach
} from "../utils";
import Module from "./module";
export default class ModuleCollection {
  constructor(options) {
    // 注册模块，递归注册
    this.register([], options);
  }
  register(path, rootModule) {
    let newModule = new Module(rootModule);
    rootModule.newModule = newModule;
    if (path.length === 0) {
      this.root = newModule;
    } else {
      let parent = path.slice(0, -1).reduce((memo, current) => {
        return memo.getChild(current);
      }, this.root);
      parent.addChild(path[path.length - 1], newModule);
    }

    if (rootModule.modules) {
      forEach(rootModule.modules, (module, moduleName) => {
        this.register([...path, moduleName], module);
      });
    }
  }
  getNameSpace(path) {
    let root = this.root;
    return path.reduce((namespace, key) => {
      root = root.getChild(key);
      return namespace + (root.namespaced ? key + "/" : "");
    }, "");
  }
}

// 格式化树形结构
// this.root = {
//   _row: xxx,
//   children: {
//     a : {
//       _row: xxx,
//       children: {},
//       state: xxx.state // a模块的状态
//     },
//     b: {
//       _row: xxx,
//       children: {},
//       state: xxx.state // 模块b的状态
//     }
//   },
//   state: xxx.state
// }