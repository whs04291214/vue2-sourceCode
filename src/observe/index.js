import { arrayMethods } from "./arr";
import Dep from "./dep";
export function observer(data){
    //观测data
    // console.log('observer:',data)

    //判断data的类型 Vue2--》{}对象
    if(typeof data !== 'object' || data === null) {
        return data
    }

    //data对象是通过一个class进行数据劫持
    return new Observer(data)
}

class Observer{
    constructor(value){
         //给value增加一个__ob__属性，保存Observer的实例
        Object.defineProperty(value,"__ob__",{
            enumerable:false, //不可枚举
            value:this //Observer的实例
        })
        this.dep = new Dep();//给所有属性添加dep
        // 遍历观测
        // console.log('Observer:',value)
        if(Array.isArray(value)){
            value.__proto__ = arrayMethods;
            // console.log("数组劫持");
            this.observerArray(value); // [{a:1}]
        }else{
            this.walk(value);
        }
    }

    walk(data){ //{msg :"hello world"} 第一层的数据劫持
        let keys = Object.keys(data)
         //对对象中每个属性进行数据劫持  for
        for(let i=0;i<keys.length;i++){
            let key = keys[i];
            let value = data[key];
            defineReactive(data,key,value); //数据劫持
        }
        // Object.keys(value).forEach((key)=>{})
    }
    observerArray(value){ //数组的劫持
        for(let i=0;i<value.length;i++){ //对数组的元素进行数据劫持
            observer(value[i]);
        }
    }
}

//对对象的属性进行数据劫持
function defineReactive(data,key,value){ //{a:{b:10}}
    let childDep =  observer(value);//深层数据劫持，递归层数据劫持
    let dep = new Dep();//给data的每个属性添加Dep
    Object.defineProperty(data,key,{
        get(){ 
            // console.log("get",key);
            //收集依赖 vm.name
            if(Dep.target){ //有watcher
                dep.depend(); //添加依赖
                if(childDep.dep){
                    childDep.dep.depend(); //数组的依赖收集
                }
            }
            // console.log(dep);
            return value;
        },
        // 如何检查效果，去new Vue的地方修改data的值
        set(newValue){
            // console.log("set",key,newValue);
            if(newValue === value) return;
            observer(newValue); //新值如果是对象，继续劫持
            value = newValue;
            dep.notify();//通知依赖更新
        }
    })
}

// Vue2中 Object.defineProperty 缺点：只能对对象的属性进行劫持（一个一个）{a:1,b:2,c:3}

//data {} []

//data {} []

//总结：(1)对象
//1.Object.defineProperty 缺点：只能对对象一个属性进行劫持
//2.遍历 {a:1,b:2,c:{d:1}} 单层次
//3.递归 深层次代理 get set

//数组 { list:[1,2,3,4] ,a[b:{c:1}]} 
// 方法 函数劫持，劫持数组方法，切片思想，重写数组方法，arr.push() 操作数组的时候，会调用对应的方法