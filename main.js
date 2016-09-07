PlayersList = new Mongo.Collection('players');
var dictionary = {10:20, 30:40, 50:60, 70:80, 90:100, 15:5, 35:25, 55:45, 75:65, 95:85};

if(Meteor.isClient){
	Template.leaderboard.helpers({
		'player': function(){//Used to insert players into table
			return PlayersList.find();
		},
		'selectedClass': function(){
			var playerId = this._id;
    		var selectedPlayer = Session.get('selectedPlayer');
    		if(playerId == selectedPlayer){
        		return "selected";
    		}
		},
		'numOfPlayers': function(){
			for(i = 0; i < PlayersList.find().count(); i++){
				if(PlayersList.find().fetch()[i].score >= 100){
					return false;
				}
			}
			return PlayersList.find().count() == 4;
		},
		'numOfPlayers2': function(){
			return PlayersList.find().count() < 4;
		},
		'numOfPlayers3': function(){
			for(i = 0; i < PlayersList.find().count(); i++){
				if(PlayersList.find().fetch()[i].score >= 100){
					return false;
				}
			}
			return PlayersList.find().count() <= 4 && PlayersList.find().count() > 0;
		},
		'gameOver': function(){
			for(i = 0; i < 4; i++){
				if(PlayersList.find().fetch()[i].score >= 100){
					return true;
				}
			}
			return false;
		}
	});
	Template.leaderboard.events({
		'click .player': function(){//Used to select which player
			var playerId = this._id;
    		Session.set('selectedPlayer', playerId);
		},
		'click .increment':function(){
			var selectedPlayer = Session.get('selectedPlayer');
    		PlayersList.update({ _id: selectedPlayer }, { $inc: {score: Math.floor(Math.random() * 6) + 1 } });
    		if(PlayersList.find({_id: selectedPlayer}).fetch()[0].score > 100){
    			PlayersList.update({_id: selectedPlayer}, { $set: {score: 100} });
    		}
    		for(i = 0; i < 10; i++){
    			if(PlayersList.find({_id: selectedPlayer}).fetch()[0].score in dictionary){
    				PlayersList.update({_id: selectedPlayer}, { $set: {score: dictionary[PlayersList.find({_id: selectedPlayer}).fetch()[0].score]} });
    			}
    		}

			for(i = 0; i < 4; i++){
				var currId = PlayersList.find().fetch()[i]._id;
				if(selectedPlayer != currId && PlayersList.find({_id: selectedPlayer}).fetch()[0].score == PlayersList.find({_id: currId}).fetch()[0].score){
					PlayersList.update({_id: selectedPlayer}, { $set: {score: 0} });
				}
			}
			for(i = 0; i < 4; i++){
				var currId = PlayersList.find().fetch()[i]._id;
				if(selectedPlayer == currId && i <= 2){
					Session.set('selectedPlayer',PlayersList.find().fetch()[i+1]._id);
					break;
				}else if(selectedPlayer == currId && i == 3){
					Session.set('selectedPlayer',PlayersList.find().fetch()[0]._id);
					break;
				}
			}
		},
		'submit form': function(event){
			event.preventDefault();
			var playerNameVar = event.target.playerName.value;
			PlayersList.insert({
        		name: playerNameVar,
        		score: 0
    		});
    		if(PlayersList.find().count()==1){
    			Session.set('selectedPlayer', PlayersList.find().fetch()[0]._id);
    		}
    		event.target.playerName.value = "";
		},
		'click .remove': function(){
			var selectedPlayer = Session.get('selectedPlayer');
    		PlayersList.remove({ _id: selectedPlayer });
		},
		'click .gameover': function(){
			for(i = 0; i < 4; i++){
				PlayersList.remove({_id: PlayersList.find().fetch()[0]._id});
			}
		}
	});
}