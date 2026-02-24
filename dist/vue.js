(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

    var HOOKS = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed']; //生命周期

    var starts = {};
    starts.data = function (parentVal, childVal) {
      return childVal;
    }; //合并data
    // starts.watch = function() {}//合并watch
    starts.methods = function () {}; //合并methods
    starts.computed = function () {}; //合并computed

    //合并生命周期
    //遍历hooks
    HOOKS.forEach(function (hook) {
      starts[hook] = mergeHook;
    });
    function mergeHook(parentVal, childVal) {
      if (childVal) {
        if (parentVal) {
          return parentVal.concat(childVal);
        } else {
          return [childVal];
        }
      } else {
        return parentVal;
      }
    }
    function mergeOptions(parent, child) {
      // console.log(parent, child)
      var options = {};
      //对象的合并 {created:[f1,f2,f3],watch:[f1,f2,f3]}
      //判断不同的情况
      //有父亲、没有儿子
      for (var key in parent) {
        mergeFiled(key);
      }
      //有儿子、没有父亲
      for (var _key in child) {
        mergeFiled(_key);
      }
      function mergeFiled(key) {
        if (starts[key]) {
          options[key] = starts[key](parent[key], child[key]);
        } else {
          options[key] = child[key];
        }
      }
      // console.log(options,9999)
      return options;
    }

    function initGlobalApi(Vue) {
      Vue.options = {};
      //源码
      //对象合并 {created:[f1,f2,f3],watch:[f1,f2,f3]}
      Vue.Mixin = function (mixin) {
        // console.log(6666)
        this.options = mergeOptions(this.options, mixin); //每次合并完成后，都会把最新的options保存到Vue.options中
      };
    }

    function _arrayLikeToArray(r, a) {
      (null == a || a > r.length) && (a = r.length);
      for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e];
      return n;
    }
    function _arrayWithHoles(r) {
      if (Array.isArray(r)) return r;
    }
    function _classCallCheck(a, n) {
      if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function");
    }
    function _defineProperties(e, r) {
      for (var t = 0; t < r.length; t++) {
        var o = r[t];
        o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o);
      }
    }
    function _createClass(e, r, t) {
      return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", {
        writable: !1
      }), e;
    }
    function _defineProperty(e, r, t) {
      return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }) : e[r] = t, e;
    }
    function _iterableToArrayLimit(r, l) {
      var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
      if (null != t) {
        var e,
          n,
          i,
          u,
          a = [],
          f = !0,
          o = !1;
        try {
          if (i = (t = t.call(r)).next, 0 === l) {
            if (Object(t) !== t) return;
            f = !1;
          } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
        } catch (r) {
          o = !0, n = r;
        } finally {
          try {
            if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
          } finally {
            if (o) throw n;
          }
        }
        return a;
      }
    }
    function _nonIterableRest() {
      throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    function ownKeys(e, r) {
      var t = Object.keys(e);
      if (Object.getOwnPropertySymbols) {
        var o = Object.getOwnPropertySymbols(e);
        r && (o = o.filter(function (r) {
          return Object.getOwnPropertyDescriptor(e, r).enumerable;
        })), t.push.apply(t, o);
      }
      return t;
    }
    function _objectSpread2(e) {
      for (var r = 1; r < arguments.length; r++) {
        var t = null != arguments[r] ? arguments[r] : {};
        r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
          _defineProperty(e, r, t[r]);
        }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
          Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
        });
      }
      return e;
    }
    function _slicedToArray(r, e) {
      return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest();
    }
    function _toPrimitive(t, r) {
      if ("object" != typeof t || !t) return t;
      var e = t[Symbol.toPrimitive];
      if (void 0 !== e) {
        var i = e.call(t, r || "default");
        if ("object" != typeof i) return i;
        throw new TypeError("@@toPrimitive must return a primitive value.");
      }
      return ("string" === r ? String : Number)(t);
    }
    function _toPropertyKey(t) {
      var i = _toPrimitive(t, "string");
      return "symbol" == typeof i ? i : i + "";
    }
    function _typeof(o) {
      "@babel/helpers - typeof";

      return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
        return typeof o;
      } : function (o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
      }, _typeof(o);
    }
    function _unsupportedIterableToArray(r, a) {
      if (r) {
        if ("string" == typeof r) return _arrayLikeToArray(r, a);
        var t = {}.toString.call(r).slice(8, -1);
        return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0;
      }
    }

    /**
     * <div id="app">Hello World{{msg}}<h1>8888<span>9999</span></h1></div>
     * _c('div',{id:'app'},_v('Hello World'+_s(msg)),_c('h1',null,v('8888'),_c('span',null,v('9999') )))
     * 
     */
    //_c解析标签  _v解析文本  _s变量输出
    //解析属性
    function genProps(attrs) {
      var str = ""; // 属性 [] 遍历
      var _loop = function _loop() {
        var attr = attrs[i];
        if (attr.name == 'style') {
          //style样式 value: color: red;font-size: 24px;" ==》{color:red;fontSize:14px}
          var obj = {};
          attr.value.split(";").forEach(function (item) {
            var _item$split = item.split(":"),
              _item$split2 = _slicedToArray(_item$split, 2),
              key = _item$split2[0],
              value = _item$split2[1];
            obj[key] = value;
          });
          attr.value = obj;
        }
        str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
      };
      for (var i = 0; i < attrs.length; i++) {
        _loop();
      }
      return "{".concat(str.slice(0, -1), "}");
    }
    //解析子集
    function genChildren(children) {
      if (children) {
        return children.map(function (child) {
          return gen(child);
        }).join(",");
      }
    }
    var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; //{{}}
    //_c('div',{id:"app"},_v("Hello World"+_s(msg)),_c('h1'))
    function gen(node) {
      var type = node.type; //1标签 3文本
      if (type == 1) {
        return generate(node); //递归
      } else {
        var text = node.text; //文本 {{}}
        if (!defaultTagRE.test(text)) {
          //没有{{}} 纯文本
          return "_v(".concat(JSON.stringify(text), ")");
        } else {
          //包含{{}}  hello {{msg}} world {{age}}
          var tokens = [];
          var lastIndex = defaultTagRE.lastIndex = 0;
          var match, index;
          while (match = defaultTagRE.exec(text)) {
            //exec每次匹配后会更新lastIndex
            index = match.index;
            if (index > lastIndex) {
              //{{}}前面有纯文本
              tokens.push(JSON.stringify(text.slice(lastIndex, index)));
            }
            tokens.push("_s(".concat(match[1].trim(), ")")); //{{}}变量
            lastIndex = index + match[0].length;
          }
          if (lastIndex < text.length) {
            //最后还有纯文本
            tokens.push(JSON.stringify(text.slice(lastIndex)));
          }
          return "_v(".concat(tokens.join("+"), ")"); //拼接
        }
      }
    }
    function generate(ast) {
      // console.log('generate:',ast)
      var code = "_c(".concat(JSON.stringify(ast.tag), ",").concat(ast.attrs.length ? "".concat(genProps(ast.attrs)) : 'null', ",").concat(ast.children.length ? "".concat(genChildren(ast.children)) : 'null', ")");
      // console.log(code);
      return code;
    }

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

    var unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/;

    // Regular Expressions for parsing tags and attributes
    var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
    var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z".concat(unicodeRegExp.source, "]*"); //匹配标签名 div
    var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); //匹配标签名  div:xx
    var startTagOpen = new RegExp("^<".concat(qnameCapture)); //匹配开始标签的正则  <div
    var startTagClose = /^\s*(\/?)>/; //匹配开始标签的结束  >   </div
    var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); //匹配结束标签  </div>
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        attrs: attrs,
        children: [],
        type: 1,
        parent: null
      };
    }
    var root; //根元素
    var createParent; //当前元素的父元素
    //用到一种数据结构
    var stack = [];
    function start(tag, attrs) {
      //开始标签
      // console.log(tag,attrs,":开始标签")
      var element = createASTElement(tag, attrs);
      if (!root) {
        root = element;
      }
      createParent = element;
      stack.push(element);
    }
    function charts(text) {
      //文本
      // console.log(text,":文本")
      //处理下空格
      text = text.replace(/^\s+|\s+$/g, '');
      createParent.children.push({
        type: 3,
        text: text
      });
    }
    function end(tag) {
      //结束标签
      // console.log(tag,":结束标签")
      var element = stack.pop();
      createParent = stack[stack.length - 1];
      if (createParent) {
        //元素的闭合
        element.parent = createParent;
        createParent.children.push(element);
      }
    }
    function parseHTML(html) {
      //<div id="app">Hello World {{msg}}</div>  转换为ast语法树， 开始标签  文本  结束标签
      while (html) {
        //判断标签
        var textEnd = html.indexOf("<"); //0 
        if (textEnd == 0) {
          //标签
          //(1)开始标签
          var startTagMatch = parseStartTag(); //处理开始标签内容 {}
          if (startTagMatch) {
            start(startTagMatch.tagName, startTagMatch.attrs);
            continue;
          }
          var endTagMatch = html.match(endTag);
          if (endTagMatch) {
            advance(endTagMatch[0].length);
            end(endTagMatch[1]);
          }
        }
        var text = void 0;
        if (textEnd > 0) {
          //文本
          //获取文本内容
          text = html.substring(0, textEnd);
          // console.log(text,"文本")
        }
        if (text) {
          //文本
          advance(textEnd);
          charts(text);
          // console.log(html)
        }
      }
      function parseStartTag() {
        var start = html.match(startTagOpen); //1.结果 2.false
        // console.log(start)
        //['<div', 'div', index: 0, input: '<div id="app">Hello World {{msg}}</div>', groups: undefined]
        if (start) {
          //创建语法树
          var match = {
            tagName: start[1],
            attrs: []
          };
          //删除开始标签
          advance(start[0].length);
          //属性
          //注意：多个、遍历
          //注意：结束 >
          var attr;
          var _end;
          while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            // console.log(attr)
            //[' id="app"', 'id', '=', 'app', undefined, undefined, index: 0, input: ' id="app">Hello World {{msg}}</div>', groups: undefined]
            match.attrs.push({
              name: attr[1],
              value: attr[3] || attr[4] || attr[4]
            });
            advance(attr[0].length);
          }
          if (_end) {
            advance(_end[0].length);
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

    function compileToFunction(el) {
      // console.log('compileToFunction:',el)
      //把html字符串转换成ast语法树
      var ast = parseHTML(el);
      //把ast语法树转换成render函数
      //(1)把ast语法树转换成字符串 (2)字符串变成函数
      var code = generate(ast);
      // console.log(code)
      //将render字符串转换为render函数
      // 创建函数 new Function  作用域 this(vm) 识别变量with
      var render = new Function("with(this){return ".concat(code, "}"));
      // console.log(render)
      return render;
    }

    /**
     * <div id="app">Hello World{{msg}}<h1>8888<span>9999</span></h1></div>
     * _c('div',{id:'app'},_v('Hello World'+_s(msg)),_c('h1',null,v('8888'),_c('span',null,v('9999') )))
     * 
     * 
     */

    //重新数组方法
    //(1)获取原来数组的方法，从数组原型上进行获取
    var oldArrayProtoMethods = Array.prototype;
    //(2)继承
    var arrayMethods = Object.create(oldArrayProtoMethods);
    //(3)劫持方法，重写部分方法
    var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
    methods.forEach(function (method) {
      arrayMethods[method] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        // console.log('数组劫持',method);
        // this指向的就是数组
        var result = oldArrayProtoMethods[method].apply(this, args);
        // console.log(args) // [{b:100}]
        var inserted;
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break;
          case 'splice':
            inserted = args.splice(2); // splice(0,1,{v:100})
            break;
        }
        //对inserted进行数据劫持,劫持方法在index.js中，那要怎么做呢？？？那就把劫持方法添加到实例上，通过this进行调用
        var ob = this.__ob__; //数组的__ob__
        if (inserted) {
          ob.observerArray(inserted); //对inserted进行数据劫持
        }
        ob.dep.notify(); //通知更新
        return result;
      };
    });

    var id$1 = 0;
    var Dep = /*#__PURE__*/function () {
      function Dep() {
        _classCallCheck(this, Dep);
        this.subs = []; //存放watcher
        this.id = id$1++; //区分不同的dep
      }
      //收集依赖
      return _createClass(Dep, [{
        key: "depend",
        value: function depend() {
          //为了实现dep和watcher之间相互保存，期望watcher保存dep，dep保存watcher
          //双向记忆
          // if(Dep.target){
          //     this.subs.push(Dep.target)
          // }
          Dep.target.addDep(this); //watcher里面存放dep
        }
      }, {
        key: "addSub",
        value: function addSub(watcher) {
          //sub是watcher
          this.subs.push(watcher); //dep里面存放watcher
        }
        //更新
      }, {
        key: "notify",
        value: function notify() {
          //this.subs [] 遍历
          this.subs.forEach(function (watcher) {
            return watcher.update();
          });
        }
      }]);
    }(); //给Dep类添加静态属性target
    Dep.target = null;
    //添加依赖
    function pushTarget(watcher) {
      Dep.target = watcher;
    }
    //删除依赖
    function popTarget() {
      Dep.target = null;
    }

    function observer(data) {
      //观测data
      // console.log('observer:',data)

      //判断data的类型 Vue2--》{}对象
      if (_typeof(data) !== 'object' || data === null) {
        return data;
      }

      //data对象是通过一个class进行数据劫持
      return new Observer(data);
    }
    var Observer = /*#__PURE__*/function () {
      function Observer(value) {
        _classCallCheck(this, Observer);
        //给value增加一个__ob__属性，保存Observer的实例
        Object.defineProperty(value, "__ob__", {
          enumerable: false,
          //不可枚举
          value: this //Observer的实例
        });
        this.dep = new Dep(); //给所有属性添加dep
        // 遍历观测
        // console.log('Observer:',value)
        if (Array.isArray(value)) {
          value.__proto__ = arrayMethods;
          // console.log("数组劫持");
          this.observerArray(value); // [{a:1}]
        } else {
          this.walk(value);
        }
      }
      return _createClass(Observer, [{
        key: "walk",
        value: function walk(data) {
          //{msg :"hello world"} 第一层的数据劫持
          var keys = Object.keys(data);
          //对对象中每个属性进行数据劫持  for
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            var value = data[key];
            defineReactive(data, key, value); //数据劫持
          }
          // Object.keys(value).forEach((key)=>{})
        }
      }, {
        key: "observerArray",
        value: function observerArray(value) {
          //数组的劫持
          for (var i = 0; i < value.length; i++) {
            //对数组的元素进行数据劫持
            observer(value[i]);
          }
        }
      }]);
    }(); //对对象的属性进行数据劫持
    function defineReactive(data, key, value) {
      //{a:{b:10}}
      var childDep = observer(value); //深层数据劫持，递归层数据劫持
      var dep = new Dep(); //给data的每个属性添加Dep
      Object.defineProperty(data, key, {
        get: function get() {
          // console.log("get",key);
          //收集依赖 vm.name
          if (Dep.target) {
            //有watcher
            dep.depend(); //添加依赖
            if (childDep.dep) {
              childDep.dep.depend(); //数组的依赖收集
            }
          }
          // console.log(dep);
          return value;
        },
        // 如何检查效果，去new Vue的地方修改data的值
        set: function set(newValue) {
          // console.log("set",key,newValue);
          if (newValue === value) return;
          observer(newValue); //新值如果是对象，继续劫持
          value = newValue;
          dep.notify(); //通知依赖更新
        }
      });
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

    var callbacks = [];
    var pending$1 = false;
    function flushCallbacks() {
      callbacks.forEach(function (cb) {
        return cb();
      });
      pending$1 = false;
    }
    var timerFunc;
    if (Promise) {
      //Promise
      timerFunc = function timerFunc() {
        Promise.resolve().then(flushCallbacks);
      };
    } else if (MutationObserver) {
      //h5的api
      var observe = new MutationObserver(flushCallbacks);
      var textNode = document.createTextNode(1);
      observe.observe(textNode, {
        characterData: true
      });
      timerFunc = function timerFunc() {
        textNode.textContent = 2;
      };
    } else if (setImmediate) {
      //ie
      timerFunc = function timerFunc() {
        setImmediate(flushCallbacks);
      };
    } else {
      timerFunc = function timerFunc() {
        setTimeout(flushCallbacks, 0);
      };
    }
    function nextTick(cb) {
      //1.vue 2.自定义
      //    console.log(cb)
      //[cb1,cb2,...]
      callbacks.push(cb);
      if (!pending$1) {
        timerFunc();
        pending$1 = true;
      }
    }

    var id = 0;
    var Watcher = /*#__PURE__*/function () {
      function Watcher(vm, expOrFn, cb, options) {
        _classCallCheck(this, Watcher);
        this.vm = vm;
        this.expOrFn = expOrFn;
        this.cb = cb;
        this.options = options;
        this.id = id++; //区分不同的组件
        this.deps = [];
        this.user = !!options.user; //是否是用户自己的watcher
        this.depsId = new Set(); //去重
        if (typeof expOrFn === 'function') {
          this.getter = expOrFn;
        } else {
          //{a,b,c...} 字符串
          this.getter = function () {
            //a.a.a
            var path = expOrFn.split('.');
            var obj = vm;
            for (var i = 0; i < path.length; i++) {
              obj = obj[path[i]];
            }
            return obj;
          };
        }
        //4.更新视图
        this.value = this.get(); //保存watch的初始值
      }
      return _createClass(Watcher, [{
        key: "addDep",
        value: function addDep(dep) {
          //去重
          if (!this.depsId.has(dep.id)) {
            this.deps.push(dep);
            this.depsId.add(dep.id);
            dep.addSub(this);
          }
        }
      }, {
        key: "run",
        value: function run() {
          // old new 
          var value = this.get();
          var oldValue = this.value;
          this.value = value;
          if (this.user) {
            this.cb.call(this.vm, value, oldValue);
          }
        }
        //首次渲染
      }, {
        key: "get",
        value: function get() {
          pushTarget(this); //收集依赖,target 给dep添加watcher
          var value = this.getter(); // 渲染页面 vm._update(vm._render()) _s(name) -->get
          popTarget(); //清除依赖 给dep取消watcher
          return value; //oldValue
        }
        //更新
      }, {
        key: "update",
        value: function update() {
          //注意：不要数据更新后立即调用get方法，get方法会重新渲染
          //缓存
          // this.get() //更新渲染
          queueWatcher(this); //异步更新 
        }
      }]);
    }();
    var queue = []; //存放要更新的watcher
    var has = {};
    var pending = false;
    var userWatcher;
    function flushSchedulerQueue() {
      queue.forEach(function (w) {
        w.run();
        if (!userWatcher) {
          w.cb();
        }
      });
      queue = [];
      has = {};
      pending = false;
    }
    function queueWatcher(watcher) {
      var id = watcher.id; //每个组件都是同一个watcher
      userWatcher = watcher.user;
      // console.log(id)
      if (!has[id]) {
        //去重
        queue.push(watcher);
        has[id] = true;
        //防抖：频繁操作，只执行一次
        if (!pending) {
          // setTimeout(()=>{
          //     queue.forEach(w=>w.run());
          //     queue = []
          //     has = {}
          //     pending = false
          // },0)
          nextTick(flushSchedulerQueue); //异步处理，传cb回到函数
        }
        pending = true;
      }
    }

    //收集依赖：vue dep watcher data:{neme,msg}
    // dep:dep和data中的属性是一一对应的关系
    //watcher:在视图上用到几次，就有多少个watcher
    //dep和watcher:一对多（多对对）dep.name=[w1,w2,w3,...]

    //nextTick原理：异步更新

    function initState(vm) {
      // console.log(vm.$options)
      var opts = vm.$options;
      //判断实例上的属性，做初始化操作
      if (opts.data) {
        initData(vm);
      }
      if (opts.computed) ;
      if (opts.watch) {
        initWatch(vm);
      }
      if (opts.methods) ;
      if (opts.props) ;
      if (opts.beforeCreate) ;
    }
    function initWatch(vm) {
      // 1.获取watch选项
      var watch = vm.$options.watch;
      console.log(watch, 666);
      // 2.遍历watch选项 {a,b,c,...}
      for (var key in watch) {
        //2.1获取到对应的属性值（判断）
        var handler = watch[key]; //数组，对象，方法，字符串
        if (Array.isArray(handler)) {
          //数组
          for (var i = 0; i < handler.length; i++) {
            createWatcher(vm, key, handler[i]);
          }
        } else {
          //对象，方法，字符串
          //3.创建一个方法来处理
          createWatcher(vm, key, handler);
        }
      }
    }

    // 对data进行初始化-Vue2
    // data 1.object 2 function
    //data{}里的数据 1）对象 2）数组  {a:{b:1},arr:[{a:1},{b:2}],list:[1,2,3]} 
    function initData(vm) {
      // console.log(vm.$options.data);
      console.log(vm);
      var data = vm.$options.data;
      // 注意：this指向问题，data()指向 -->window; data.call(vm)指向Vue实例
      // data = typeof data === 'function'?data.call(vm):data;
      //vm._data验证data劫持的效果
      data = vm._data = typeof data === 'function' ? data.call(vm) : data || {};
      //至此，是为了拿到data数据做铺垫，现在才是进行data数据的劫持

      //将data中的数据全部代理到vm上
      for (var key in data) {
        proxy(vm, "_data", key);
      }
      //data数据劫持
      observer(data);
    }
    function proxy(vm, source, key) {
      Object.defineProperty(vm, key, {
        get: function get() {
          return vm[source][key];
        },
        set: function set(newValue) {
          vm[source][key] = newValue;
        }
      });
    }
    function stateMixin(Vue) {
      Vue.prototype.nextTick = function (cb) {
        nextTick(cb);
      };
      Vue.prototype.$watch = function (expOrFn, cb, options) {
        //wacth
        // console.log(expOrFn, cb, options)
        //实现watch 就是 new Watcher  渲染走渲染watcher  $watch：走watcher user：true
        // watch的核心是Watcher
        new Watcher(this, expOrFn, cb, _objectSpread2(_objectSpread2({}, options), {}, {
          user: true
        }));
        if (options.immediate) {
          cb.call(this); //立即执行
        }
      };
    }

    // vm.$wacth(()=>{return 'exp'}) //返回值就是watch上的属性值   expOrFn
    // user = fasle 初始化  user = true 用户自定义 options
    //格式化处理
    function createWatcher(vm, expOrFn, handler) {
      var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
      //3.1处理handler
      if (_typeof(handler) === 'object') {
        options = handler; //用户配置内容
        handler = handler.handler; //{}这是一个对象
      }
      if (typeof handler === 'string') {
        //'msg'
        handler = vm[handler]; //vm['msg'] => 方法,实例上的方法 方法的代理和data的代理是一样的
      }
      // 其他：方法函数
      //watch 最终都是用$watch来处理的
      return vm.$watch(expOrFn, handler, options);
    }

    function pacth(oldVnode, vnode) {
      // console.log(oldVnode,vnode)
      //vnode =>真实dom
      // 1.创建dom
      var el = createElm(vnode);
      // console.log(el)
      // 2、替换 1）获取父节点 2）拆入新元素 3）删除旧元素
      var parentEL = oldVnode.parentNode;
      parentEL.insertBefore(el, oldVnode.nextsibling);
      parentEL.removeChild(oldVnode);
      return el;
    }
    //创建dom
    function createElm(vnode) {
      // vnode {tag,data,children,text,key}
      var tag = vnode.tag;
        vnode.data;
        vnode.key;
        var children = vnode.children,
        text = vnode.text;
      if (typeof tag === 'string') {
        //标签
        vnode.el = document.createElement(tag);
        if (children.length > 0) {
          children.forEach(function (child) {
            vnode.el.appendChild(createElm(child));
          });
        }
      } else {
        vnode.el = document.createTextNode(text);
      }
      return vnode.el;
    }

    function mountCompoent(vm, el) {
      //挂载之前调用beforeMount生命周期
      callHook(vm, 'beforeMount');
      //1.vm._render() 生成虚拟dom
      //2.vm._update()  根据虚拟dom生成真实dom,渲染到页面上
      // vm._update(vm._render())
      new Watcher(vm, function () {
        vm._update(vm._render());
      }, function () {
        callHook(vm, 'updated');
      }, true);
      //挂载之后调用mounted生命周期
      callHook(vm, 'mounted');
    }
    function lifeCycleMixin(Vue) {
      Vue.prototype._update = function (vnode) {
        //根据虚拟dom 生成真实dom
        // console.log(vnode)
        var vm = this;
        vm.$el = pacth(vm.$el, vnode); //传2个参数：1)旧的dom => 回到init.js里，把旧的dom添加到实例上 2)虚拟dom
      };
    }

    //render函数 =》vdom =》真实dom

    //调用生命周期钩子函数
    function callHook(vm, hook) {
      var handers = vm.$options[hook]; //[] 遍历执行
      if (handers) {
        for (var i = 0; i < handers.length; i++) {
          handers[i].call(vm);
        }
      }
    }

    function initMixin(Vue) {
      Vue.prototype._init = function (options) {
        // console.log(options)
        var vm = this;
        // vm.$options = options;//需要把组件内的选项和Vue选进行合并
        // 合并组件的选项：第一个参数是全局父级的options，故为Vue.options
        vm.$options = mergeOptions(Vue.options, options);
        //初始化状态之前调用beforeCreate
        callHook(vm, 'beforeCreate');
        //初始化状态
        initState(vm);
        //初始化状态之后调用created
        callHook(vm, 'created');

        //模版编译，先获取到html
        if (vm.$options.el) {
          vm.$mount(vm.$options.el);
        }
      };
      Vue.prototype.$mount = function (el) {
        var vm = this;
        el = document.querySelector(el);
        vm.$el = el; //把el挂载到vm上
        var ops = vm.$options;
        if (!ops.render) {
          var template = ops.template;
          if (!template && el) {
            template = el.outerHTML;
            // console.log(template)
            //<div id="app">Hello World {{msg}}</div> 需要转化为ast
            //转化为ast语法树
            // let ast = compileToFunction(template);
            //改成render
            var render = compileToFunction(template);
            // console.log(render)
            // （1）将render函数变成vnode  （2）把vnode变成真实dom,渲染到页面上
            ops.render = render;
          }
        }
        //挂载 传参：实例，元素
        mountCompoent(vm);
      };
    }
    //<div id="app">Hello World {{msg}}</div>
    // ast {} dom css js  vnode dom节点

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
     * 
     
     * 
     */

    function renderMixin(Vue) {
      Vue.prototype._c = function () {
        //标签
        //标签-》需要创建标签
        return createElement.apply(void 0, arguments);
      };
      Vue.prototype._v = function (text) {
        //文本
        return createContext(text);
      };
      Vue.prototype._s = function (val) {
        //{{}} =>变量 _s(msg)
        return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
      };
      Vue.prototype._render = function () {
        //render函数返回的就是虚拟dom
        var vm = this;
        var render = vm.$options.render; //就是我们编译后的render函数
        //执行render函数，需要注意，我们要传入this，this就是当前组件实例，render函数会返回虚拟dom
        var vdom = render.call(this);
        // console.log(vdom)
        return vdom;
      };
    }

    //创建标签
    function createElement(tag) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        children[_key - 2] = arguments[_key];
      }
      return vnode(tag, data, data === null || data === void 0 ? void 0 : data.key, children);
    }
    //创建文本
    function createContext(text) {
      return vnode(undefined, undefined, undefined, undefined, text);
    }
    //创建节点
    function vnode(tag, data, key, children, text) {
      return {
        tag: tag,
        data: data,
        key: key,
        children: children,
        text: text
      };
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

    function Vue(options) {
      // console.log('Welcome to Vue')
      this._init(options); //初始化来的
    }
    initMixin(Vue);
    lifeCycleMixin(Vue); //添加生命周期
    renderMixin(Vue); //添加_render方法
    stateMixin(Vue); //添加nextTick方法
    initGlobalApi(Vue); //添加全局api Vue.Mixin Vue.component Vue.exend Vue.directive Vue.filter

    return Vue;

}));
//# sourceMappingURL=vue.js.map
