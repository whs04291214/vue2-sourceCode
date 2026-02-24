let callbacks = []
let pending = false;
function flushCallbacks(){
    callbacks.forEach(cb=>cb())
    pending = false
}
let timerFunc;
if(Promise){  //Promise
    timerFunc = ()=>{
        Promise.resolve().then(flushCallbacks)
    }
}else if(MutationObserver){ //h5的api
    let observe = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1)
    observe.observe(textNode,{characterData:true})
    timerFunc = ()=>{
        textNode.textContent = 2
    }
}else if(setImmediate){ //ie
    timerFunc = ()=>{
        setImmediate(flushCallbacks)
    }
}else{
    timerFunc = ()=>{
        setTimeout(flushCallbacks,0)
    }
}
export function nextTick(cb) {
    //1.vue 2.自定义
    //    console.log(cb)
    //[cb1,cb2,...]
    callbacks.push(cb)
    if(!pending){
        timerFunc();
        pending = true
    }
}