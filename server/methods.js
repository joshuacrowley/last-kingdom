Meteor.methods({

	addToGame: function(gameToken, userId){
		Games.update({"gameToken" : gameToken}, {$addToSet:{players : userId}});
	},

	startGame: function(gameToken){
		Games.update({"gameToken" : gameToken}, {$set:{started : true}});
		createKingdom(gameToken);
		updateGameVars(gameToken);
	},

	nextCommands: function(gameToken, player, acres, feed, seed, soliders){

		Kingdoms.update({
			"gameToken": gameToken,
			 "monarch": player
			},
			{ $set: {
				turnMade : "Yes",
				nextAcres : acres,
				nextFeed : feed,
				nextSeed : seed,
				nextSoliders : soliders
			}
		});

		var turnsMade = Kingdoms.find({"gameToken": gameToken, turnMade : {$ne: "Not yet"} }).fetch();
		var players = Games.findOne({"gameToken": gameToken}).players;

		if (players.length === turnsMade.length){
			
			console.log("Turn made");
			nextYear(gameToken);
			updateGameVars(gameToken);

		}else{
			console.log("Still waiting on other players");
		}
		
	},

});
