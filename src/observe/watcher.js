//定义一个类Watcher，来实现视图更新
import { nextTick } from '../utils/nextTick';
import { pushTarget, popTarget } from './dep'
let id = 0;
class Watcher {
    constructor(vm, expOrFn, cb, options) {
        this.vm = vm
        this.expOrFn = expOrFn
        this.cb = cb
        this.options = options
        this.id = id++ //区分不同的组件
        this.deps = []
        this.user = !!options.user //是否是用户自己的watcher
        this.depsId = new Set() //去重
        if (typeof expOrFn === 'function') {
            this.getter = expOrFn
        } else { //{a,b,c...} 字符串
            this.getter = function () { //a.a.a
                let path = expOrFn.split('.');
                let obj = vm;
                for (let i = 0; i < path.length; i++) {
                    obj = obj[path[i]];
                }
                return obj
            }
        }
        //4.更新视图
        this.value = this.get() //保存watch的初始值
    }
    addDep(dep) {
        //去重
        if (!this.depsId.has(dep.id)) {
            this.deps.push(dep)
            this.depsId.add(dep.id)
            dep.addSub(this)
        }
    }
    run() {
        // old new 
        let value = this.get();
        let oldValue = this.value;
        this.value = value;
        if (this.user) {
            this.cb.call(this.vm, value, oldValue)
        }
    }
    //首次渲染
    get() {
        pushTarget(this)//收集依赖,target 给dep添加watcher
        let value = this.getter() // 渲染页面 vm._update(vm._render()) _s(name) -->get
        popTarget()//清除依赖 给dep取消watcher
        return value;//oldValue
    }
    //更新
    update() {
        //注意：不要数据更新后立即调用get方法，get方法会重新渲染
        //缓存
        // this.get() //更新渲染
        queueWatcher(this) //异步更新 
    }
}
let queue = [] //存放要更新的watcher
let has = {}
let pending = false
let userWatcher;
function flushSchedulerQueue() {
    queue.forEach(w => {
        w.run();
        if (!userWatcher) {
            w.cb();
        }
    });
    queue = []
    has = {}
    pending = false
}
function queueWatcher(watcher) {
    let id = watcher.id //每个组件都是同一个watcher
    userWatcher = watcher.user
    // console.log(id)
    if (!has[id]) { //去重
        queue.push(watcher)
        has[id] = true
        //防抖：频繁操作，只执行一次
        if (!pending) {
            // setTimeout(()=>{
            //     queue.forEach(w=>w.run());
            //     queue = []
            //     has = {}
            //     pending = false
            // },0)
            nextTick(flushSchedulerQueue) //异步处理，传cb回到函数
        }
        pending = true
    }
}

export default Watcher;

//收集依赖：vue dep watcher data:{neme,msg}
// dep:dep和data中的属性是一一对应的关系
//watcher:在视图上用到几次，就有多少个watcher
//dep和watcher:一对多（多对对）dep.name=[w1,w2,w3,...]

//nextTick原理：异步更新