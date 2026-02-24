import { compileToFunction } from './compile/index.js';
import {initState} from './initState.js'
import { callHook, mountCompoent } from './lifeCycle.js';
import { mergeOptions } from './utils/index.js';
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        // console.log(options)
        let vm = this;
        // vm.$options = options;//需要把组件内的选项和Vue选进行合并
        // 合并组件的选项：第一个参数是全局父级的options，故为Vue.options
        vm.$options = mergeOptions(Vue.options, options);
        //初始化状态之前调用beforeCreate
        callHook(vm, 'beforeCreate');
        //初始化状态
        initState(vm);
        //初始化状态之后调用created
        callHook(vm, 'created');

        //模版编译，先获取到html
        if(vm.$options.el){
            vm.$mount(vm.$options.el)
        }
    }
    Vue.prototype.$mount = function(el){
        let vm = this;
        el = document.querySelector(el);
        vm.$el = el;//把el挂载到vm上
        let ops = vm.$options;
        if(!ops.render){
            let template = ops.template;
            if(!template && el){
                template = el.outerHTML;
                // console.log(template)
                //<div id="app">Hello World {{msg}}</div> 需要转化为ast
                //转化为ast语法树
                // let ast = compileToFunction(template);
                //改成render
                let render = compileToFunction(template);
                // console.log(render)
                // （1）将render函数变成vnode  （2）把vnode变成真实dom,渲染到页面上
                ops.render = render;
            }
        }
        //挂载 传参：实例，元素
        mountCompoent(vm,el);
    }
}
//<div id="app">Hello World {{msg}}</div>
// ast {} dom css js  vnode dom节点

/**
 * {
 * tag:'div',
 * attrs:[{id:'app'}],
 * children:[{
 * tag:null,text:'Hello World'
 * },{
 * tag:"div"
 * }]
 * }
 * 
 
 * 
 */