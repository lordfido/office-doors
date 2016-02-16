var dev=!1,version="1.5.2";officeDoors.directive("ngConsole",["$rootScope",function(o){return{restrict:"AE",transclude:!0,template:'<style>ng-console{position:relative;display:inline-block;width:100%;height:auto;padding:0px;margin:0px;z-index:999999999;} .console,.console *{left:0;box-sizing:border-box;margin:0}.console{position:relative;display:inline-block;float:left;width:100%;padding:10px;top:0;background:rgba(0,0,0,1);border:0;outline:0;overflow-x:hidden;overflow-y:scroll;transition:all .3s;z-index:50}.console.fixed{position:fixed;display:block;height:50%;top:-50%;background:rgba(0,0,0,0.8);}.console.fixed.fullscreen{height:100%!important;top:-100%!important}.console.fixed.fullscreen.open,.console.fixed.open,.console.open{top:0!important}.console *{padding:0;top:0;color:#ccc;font-family:monospace;font-size:11px;line-height:150%;list-style:none;text-align:left}.console b{color:#fff;}.console input::-webkit-calendar-picker-indicator{display:none}.console .command-list .prefix,.console .command-list input[type=text],.console .command-list p,.console .command-new-line .prefix,.console .command-new-line input[type=text],.console .command-new-line p{position:relative;display:block;float:left;width:100%;height:auto;padding:0;margin:0;bottom:0;appearance:none;-moz-appearance:none;-webkit-appearance:none;background-color:transparent;border:none;outline:0}.console .command-list, .console .command-new-line{position: relative;display: block;float: left;width: 100%;}.console .command-new-line .prefix{width:auto}.console .command-new-line input[type=text]{width:100%;max-width:calc(100% - 130px);padding:0 5px}</style><style id="custom-bg"></style><style id="custom-color"></style><style id="custom-fontsize"></style><style id="custom-fontfamily"></style><form name="console" role="form" novalidate class="console" ng-class="{\'open\': options.open, \'fixed\': options.fixed, \'fullscreen\': options.fullscreen}" ng-submit="executeCommand()"><!-- Command list --><div class="command-list"></div><div class="command-new-line"><span class="prefix">{{ options.customPrefix }}></span><input type="text" name="command" ng-model="command" tab-index="1" autofocus autocomplete="off" /><datalist id="commands"><option ng-repeat="command in commands" value="{{ command.name }}"></datalist></div></form>',scope:{options:"=options"},link:function(o,e,n){function t(o,e,n,t){this.name=o,this.description="&nbsp;&nbsp;<b>"+o+"</b>: "+e,this.params=n,this.exec=t}o.init=function(){if(o.options.customHeight&&!o.options.fullscreen?(document.querySelector(".console").style.height=o.options.customHeight,o.options.fixed&&(document.querySelector(".console").style.top=-1*o.options.customHeight)):o.options.customHeight||(document.querySelector(".console").style.height=400,o.options.fixed&&(document.querySelector(".console").style.top=-400)),o.options.customPrefix||(o.options.customPrefix="ngConsole"),o.options.customPrefix,o.commands={},o.commands.browser=new t("browser","Some actions related to the browser.",[{name:"info",description:"Show the the version of the browser you are using."}],function(o,e){e&&e.info&&(o(navigator.userAgent),o("<br />"))}),o.commands.clear=new t("clear","Clean command history.",!1,function(o,e){document.querySelector(".command-list").innerHTML=""}),o.commands.cls=new t("cls","Clean command history ('clear' alias).",!1,function(e,n){o.executeCommand("clear",!0)}),o.commands.console=new t("console","Some actions related to ngConsole",[{name:"bg",description:"Change the ngConsole's background."},{name:"color",description:"Change the ngConsole's font color."},{name:"fontfamily",description:"Change the ngConsole's font family."},{name:"fontsize",description:"Change the ngConsole's font size."},{name:"info",description:"Display info about ngConsole."},{name:"close",description:"Close the console and clear commands history."},{name:"reset",description:"Restore ngConsole's state to its initial state."}],function(e,n){if(n){if(n.bg){var t=".console{ background: "+n.bg+" !important; }";document.querySelector("ng-console #custom-bg").innerHTML=t,o.saveConfig("ngc-bg",n.bg)}if(n.color){var t=".console, .console *{ color: "+n.color+" !important; }";document.querySelector("ng-console #custom-color").innerHTML=t,o.saveConfig("ngc-color",n.color)}if(n.fontfamily){var t=".console, .console *{ font-family: "+n.fontfamily+" !important; }";document.querySelector("ng-console #custom-fontfamily").innerHTML=t,o.saveConfig("ngc-fontfamily",n.fontfamily)}if(n.fontsize){var t=".console, .console *{ font-size: "+parseInt(n.fontsize)+"px !important; }";document.querySelector("ng-console #custom-fontsize").innerHTML=t,o.saveConfig("ngc-fontsize",n.fontsize)}n.info&&(e("<b>ngConsole v"+version+"</b>"),e("<b>Author</b>: ImperdibleSoft (<a href='http://www.imperdiblesoft.com' target='_blank'>http://www.imperdiblesoft.com</a>)"),e("<b>Repository</b>: <a href='https://github.com/ImperdibleSoft/ngConsole' target='_blank'>https://github.com/ImperdibleSoft/ngConsole</a>"),e("<br />")),n.close&&(o.options.open=!1,o.executeCommand("clear",!0),o.executeCommand("console --info",!0),o.history=[],o.historyIndex=0,o.apply()),n.reset&&(document.querySelector("ng-console #custom-bg").innerHTML="",document.querySelector("ng-console #custom-color").innerHTML="",document.querySelector("ng-console #custom-fontfamily").innerHTML="",document.querySelector("ng-console #custom-fontsize").innerHTML="",localStorage&&(localStorage.removeItem("ngc-bg"),localStorage.removeItem("ngc-color"),localStorage.removeItem("ngc-fontfamily"),localStorage.removeItem("ngc-fontsize")),o.executeCommand("console --close",!0))}}),o.commands.exit=new t("exit","Close the console and clear commands history ('console --close' alias).",!1,function(e,n){o.executeCommand("console --close",!0)}),o.commands.help=new t("help","Show all available commands.",!1,function(e,n){var t="<p>Available commands: ";t+="<ul>";for(var i in o.commands){var c=o.commands[i];if(t+="<li>",t+=c.description,c.params){t+="<ul>";for(var l in c.params){var s=c.params[l];t+="<li>",t+="&nbsp;&nbsp;&nbsp;&nbsp;<b>--"+s.name+"</b>: "+s.description,t+="</li>"}t+="</ul>"}t+="</li>"}t+="</ul>",e(t)}),o.options.customCommands)for(var e in o.options.customCommands){var n=o.options.customCommands[e];o.commands[n.name]=new t(n.name,n.description,n.params,n.action)}o.history=[],o.loadConfig(),o.executeCommand("console --info",!0)},o.saveConfig=function(o,e){localStorage&&o&&e&&localStorage.setItem(o,e)},o.loadConfig=function(){if(localStorage){if(localStorage.getItem("ngc-bg")&&""!=localStorage.getItem("ngc-bg")){var o=".console{ background: "+localStorage.getItem("ngc-bg")+" !important; }";document.querySelector("ng-console #custom-bg").innerHTML=o}if(localStorage.getItem("ngc-color")&&""!=localStorage.getItem("ngc-color")){var o=".console, .console *{ color: "+localStorage.getItem("ngc-color")+" !important; }";document.querySelector("ng-console #custom-color").innerHTML=o}if(localStorage.getItem("ngc-fontfamily")&&""!=localStorage.getItem("ngc-fontfamily")){var o=".console, .console *{ font-family: "+localStorage.getItem("ngc-fontfamily")+" !important; }";document.querySelector("ng-console #custom-fontfamily").innerHTML=o}if(localStorage.getItem("ngc-fontsize")&&""!=localStorage.getItem("ngc-fontsize")){var o=".console, .console *{ font-size: "+parseInt(localStorage.getItem("ngc-fontsize"))+"px !important; }";document.querySelector("ng-console #custom-fontsize").innerHTML=o}}},o.toggle=function(){o.options.open=!o.options.open,o.options.open===!0?(o.scrollBottom(),document.querySelector(".console .command-new-line input")&&document.querySelector(".console .command-new-line input").focus()):document.querySelector(".console .command-new-line input")&&(document.querySelector(".console .command-new-line input").blur(),o.cleanLn()),o.apply()},o.printLn=function(e){var n=document.querySelector(".console .command-list").innerHTML;document.querySelector(".console .command-list").innerHTML=n+"<p>"+e+"</p>",o.scrollBottom()},o.cleanLn=function(){o.command=""},o.scrollBottom=function(){var o=document.querySelector(".console"),e=document.querySelector(".command-list").clientHeight+document.querySelector(".command-new-line").clientHeight;o.scrollTop=e},o.apply=function(){dev&&dev!==!0||o.$apply()},o.executeCommand=function(e,n){if(e&&""!=e)var t=e;else var t=o.console.command.$modelValue?o.console.command.$modelValue:"";o.cleanLn(),n||(o.printLn(o.options.customPrefix+"> <b>"+t+"</b>"),""!==t&&o.history.push(t)),o.historyIndex=!1;var i=!1;for(var c in o.commands){var l=o.commands[c];if(t.indexOf(" --")>=0&&t.substr(0,t.indexOf(" --"))===l.name||t.indexOf(" --")<0&&t===l.name){if(i=!0,t.indexOf(" --")>=0){var s=t.split(" --"),a={};for(var r in s){var m=!1;if(0!=r){var d=s[r].split("="),p={name:d[0],value:d[1]&&""!=d[1]?d[1].replaceAll('"',""):!0};for(var f in l.params)if(p.name===l.params[f].name){m=!0,a[p.name]=p.value;break}m||o.printLn("'<b>--"+p.name+"</b>': param not found on '<b>"+l.name+"</b>' command. Use 'help' for more info.")}}l.exec(o.printLn,a)}else l.exec(o.printLn);break}}if(!i)if(""!=t&&t){var a=t.split(" --");o.printLn("'<b>"+a[0]+"</b>': command not found. Use 'help' for more info.")}else o.printLn("");o.scrollBottom()},String.prototype.replaceAll=function(o,e){var n=this;return n.replace(new RegExp(o,"g"),e)},document.addEventListener("keyup",function(e){220==e.keyCode||"º"==e.key?(e.preventDefault(),o.toggle()):(27==e.keyCode||"Escape"==e.key)&&(e.preventDefault(),o.historyIndex=!1,""!=o.command?o.cleanLn():1==o.options.fixed&&1==o.options.open&&o.toggle(),o.apply())});var i=document.querySelector(".console .command-new-line input[type='text']");i.addEventListener("keyup",function(e){(38==e.keyCode||"Up"==e.key||40==e.keyCode||"Down"==e.key)&&(e.preventDefault(),38==e.keyCode||"Up"==e.key?0===o.historyIndex||o.historyIndex===!1?o.historyIndex=o.history.length-1:o.historyIndex--:(40==e.keyCode||"Down"==e.key)&&(o.historyIndex===o.history.length-1||o.historyIndex===!1?o.historyIndex=0:o.historyIndex++),o.command=o.history[o.historyIndex],o.apply())}),o.init()}}}]);
