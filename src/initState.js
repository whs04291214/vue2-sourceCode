import { observer } from './observe/index.js'
import { nextTick } from './utils/nextTick.js';
import Watcher from './observe/watcher.js';
export function initState(vm) {
    // console.log(vm.$options)
    let opts = vm.$options;
    //判断实例上的属性，做初始化操作
    if (opts.data) {
        initData(vm)
    }
    if (opts.computed) {
        initComputed(vm)
    }
    if (opts.watch) {
        initWatch(vm)
    }
    if (opts.methods) {
        initMethods(vm)
    }
    if (opts.props) {
        initProps(vm)
    }
    if (opts.beforeCreate) {
        initHook(vm, 'beforeCreate')
    }
}

function initComputed(vm) { }
function initWatch(vm) {
    // 1.获取watch选项
    let watch = vm.$options.watch
    console.log(watch, 666)
    // 2.遍历watch选项 {a,b,c,...}
    for (let key in watch) {
        //2.1获取到对应的属性值（判断）
        let handler = watch[key];//数组，对象，方法，字符串
        if (Array.isArray(handler)) { //数组
            for (let i = 0; i < handler.length; i++) {
                createWatcher(vm, key, handler[i])
            }
        } else { //对象，方法，字符串
            //3.创建一个方法来处理
            createWatcher(vm, key, handler)
        }
    }
}
function initMethods(vm) { }
function initProps(vm) { }
function initHook(vm, hook) { }

// 对data进行初始化-Vue2
// data 1.object 2 function
//data{}里的数据 1）对象 2）数组  {a:{b:1},arr:[{a:1},{b:2}],list:[1,2,3]} 
function initData(vm) {
    // console.log(vm.$options.data);
    console.log(vm);
    let data = vm.$options.data;
    // 注意：this指向问题，data()指向 -->window; data.call(vm)指向Vue实例
    // data = typeof data === 'function'?data.call(vm):data;
    //vm._data验证data劫持的效果
    data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
    //至此，是为了拿到data数据做铺垫，现在才是进行data数据的劫持

    //将data中的数据全部代理到vm上
    for (let key in data) {
        proxy(vm, "_data", key)
    }
    //data数据劫持
    observer(data)
}

function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
        get() {
            return vm[source][key];
        },
        set(newValue) {
            vm[source][key] = newValue;
        }
    })
}

export function stateMixin(Vue) {
    Vue.prototype.nextTick = function (cb) {
        nextTick(cb)
    }
    Vue.prototype.$watch = function (expOrFn, cb, options) { //wacth
        // console.log(expOrFn, cb, options)
        //实现watch 就是 new Watcher  渲染走渲染watcher  $watch：走watcher user：true
        // watch的核心是Watcher
        let watcher  = new Watcher(this, expOrFn, cb, {...options,user:true})
        if(options.immediate){
            cb.call(this) //立即执行
        }
    }
}

// vm.$wacth(()=>{return 'exp'}) //返回值就是watch上的属性值   expOrFn
// user = fasle 初始化  user = true 用户自定义 options
//格式化处理
function createWatcher(vm, expOrFn, handler, options = {}) {
    //3.1处理handler
    if (typeof handler === 'object') {
        options = handler; //用户配置内容
        handler = handler.handler; //{}这是一个对象
    }
    if (typeof handler === 'string') { //'msg'
        handler = vm[handler]; //vm['msg'] => 方法,实例上的方法 方法的代理和data的代理是一样的
    }
    // 其他：方法函数
    //watch 最终都是用$watch来处理的
    return vm.$watch(expOrFn, handler, options)

}
