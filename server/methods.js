Meteor.methods({

	addToGame: function(gameToken, userId){
		Games.update({"gameToken" : gameToken}, {$addToSet:{players : userId}});
	},

	startGame: function(gameToken){
		Games.update({"gameToken" : gameToken}, {$set:{started : true}});
		createKingdom(gameToken);
	},

	nextYear: function(gameToken, player, acres, feed, seed){

		Kingdoms.update({
			"gameToken": gameToken,
			 "monarch": player
			},
			{ $set: {
				nextAcres : acres,
				nextFeed : feed,
				nextSeed : seed
			}
		});
	}

});

function createKingdom(gameToken){

	var players = Games.findOne({"gameToken": gameToken}).players;
	var price = _.random(1,10) + 16;

	players.forEach(function (player) {
		
		Kingdoms.insert({
			"gameToken" : gameToken,
			monarch : player,
			advice : "Everyone dies",
			year : 1,
			starved : 0,
			newcomers : 5,
			population : 100,
			acres : 1000,
			bushels : 2800,
			harvest : 3,
			rats : 200,
			price : price,
			nextAcres : 0,
			nextFeed : 0,
			nextSeed : 0,
			totalStarved: 0
		});

		console.log("kingdom created for " + player);
	
	});
};