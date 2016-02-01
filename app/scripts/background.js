/*	App start	*/

/*	Init variables	*/

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
