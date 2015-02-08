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
		var bushelsToFeed = event.target.bushelsToFeed.value;
		var seedOrder = event.target.seedOrder.value;
		var acresOrder = event.target.acresOrder.value;
		Meteor.call("nextYear", Meteor.user().profile.currentGame, Meteor.userId(), acresOrder, bushelsToFeed, seedOrder);
	}
});