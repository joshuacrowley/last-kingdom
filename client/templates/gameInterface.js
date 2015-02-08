Template.gameInterface.helpers({
    kingdom: function () {
        return Kingdoms.findOne({
        	gameToken: Meteor.user().profile.currentGame,
        	monarch : Meteor.userId()
        });
      }
});

Template.gameInterface.events({
	'submit form': function (event, template) {
		event.preventDefault();
		var bushelsToFeed = parseInt(event.target.bushelsToFeed.value,10);
		var seedOrder = parseInt(event.target.seedOrder.value,10);
		var acresOrder = parseInt(event.target.acresOrder.value,10);
		Meteor.call("nextCommands", Meteor.user().profile.currentGame, Meteor.userId(), acresOrder, bushelsToFeed, seedOrder);
	}
});