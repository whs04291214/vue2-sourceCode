export function pacth(oldVnode,vnode){
    // console.log(oldVnode,vnode)
    //vnode =>真实dom
    // 1.创建dom
    let el = createElm(vnode)
    // console.log(el)
    // 2、替换 1）获取父节点 2）拆入新元素 3）删除旧元素
    let parentEL = oldVnode.parentNode;
    parentEL.insertBefore(el,oldVnode.nextsibling)
    parentEL.removeChild(oldVnode);
    return el;
}
//创建dom
function createElm(vnode){ // vnode {tag,data,children,text,key}
    let {tag,data,key,children,text} = vnode;
    if(typeof tag === 'string'){ //标签
        vnode.el = document.createElement(tag);
        if(children.length>0){
            children.forEach(child => {
                vnode.el.appendChild(createElm(child))
            });
        }
    }else{
        vnode.el = document.createTextNode(text);
    }
    return vnode.el;
}