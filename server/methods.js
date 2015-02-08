Meteor.methods({

	addToGame: function(gameToken, userId){
		Games.update({"gameToken" : gameToken}, {$addToSet:{players : userId}});
	},

	startGame: function(gameToken){
		Games.update({"gameToken" : gameToken}, {$set:{started : true}});
		createKingdom(gameToken);
	}

});