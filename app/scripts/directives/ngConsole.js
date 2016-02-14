var dev=!1,version="1.3.0";officeDoors.directive("ngConsole",["$rootScope",function(o){return{restrict:"AE",transclude:!0,template:'<style>ng-console{position:relative;display:inline-block;width:100%;height:auto;padding:0px;margin:0px;} .console,.console *{left:0;box-sizing:border-box;margin:0}.console{position:relative;display:inline-block;float:left;width:100%;min-height:300px;padding:10px;top:0;background:rgba(0,0,0,1);border:0;outline:0;overflow-x:hidden;overflow-y:scroll;transition:all .3s;z-index:50}.console.fixed{position:fixed;display:block;height:50%;top:-50%;background:rgba(0,0,0,0.8);}.console.fixed.fullscreen{height:100%!important;top:-100%!important}.console.fixed.fullscreen.open,.console.fixed.open,.console.open{top:0!important}.console *{padding:0;top:0;color:#ccc;font-family:monospace;font-size:11px;line-height:130%;list-style:none;text-align:left}.console b{color:#fff;}.console input::-webkit-calendar-picker-indicator{display:none}.console .command-list .prefix,.console .command-list input[type=text],.console .command-list p,.console .command-new-line .prefix,.console .command-new-line input[type=text],.console .command-new-line p{position:relative;display:block;float:left;width:100%;height:auto;padding:0;margin:0;bottom:0;appearance:none;-moz-appearance:none;-webkit-appearance:none;background-color:transparent;border:none;outline:0}.console .command-list, .console .command-new-line{position: relative;display: block;float: left;width: 100%;}.console .command-new-line .prefix{width:auto}.console .command-new-line input[type=text]{width:100%;max-width:calc(100% - 130px);padding:0 5px}</style><style id="custom-bg"></style><style id="custom-color"></style><style id="custom-fontsize"></style><style id="custom-fontfamily"></style><form name="console" role="form" novalidate class="console" ng-class="{\'open\': options.open, \'fixed\': options.fixed, \'fullscreen\': options.fullscreen}" ng-submit="executeCommand()"><!-- Command list --><div class="command-list"></div><div class="command-new-line"><span class="prefix">{{ options.customPrefix }}></span><input type="text" name="command" ng-model="command" tab-index="1" autofocus autocomplete="off" /><datalist id="commands"><option ng-repeat="command in commands" value="{{ command.name }}"></datalist></div></form>',scope:{options:"=options"},link:function(o,e,n){function t(o,e,n,t){this.name=o,this.description="&nbsp;&nbsp;<b>"+o+"</b>: "+e,this.params=n,this.exec=t}o.init=function(){if(o.options.customHeight&&!o.options.fullscreen&&(document.querySelector(".console").style.height=o.options.customHeight,o.options.fixed&&(document.querySelector(".console").style.top=-1*o.options.customHeight)),o.options.customPrefix||(o.options.customPrefix="ngConsole"),o.options.customPrefix,o.commands={},o.commands.browser=new t("browser","Some actions related to the browser.",[{name:"info",description:"Show the the version of the browser you are using."}],function(o,e){e&&e.info&&(o(navigator.userAgent),o("<br />"))}),o.commands.clear=new t("clear","Clean command history.",!1,function(o,e){document.querySelector(".command-list").innerHTML=""}),o.commands.cls=new t("cls","Clean command history.",!1,o.commands.clear.exec),o.commands.console=new t("console","Some actions related to ngConsole",[{name:"bg",description:"Change the ngConsole's background."},{name:"color",description:"Change the ngConsole's font color."},{name:"fontfamily",description:"Change the ngConsole's font family."},{name:"fontsize",description:"Change the ngConsole's font size."},{name:"info",description:"Display info about ngConsole."},{name:"reset",description:"Restore ngConsole's state to its initial state."}],function(e,n){if(n){if(n.bg){var t=".console{ background: "+n.bg+" !important; }";document.querySelector("ng-console #custom-bg").innerHTML=t}if(n.color){var t=".console, .console *{ color: "+n.color+" !important; }";document.querySelector("ng-console #custom-color").innerHTML=t}if(n.fontfamily){var t=".console, .console *{ font-family: "+n.fontfamily+" !important; }";document.querySelector("ng-console #custom-fontfamily").innerHTML=t}if(n.fontsize){var t=".console, .console *{ font-size: "+parseInt(n.fontsize)+"px !important; }";document.querySelector("ng-console #custom-fontsize").innerHTML=t}n.info&&(e("<b>ngConsole v"+version+"</b>"),e("<b>Author</b>: ImperdibleSoft (<a href='http://www.imperdiblesoft.com' target='_blank'>http://www.imperdiblesoft.com</a>)"),e("<b>Repository</b>: <a href='https://github.com/ImperdibleSoft/ngConsole' target='_blank'>https://github.com/ImperdibleSoft/ngConsole</a>"),e("<br />")),n.reset&&(o.options.open=!1,document.querySelector("ng-console #custom-bg").innerHTML="",document.querySelector("ng-console #custom-color").innerHTML="",document.querySelector("ng-console #custom-fontfamily").innerHTML="",document.querySelector("ng-console #custom-fontsize").innerHTML="",o.executeCommand("clear"),o.executeCommand("console --info",!0),o.history=[],o.historyIndex=0,o.apply())}}),o.commands.exit=new t("exit","Close the console.",!1,function(e,n){o.commands.clear.exec(),o.toggle()}),o.commands.help=new t("help","Show all available commands.",!1,function(e,n){var t="<p>Available commands: ";t+="<ul>";for(var i in o.commands){var s=o.commands[i];if(t+="<li>",t+=s.description,s.params){t+="<ul>";for(var l in s.params){var c=s.params[l];t+="<li>",t+="&nbsp;&nbsp;&nbsp;&nbsp;<b>--"+c.name+"</b>: "+c.description,t+="</li>"}t+="</ul>"}t+="</li>"}t+="</ul>",e(t)}),o.options.customCommands)for(var e in o.options.customCommands){var n=o.options.customCommands[e];o.commands[n.name]=new t(n.name,n.description,n.params,n.action)}o.history=[],o.executeCommand("console --info",!0)},o.toggle=function(){o.options.open=!o.options.open,o.options.open===!0?(o.scrollBottom(),document.querySelector(".console .command-new-line input")&&document.querySelector(".console .command-new-line input").focus()):document.querySelector(".console .command-new-line input")&&(document.querySelector(".console .command-new-line input").blur(),o.cleanLn()),o.apply()},o.printLn=function(o){var e=document.querySelector(".console .command-list").innerHTML;document.querySelector(".console .command-list").innerHTML=e+"<p>"+o+"</p>"},o.cleanLn=function(){o.command=""},o.scrollBottom=function(){var o=document.querySelector(".console"),e=document.querySelector(".command-list").clientHeight+document.querySelector(".command-new-line").clientHeight;o.scrollTop=e},o.apply=function(){dev&&dev!==!0||o.$apply()},o.executeCommand=function(e,n){if(e&&""!=e)var t=e;else var t=o.console.command.$modelValue?o.console.command.$modelValue:"";o.cleanLn(),n||(o.printLn(o.options.customPrefix+"> <b>"+t+"</b>"),o.history.push(t)),o.historyIndex=o.history.length-1;var i=!1;for(var s in o.commands){var l=o.commands[s];if(t.indexOf(" --")>=0&&t.substr(0,t.indexOf(" --"))===l.name||t.indexOf(" --")<0&&t===l.name){if(i=!0,t.indexOf(" --")>=0){var c=t.split(" --"),a={};for(var r in c)if(0!=r){var m=c[r].split("="),d={name:m[0],value:m[1]&&""!=m[1]?m[1].replaceAll('"',""):!0};for(var p in l.params)d.name===l.params[p].name&&(a[d.name]=d.value)}l.exec(o.printLn,a)}else l.exec(o.printLn);break}}i||(""!=t&&t?o.printLn("'<b>"+t+"</b>': command not found. Use 'help' for more info."):o.printLn("")),o.scrollBottom()},String.prototype.replaceAll=function(o,e){var n=this;return n.replace(new RegExp(o,"g"),e)},document.addEventListener("keyup",function(e){220==e.keyCode||"º"==e.key?(e.preventDefault(),o.toggle()):27==e.keyCode||"Escape"==e.key?(e.preventDefault(),""!=o.command?o.cleanLn():1==o.options.fixed&&1==o.options.open&&o.toggle(),o.apply()):(38==e.keyCode||"Up"==e.key||40==e.keyCode||"Down"==e.key)&&(e.preventDefault(),o.command=o.history[o.historyIndex],38==e.keyCode||"Up"==e.key?0==o.historyIndex?o.historyIndex=o.history.length-1:o.historyIndex--:(40==e.keyCode||"Down"==e.key)&&(o.historyIndex==o.history.length-1?o.historyIndex=0:o.historyIndex++),o.apply())}),o.init()}}}]);
