export const HOOKS = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed'
] //生命周期

let starts = {};
starts.data = function(parentVal,childVal) {
    return childVal
} //合并data
// starts.watch = function() {}//合并watch
starts.methods = function() {} //合并methods
starts.computed = function() {}//合并computed

//合并生命周期
//遍历hooks
HOOKS.forEach(hook=>{
    starts[hook]=mergeHook;
})

function mergeHook(parentVal,childVal){
    if(childVal){
        if(parentVal){
            return parentVal.concat(childVal)
        }else{
            return [childVal]
        }
    }else{
        return parentVal;
    }
}

export function mergeOptions(parent, child) {
    // console.log(parent, child)
    let options = {};
    //对象的合并 {created:[f1,f2,f3],watch:[f1,f2,f3]}
    //判断不同的情况
    //有父亲、没有儿子
    for(let key in parent){
        mergeFiled(key)
    }
    //有儿子、没有父亲
    for(let key in child){
        mergeFiled(key)
    }
    function mergeFiled(key){
        if(starts[key]){
            options[key] = starts[key](parent[key],child[key]);
        }else{
            options[key] = child[key];
        }
    }
    // console.log(options,9999)
    return options;
}