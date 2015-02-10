Template.gameInterface.helpers({
    kingdom: function () {
        return Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        });
      },
    player: function(){
    	return Games.findOne({
			gameToken: Meteor.user().profile.currentGame,
    	}).players;
    }
});

Template.scoreboard.helpers({
    board: function(){

    	var scoreboard = []

    	var players = Games.findOne({
			gameToken: Meteor.user().profile.currentGame,
    	}).players;

    	players.forEach(function (player) {

    	var king = Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : player
        });

        var score = {monarch : king.monarch, population : king.population}

        scoreboard.push(score);

    	});

    	return scoreboard;
    }
});

Template.gameInterface.events({
	'submit form': function (event, template) {

		var prices = Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        });

		event.preventDefault();
		var bushelsToFeed = parseInt(event.target.bushelsToFeed.value,10);
		var seedOrder = parseInt(event.target.seedOrder.value,10);
		var acresOrder = parseInt(event.target.acresOrder.value,10);
		var solidersTrain = parseInt(event.target.solidersTrain.value,10);
		var totalBushels = bushelsToFeed + seedOrder + (acresOrder * prices.price) + (solidersTrain * prices.solidersPrice);

		var kingdom = Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        });

		if (totalBushels <= kingdom.bushels){

			Meteor.call("nextCommands", Meteor.user().profile.currentGame, Meteor.userId(), acresOrder, bushelsToFeed, seedOrder, solidersTrain);

		}else{
			alert("But my lord, we don't have enough bushels!");
		}
		
	}
});