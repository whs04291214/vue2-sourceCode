
//<div id="app">Hello World {{msg}}</div>

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
 */

//注意：遍历，删除

const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
//匹配属性 id="app"
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*` //匹配标签名 div
const qnameCapture = `((?:${ncname}\\:)?${ncname})` //匹配标签名  div:xx
const startTagOpen = new RegExp(`^<${qnameCapture}`) //匹配开始标签的正则  <div
const startTagClose = /^\s*(\/?)>/    //匹配开始标签的结束  >   </div
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) //匹配结束标签  </div>


//创建ast语法树
{/* <div id="app">Hello World {{msg}}</div> */}
function createASTElement(tag,attrs){ 
    return {
        tag,
        attrs,
        children:[],
        type:1,
        parent:null
    }
}
let root;//根元素
let createParent;//当前元素的父元素
//用到一种数据结构
let stack = [];
function start(tag,attrs){ //开始标签
    // console.log(tag,attrs,":开始标签")
    let element = createASTElement(tag,attrs);
    if(!root){
        root = element;
    }
    createParent = element;
    stack.push(element)
}
function charts(text){ //文本
    // console.log(text,":文本")
    //处理下空格
    text = text.replace(/^\s+|\s+$/g,'')
    createParent.children.push({
        type:3,
        text
    })
}
function end(tag){ //结束标签
    // console.log(tag,":结束标签")
    let element = stack.pop();
    createParent = stack[stack.length-1];
    if(createParent){ //元素的闭合
        element.parent = createParent;
        createParent.children.push(element); 
    }
}
export function parseHTML(html) {
    //<div id="app">Hello World {{msg}}</div>  转换为ast语法树， 开始标签  文本  结束标签
    while (html) {
        //判断标签
        let textEnd = html.indexOf("<"); //0 
        if (textEnd == 0) {  //标签
            //(1)开始标签
            let startTagMatch = parseStartTag(); //处理开始标签内容 {}
            if(startTagMatch){
                start(startTagMatch.tagName,startTagMatch.attrs)
                continue
            }
            let endTagMatch = html.match(endTag);
            if(endTagMatch){
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
            }
        }
        let text 
        if(textEnd>0){ //文本
            //获取文本内容
            text = html.substring(0,textEnd);
            // console.log(text,"文本")
        }
        if(text){ //文本
            advance(textEnd)
            charts(text);
            // console.log(html)
        }
    }

    function parseStartTag() {
        let start = html.match(startTagOpen); //1.结果 2.false
        // console.log(start)
        //['<div', 'div', index: 0, input: '<div id="app">Hello World {{msg}}</div>', groups: undefined]
        if (start) {
            //创建语法树
            let match = {
                tagName: start[1],
                attrs: []
            }
            //删除开始标签
            advance(start[0].length);
            //属性
            //注意：多个、遍历
            //注意：结束 >
            let attr;
            let end;
            while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
                // console.log(attr)
                //[' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app">Hello World {{msg}}</div>', groups: undefined]
                match.attrs.push({
                    name:attr[1],
                    value:attr[3] || attr[4] || attr[4]
                })
                advance(attr[0].length);
            }
            if(end){
                advance(end[0].length);
                return match;
            }
        }
    }
    function advance(n) {
        html = html.substring(n);
        // console.log(html)
    }
    // console.log(root);
    return root;
}