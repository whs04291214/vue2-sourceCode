import { generate } from "./generate";
import { parseHTML } from "./parseAst";
export function compileToFunction(el) {
    // console.log('compileToFunction:',el)
    //把html字符串转换成ast语法树
    let ast = parseHTML(el);
    //把ast语法树转换成render函数
    //(1)把ast语法树转换成字符串 (2)字符串变成函数
    let code = generate(ast);
    // console.log(code)
    //将render字符串转换为render函数
    // 创建函数 new Function  作用域 this(vm) 识别变量with
    let  render  = new Function(`with(this){return ${code}}`)
    // console.log(render)
    return render;
}

/**
 * <div id="app">Hello World{{msg}}<h1>8888<span>9999</span></h1></div>
 * _c('div',{id:'app'},_v('Hello World'+_s(msg)),_c('h1',null,v('8888'),_c('span',null,v('9999') )))
 * 
 * 
 */