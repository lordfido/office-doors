/*	App start	*/

/*	Init variables	*/

/*	Custom search engine	*/
chrome.omnibox.onInputStarted.addListener(function(){
	console.log("Now you are searching");
});

chrome.omnibox.onInputChanged.addListener(function(text, suggest){

	/*	Event triggered when the omnibox change	*/
	console.log("You changed the text to: "+ text);

	/*	Create a suggestion list based on text	*/
	var suggestions = new Array();
	suggestions.push( new SuggestResult("Hola", "We are working on this feature :)") );

	/*	Return the suggestion list to the UI	*/
	suggest(suggestions);

});

chrome.omnibox.onInputEntered.addListener(function(text, disposition){

	/*	Event triggered when the search is completed/executed	*/
	console.log("You finished your search: "+ text);

	/**
	/*	Choose how to display results
	/*
	/*	currentTab
	/*	newForegroundTab
	/*	newBackgroundTab
	*/
	disposition = "newForegroundTab";
});

chrome.omnibox.onInputCancelled.addListener(function(){
	console.log("You cancelled your search");
});

var SuggestResult = function(content, description){
	this.content = content;
	this.description = description;
};


/*	Extension Logic	*/
/*	Status connection, verify logged user	*/
chrome.runtime.onConnect.addListener(function(status){
	if(status.name == "status"){
		status.onMessage.addListener(function(response){

			console.log("Asking for status");

			/* Send user data */
			status.postMessage({
				'user': user,
				'recruitings': recruitingsList,
				'viewAllRecruitings': viewAllRecruitings,
				'error': error
			});

			console.log("Returning user and recruitingsList data");
			console.log(user);
			console.log(recruitingsList);
		});
	}
});

/*	Login conection, Logs in the user	*/
chrome.runtime.onConnect.addListener(function(login){
	if(login.name == "login"){
		login.onMessage.addListener(function(response){

			/*	Save user data	*/
			if(response.user){
				user = response.user;
			}

			/*	Create a new location	*/
			if(response.createLocation){
				$.ajax({
					method : 'POST',
					url : conf.apiURL() +'createLocation',
					dataType : 'json',
					data : JSON.stringify({'name': response.user.location}),
					success: function(response2){
						connectionRestored();
					},
					error: function(connection, text, error){
						var temp = {
							"connection": connection,
							"text": text,
							"error": error
						}
						connectionError(temp);
					}
				});
			}

			getNews();
		});
	}
});

/*	Logout conection, Logs out the user	*/
chrome.runtime.onConnect.addListener(function(logout){
	if(logout.name == "logout"){
		logout.onMessage.addListener(function(response){
			user = response.user;
			changeIcon(0);
		});
	}
});

/* Create conection, creates a new Recruiting */
chrome.runtime.onConnect.addListener(function(create){
	if(create.name == "create"){

		create.onMessage.addListener(function(response){

			console.log("Creating new recruiting");
			console.log(response.create);

			$.ajax({
				method : 'POST',
				url : conf.apiURL() +'createRecruiting',
				dataType : 'json',
				data : JSON.stringify( response.create ),
				success : function(response2) {
					connectionRestored();

					console.log("Getting the recruitingsList from BackgroundJS");
					console.log(response2.recruitings);

					parseRecruitingsList(response2.recruitings);

					console.log("recruitingsList parsed");
					console.log(recruitingsList);

					create.postMessage({
						"recruitings": recruitingsList
					});

				},
				error: function(connection, text, error){
					var temp = {
						"connection": connection,
						"text": text,
						"error": error
					}
					connectionError(temp);
				}
			});

			/*	Stores the new recruiting on the list	*/
			recruitingsList.push(response.create);

			console.log("Added to BackgroundJS recruitingsList");
			console.log(recruitingsList);

			/*	Send data to Extension UI	*/
			var recruitings = chrome.runtime.connect({name: "recruitings"});
			recruitings.postMessage({
				'recruitings': recruitingsList
			});

			console.log("Returning recruitingsList to UI");
			console.log(recruitingsList);
		});
	}
});

/*	Update recruiting, updates a recruiting	*/
chrome.runtime.onConnect.addListener(function(updateRecruiting){
	if(updateRecruiting.name == "updateRecruiting"){
		updateRecruiting.onMessage.addListener(function(response){

			console.log("Updating the recruiting with ID "+ response.recruiting.id);

			if(response.recruiting.players.indexOf( user.name ) >= 0){
				waiting = true;
			}
			else{
				waiting = false;
			}
			response.recruiting.players = response.recruiting.players.toString();

			var data = {
				"id": response.recruiting.id,
				"description": response.recruiting.description,
				"location": response.recruiting.location,
				"maxPlayers": response.recruiting.maxPlayers,
				"players": response.recruiting.players,
				"cancelled": response.recruiting.cancelled ? response.recruiting.cancelled : false
			};

			$.ajax({
				type : 'post',
				url : conf.apiURL() +'updateRecruiting',
				dataType : 'json',
				data : JSON.stringify(data),
				success : function(response) {
					connectionRestored();

					if(response.recruitings){
						parseRecruitingsList(response.recruitings);

						/* Create updateRecruitings connection	*/
						var updateRecruitings = chrome.runtime.connect({name: "updateRecruitings"});

						updateRecruiting.postMessage({
							"recruitings": recruitingsList
						});
					}
				},
				error: function(connection, text, error){
					var temp = {
						"connection": connection,
						"text": text,
						"error": error
					}
					connectionError(temp);
				}
			});
		});
	}
});

/*	setViewAllRecruitings connection, change the user preference	*/
chrome.runtime.onConnect.addListener(function(setViewAllRecruitings){
	if(setViewAllRecruitings.name == "setViewAllRecruitings"){
		setViewAllRecruitings.onMessage.addListener(function(response){

			console.log("Changing user preference. setViewAllRecruitings="+ response.viewAllRecruitings);
			viewAllRecruitings = response.viewAllRecruitings;
		});
	}
});

/*	Creates a new Notification	*/
var showNotification = function(text, notify){
	if(notify){
		var options = {
			"body": text,
			"icon": "icons/favicon.png",
			"vibrate": [200, 100, 200]
		}
		var notif = new Notification("DevSpark DoorBell", options);
		setTimeout(function(){
			notif.close();
		}, 5000);
	}
};

function connectionError(param){
	if(error == false){
		var num = parseInt( Math.random() * 1000000 );
		showNotification("Connection error", "There was a connection error. Please, wait a few minutes while we try to solve the problem.", num);
	}
	error = param;

	/* Create connError connection	*/
	var connError = chrome.runtime.connect({name: "connError"});

	/*	Send the error	*/
	connError.postMessage({
		'error': error
	});
}

function connectionRestored(){
	if(error != false){
		var num = parseInt( Math.random() * 1000000 );
		showNotification("Connection restored", "Good news, the connection was restored!", num);
	}
	error = false;

	/* Create connError connection	*/
	var connError = chrome.runtime.connect({name: "connError"});

	/*	Send the error	*/
	connError.postMessage({
		'error': error
	});
}
