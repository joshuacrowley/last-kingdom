  Template.game.helpers({
    playerCount: function () {
      var playerCount = Games.findOne({"gameToken" : Meteor.user().profile.currentGame}).players.length;
      if (playerCount === 1){
        return "1 player";
      }else{
        return playerCount + " players";
      }
    },
    validPlayer : function(){
      var valid = Games.findOne({
        gameToken: Meteor.user().profile.currentGame,
        players : Meteor.userId()
      });

      if (valid.length !== null ) {
        return true;
      };

    },
    gameStarted : function(){
      return Games.findOne({"gameToken" : Meteor.user().profile.currentGame}).started;
    }


  });

  Template.game.events({
    'click button#startGame': function () {
      Meteor.call("startGame", Meteor.user().profile.currentGame);
    },
    'click button#joinGame': function () {
      Meteor.call("addToGame", Meteor.user().profile.currentGame, Meteor.userId());
    }
  });


  Template.createGame.events({
    'click button': function () {

      var gameToken = Random.id();

      Games.insert({
          "gameToken": gameToken,
          "started": false,
          "players" : []
      });

      Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.currentGame": gameToken}});
      Meteor.call("addToGame", gameToken, Meteor.userId());
      Router.go('games', {_id: gameToken});
    }
  });