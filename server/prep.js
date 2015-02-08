function createKingdom(gameToken){

	var players = Games.findOne({"gameToken": gameToken}).players;

	players.forEach(function (player) {
		
		Kingdoms.insert({
			"gameToken" : gameToken,
			monarch : player,
			year : 0,
			starved : 0,
			newcomers : 0,
			population : 0,
			acres : 0,
			bushels : 0,
			harvest : 0,
			rats : 0,
			price : 0,
			internalAcres : 0,
			internalBushels : 0,
			totalStarved: 0
		});

		console.log("kingdom created for " + player);
	
	});
};