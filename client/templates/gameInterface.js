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
    },
    budget: function(){
    	return	Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        }).bushels - Session.get("bushelsToFeed") - Session.get("seedOrder") - Session.get("acresOrder") - Session.get("solidersTrain");
    }
});

Template.scoreboard.helpers({
    board: function(){

    	var scoreboard = []
        var monarchName;

    	var players = Games.findOne({
			gameToken: Meteor.user().profile.currentGame,
    	}).players;

    	players.forEach(function (player) {

    	var king = Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : player
        });

        if (king.monarch === Meteor.userId()){
            monarchName = "You";
        } else {
            monarchName = king.monarch;
        }

        var score = {monarch : monarchName, population : king.population, turnMade : king.turnMade}

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
		var war = event.target.war.value;

		var totalBushels = bushelsToFeed + seedOrder + (acresOrder * prices.price) + (solidersTrain * prices.solidersPrice);

		var kingdom = Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        });

		if (totalBushels <= kingdom.bushels){

			Meteor.call("nextCommands", Meteor.user().profile.currentGame, Meteor.userId(), acresOrder, bushelsToFeed, seedOrder, solidersTrain);
			Session.set("bushelsToFeed", 0);

		}else{
			alert("But my lord, we don't have enough bushels!");
		}
		
	},

	'input #bushelsToFeed':function (event, template){
		var bushelsToFeed = parseInt(event.currentTarget.value,10);
		Session.set("bushelsToFeed", bushelsToFeed);
	},
	'input #seedOrder':function (event, template){
		var seedOrder = parseInt(event.currentTarget.value,10);
		Session.set("seedOrder", seedOrder);
	},
	'input #acresOrder':function (event, template){
		var prices = Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        });
		var acresOrder = parseInt(event.currentTarget.value,10);
		var acresOrder = acresOrder * prices.price;
		Session.set("acresOrder", acresOrder);
	},	
	'input #solidersTrain':function (event, template){
		var prices = Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        });
		var solidersTrain = parseInt(event.currentTarget.value,10);
		var solidersTrain = solidersTrain * prices.solidersPrice;
		Session.set("solidersTrain", solidersTrain);
	},


});