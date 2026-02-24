export function renderMixin(Vue){
    Vue.prototype._c =function(){ //标签
        //标签-》需要创建标签
        return createElement(...arguments);
    }
    Vue.prototype._v =function(text){ //文本
        return createContext(text);
    }
    Vue.prototype._s =function(val){ //{{}} =>变量 _s(msg)
        return val == null ? '' : (typeof val === 'object' ? JSON.stringify(val) : val)
    }
    Vue.prototype._render = function(){ //render函数返回的就是虚拟dom
        let vm= this;
        let render = vm.$options.render; //就是我们编译后的render函数
        //执行render函数，需要注意，我们要传入this，this就是当前组件实例，render函数会返回虚拟dom
        let vdom = render.call(this);
        // console.log(vdom)
        return vdom;
    }
}

//创建标签
function createElement(tag,data={},...children){
    return vnode(tag,data,data?.key,children);
}
//创建文本
function createContext(text){
    return vnode(undefined,undefined,undefined,undefined,text);
}
//创建节点
function vnode(tag,data,key,children,text){
    return {
        tag,
        data,
        key,
        children,
        text
    }
}

//vnode 就是用对象来描述dom节点的(虚拟dom)
/** 
 * 
 * {
 * tag,
 * text,
 * children,
 * key
 * }
 * 
 */