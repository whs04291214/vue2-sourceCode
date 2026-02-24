let id = 0;
class Dep{
    constructor(){
        this.subs = [] //存放watcher
        this.id = id++;//区分不同的dep
    }
    //收集依赖
    depend(){
        //为了实现dep和watcher之间相互保存，期望watcher保存dep，dep保存watcher
        //双向记忆
        // if(Dep.target){
        //     this.subs.push(Dep.target)
        // }
        Dep.target.addDep(this) //watcher里面存放dep
    }
    addSub(watcher){ //sub是watcher
        this.subs.push(watcher) //dep里面存放watcher
    }
    //更新
    notify(){ //this.subs [] 遍历
        this.subs.forEach(watcher => watcher.update())
    }
}

//给Dep类添加静态属性target
Dep.target = null
//添加依赖
export function pushTarget(watcher){
    Dep.target = watcher
}
//删除依赖
export function popTarget(){
    Dep.target = null
}

export default Dep;