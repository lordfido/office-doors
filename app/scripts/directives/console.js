officeDoors.directive('console',
  ['$rootScope', 'services', 'maintenanceServices',
  function($rootScope, services, maintenanceServices) {
    return {
      restrict: 'AE',
      transclude: true,
      templateUrl: '/scripts/views/partials/console.html',
      link: function(scope, element, attrs){

        scope.init = function(){
          scope.open = false;
          scope.prefix = "DevSpark DoorBell>";

          /* Default commands */
          scope.commands = {};
          scope.commands.help = new Command(
            "help",
            "Show all available commands.",
            function(){
              var temp = "<p>Available commands: ";
              temp += "<ul>";
              for(var x in scope.commands){
                var elem = scope.commands[x];
                temp += "<li>"+ elem.description +"</li>";
              }
              temp += "</ul>";
              $(".command-list").append(temp);
            }
          );
          scope.commands.clear = new Command(
            "clear",
            "Clean command history.",
            function(){
              $(".command-list").html("");
            }
          );
          scope.commands.cls = new Command(
            "cls",
            "Clean command history.",
            scope.commands.clear.exec
          );
          scope.commands.exit = new Command(
            "exit",
            "Close the console.",
            function(){
              scope.commands.clear.exec();
              scope.toggle();
            }
          );

          /* Custom commands */
          scope.commands.cameraFix = new Command(
            "camera fix",
            "Reset camera capture proccess.",
            function(){

              var temp = "Camera-fix request was sent.";
              $(".command-list").append("<p>" + temp + "</p>");

              maintenanceServices.cameraFix().then(function(response){

                var temp = "Camera <b><span style=\'color: green;\'>fixed</span></b>.";
                $(".command-list").append("<p>" + temp + "</p>");
              });
            }
          );
          scope.commands.screenshot = new Command(
            "screenshot",
            "Download a camera screenshot.",
            function(){
              window.open(SVC_URL.baseURL + imgName);
            }
          );
          scope.commands.serverStatus = new Command(
            "server status",
            "Ping backend service and verify if it's online.",
            function(){
              services.talk().success(function(response){

                var temp = "Server is <b><span style='color: green'>online</span></b>.";
                $(".command-list").append(temp);

              }).error(function(){

                var temp = "Server is <b><span style='color: red'>offline</span></b>.";
                $(".command-list").append(temp);
              });
            }
          );
          scope.commands.say = new Command(
            "say",
            "Tony will say anything you want by the speakers.",
            function(){
              var text = scope.console.command.$modelValue;
              var data = {
                texto: text.substr(text.indexOf(" ") + 1)
              };
              services.talk(data).success(function(){

                var temp = "<p>Tony has spoken.</p>";
                $(".command-list").append(temp);
              }).error(function(status, data, headers, config){

                var temp = "<p>Tony wasn't able to hear you.</p>";
                $(".command-list").append(temp);
              });
            }
          );
        };

        /* Open/close the console */
        scope.toggle = function(){
          scope.open = !scope.open;

          if(scope.open === true){

            /* Scrolls to new line */
            $(".console").scrollTop( $(".new-line").offset().top );

            /* Focus the new line */
            $(".console .new-line input").focus().select().click();
          }
          if(dev){ scope.$apply(); }
        };

        /* Send the command */
        scope.executeCommand = function(){

          /* Read the command */
          var command = scope.console.command.$modelValue;

          /* Execute the command */
          var temp = "<p>"+ scope.prefix +" <span style=\'color: white;\'>"+ command +"</span></p>";
          $(".command-list").append("<p>" + temp + "</p>");

          /* Loop all available commands */
          var existing = false;
          for(var x in scope.commands){
            var elem = scope.commands[x];

            if(command === elem.name && elem.name !== "say"){
              existing = true;
              elem.exec();
              break;
            }
            else if(elem.name === "say" && command.indexOf(elem.name) >= 0){
              existing = true;
              elem.exec();
              break;
            }
          }

          /* If no available command */
          if(!existing){
            command = "\'<b><span style=\'color: white;\'>" + command + "</span></b>\': command not found. Use \'help\' for more info.";
            $(".command-list").append("<p>" + command + "</p>");
          }

          /* Clean new line */
          scope.console.command.$modelValue = "";
          $(".console .new-line input").val("");

          /* Scrolls to new line */
          $(".console").scrollTop( $(".new-line").offset().top );
        };

        /* Command builder */
        function Command(name, description, callback){
          this.name = name;
          this.description = "&nbsp;&nbsp;<span style=\'color: white;\'>"+ name +"</span>: "+ description;
          this.exec = callback;
        };

        scope.init();

        /* Detect key press */
        $(document).on('keyup', function(e){

          /* Open/Close the console */
          if(e.keyCode == 220 || e.key == "º"){
            e.preventDefault();
            scope.toggle();
          }

          /* Remove already written */
          else if(scope.open && (e.keyCode == 27 || e.key== "Escape")){
            e.preventDefault();
            if($(".console .new-line input").val() != ""){
              scope.console.command.$modelValue = "";
              $(".console .new-line input").val("");
            }
            else{
              scope.open = false;
            }
          }
        });
      }
    }
}]);
