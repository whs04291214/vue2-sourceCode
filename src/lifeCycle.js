import { pacth } from "./vnode/pacth";
import Watcher from "./observe/watcher";

export function mountCompoent(vm,el){
    //挂载之前调用beforeMount生命周期
    callHook(vm,'beforeMount')
    //1.vm._render() 生成虚拟dom
    //2.vm._update()  根据虚拟dom生成真实dom,渲染到页面上
    // vm._update(vm._render())
    new Watcher(vm,()=>{
        vm._update(vm._render())
    },()=>{
        callHook(vm,'updated')
    },true)
    //挂载之后调用mounted生命周期
    callHook(vm,'mounted')
}

export function lifeCycleMixin(Vue){
    Vue.prototype._update = function(vnode){ //根据虚拟dom 生成真实dom
        // console.log(vnode)
        let vm = this;
        vm.$el = pacth(vm.$el,vnode) //传2个参数：1)旧的dom => 回到init.js里，把旧的dom添加到实例上 2)虚拟dom
    }
}

//render函数 =》vdom =》真实dom

//调用生命周期钩子函数
export function callHook(vm,hook){
    let handers = vm.$options[hook];//[] 遍历执行
    if(handers){
        for(let i=0;i<handers.length;i++){
            handers[i].call(vm)
        }
    }
}