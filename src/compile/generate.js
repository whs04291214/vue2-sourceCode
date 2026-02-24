/**
 * <div id="app">Hello World{{msg}}<h1>8888<span>9999</span></h1></div>
 * _c('div',{id:'app'},_v('Hello World'+_s(msg)),_c('h1',null,v('8888'),_c('span',null,v('9999') )))
 * 
 */
 //_c解析标签  _v解析文本  _s变量输出
 //解析属性
 function genProps(attrs){
    let str=""; // 属性 [] 遍历
    for(let i=0;i<attrs.length;i++){
        let attr = attrs[i];
        if(attr.name == 'style'){ //style样式 value: color: red;font-size: 24px;" ==》{color:red;fontSize:14px}
            let obj = {};
            attr.value.split(";").forEach(item => {
                let [key,value] = item.split(":");
                obj[key] = value;
            });
            attr.value = obj;
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0,-1)}}`;
 }
 //解析子集
 function genChildren(children){
    if(children){
        return  children.map(child=>gen(child)).join(",");
    }
 }
 const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{}}
//_c('div',{id:"app"},_v("Hello World"+_s(msg)),_c('h1'))
 function gen(node){
    let type = node.type; //1标签 3文本
    if(type ==1){
        return generate(node);//递归
    }else{
        let text  = node.text;//文本 {{}}
        if(!defaultTagRE.test(text)){ //没有{{}} 纯文本
            return `_v(${JSON.stringify(text)})`
        }else{ //包含{{}}  hello {{msg}} world {{age}}
            let tokens = [];
            let lastIndex = defaultTagRE.lastIndex =0;
            let match,index;
            while((match = defaultTagRE.exec(text))){ //exec每次匹配后会更新lastIndex
                index = match.index;
                if(index > lastIndex){ //{{}}前面有纯文本
                    tokens.push(JSON.stringify(text.slice(lastIndex,index)))
                }
                tokens.push(`_s(${match[1].trim()})`); //{{}}变量
                lastIndex = index + match[0].length;
            }
            if(lastIndex < text.length){ //最后还有纯文本
                tokens.push(JSON.stringify(text.slice(lastIndex)))
            }
            return `_v(${tokens.join("+")})` //拼接
        }
    }
 }
export function generate(ast){
    // console.log('generate:',ast)
    let code = `_c(${JSON.stringify(ast.tag)},${ast.attrs.length ? `${genProps(ast.attrs)}` :'null'},${ast.children.length ? `${genChildren(ast.children)}`:'null'})`;
    // console.log(code);
    return code;
}