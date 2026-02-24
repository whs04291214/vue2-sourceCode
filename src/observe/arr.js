//重新数组方法
//(1)获取原来数组的方法，从数组原型上进行获取
let oldArrayProtoMethods = Array.prototype;
//(2)继承
export let arrayMethods = Object.create(oldArrayProtoMethods);
//(3)劫持方法，重写部分方法
let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'sort',
    'splice'
]

methods.forEach((method)=>{
    arrayMethods[method] = function(...args){
        // console.log('数组劫持',method);
        // this指向的就是数组
        let result = oldArrayProtoMethods[method].apply(this,args);
        // console.log(args) // [{b:100}]
        let inserted;
        switch(method){
            case 'push':
            case 'unshift':
                inserted = args;
                break;
            case 'splice':
                inserted = args.splice(2); // splice(0,1,{v:100})
                break;
        }
        //对inserted进行数据劫持,劫持方法在index.js中，那要怎么做呢？？？那就把劫持方法添加到实例上，通过this进行调用
        let ob = this.__ob__; //数组的__ob__
        if(inserted){
            ob.observerArray(inserted); //对inserted进行数据劫持
        }
        ob.dep.notify(); //通知更新
        return result;
    }
})