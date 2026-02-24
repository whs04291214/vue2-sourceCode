import { mergeOptions } from "../utils/index";

export function initGlobalApi(Vue) {
  Vue.options = {};
  //源码
  //对象合并 {created:[f1,f2,f3],watch:[f1,f2,f3]}
  Vue.Mixin = function(mixin) {
    // console.log(6666)
    this.options = mergeOptions(this.options, mixin); //每次合并完成后，都会把最新的options保存到Vue.options中
  };
}