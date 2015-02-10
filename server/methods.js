Meteor.methods({

	addToGame: function(gameToken, userId){
		Games.update({"gameToken" : gameToken}, {$addToSet:{players : userId}});
	},

	startGame: function(gameToken){
		Games.update({"gameToken" : gameToken}, {$set:{started : true}});
		createKingdom(gameToken);
	},

	nextCommands: function(gameToken, player, acres, feed, seed, soliders){

		Kingdoms.update({
			"gameToken": gameToken,
			 "monarch": player
			},
			{ $set: {
				nextAcres : acres,
				nextFeed : feed,
				nextSeed : seed,
				nextSoliders : soliders
			}
		});

		nextYear(gameToken);
	}

});
