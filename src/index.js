import { initGlobalApi } from './global-api/index.js';
import {initMixin} from './init.js'
import { stateMixin } from './initState.js';
import { lifeCycleMixin } from './lifeCycle.js';
import { renderMixin } from './vnode/index.js';
export default function Vue(options){
    // console.log('Welcome to Vue')
    this._init(options); //初始化来的
}
initMixin(Vue);
lifeCycleMixin(Vue);//添加生命周期
renderMixin(Vue);//添加_render方法
stateMixin(Vue); //添加nextTick方法
initGlobalApi(Vue) //添加全局api Vue.Mixin Vue.component Vue.exend Vue.directive Vue.filter