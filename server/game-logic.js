createKingdom = function(gameToken){

	var players = Games.findOne({"gameToken": gameToken}).players;
	var price = _.random(1,10) + 16;

	players.forEach(function (player) {
		
		Kingdoms.insert({
			"turnMade" : "Not yet",
			"gameToken" : gameToken,
			monarch : player,
			advice : "My Lord, what is your command?",
			year : 1,
			starved : 0,
			newcomers : 5,
			population : 100,
			acres : 1000,
			bushels : 2800,
			harvest : 3,
			rats : 200,
			price : price,
			solidersPrice : price * 3,
			nextAcres : 0,
			nextFeed : 0,
			nextSeed : 0,
			nextSoliders: 0,
			totalStarved: 0,
			soliders: 10
		});

		console.log("kingdom created for " + player);
	
	});
};


function plague() {
	var plagueOccurs;
	if (_.random(100) <= 15) {
		plagueOccurs = true;
	} else {
		plagueOccurs = false;
	}
	return plagueOccurs;
}

/* Returns 40% of the time the boolean value true
   and 60% of the time the boolean value false. */

function ratsProblem() {
	var ratsProblemOccurs;
	if (_.random(10) <= 4) {
		ratsProblemOccurs = true;
	} else {
		ratsProblemOccurs = false;
	}
	return ratsProblemOccurs;
}

/* If there is a problem with rats, they eat 1/10, 2/10 or
   3/10 of the bushels. Otherwise they eat none. */

function bushelsEatenByRats(bushels) {
	var bushelsEaten;
	if (ratsProblem()) {
		bushelsEaten = Math.floor((_.random(3) / 10) * bushels);
	} else {
		bushelsEaten = 0;
	}
	return bushelsEaten; 
}

/* Returns a random number between 1 and 8. */

function harvestPerAcre() {
	var harvest = _.random(8);
	return harvest;
}

/* Calculates how many people starved, depending on
   the number of bushels which were used to feed
   people. */

function calculateStarvedPeople(population, feed) {
	var numberPeopleStarved = (population - feed/ 20);
	if (numberPeopleStarved <= 0) {
		return 0;
	} else {
		return numberPeopleStarved;
	}
}

/* Calculates the number of newcomers, depending on
   the internal number of acres, internal number of
   bushels and the size of the population. 
   Formula:
   (20 * number of acres you have + amount of grain you have in storage) / (100 * population) + 1*/

function calculateNewcomers(acres, bushels, population) {
	return Math.floor((20 * acres + bushels) / (100 * population) + 1);
}

/* The function returns true if more than 45% of the
   original population starved. Otherwise it returns
   false. */

function tooManyPeopleStarved(population, starved, newcomers) {
	var originalPopulation = population + starved - newcomers;
	if (Math.floor((starved / originalPopulation) * 100) > 45) {
		return true;
	} else {
		return false;
	}
}

/* If the maximum number of turns is not fulfilled yet and
   not too many people starved, the new game state is being
   calculated and outputted.
   If too many people starved the user is being informed
   that he is kicked out of office.
   Otherwise the end-page is shown which informs the user
   about his performance. */

nextYear = function(gameToken){

	var players = Games.findOne({"gameToken": gameToken}).players;



	var price = _.random(1,10) + 16;

	players.forEach(function (player) {

		var latestAdvice = "";

		var commands = Kingdoms.findOne({
			"gameToken" : gameToken,
			monarch : player,
		});

		
		var starved = calculateStarvedPeople(commands.population, commands.nextFeed);
		var totalStarved = commands.totalStarved + starved;
		var newcomers = calculateNewcomers(commands.acres, commands.bushels, commands.population);
		var harvest = harvestPerAcre();
		var bushels = commands.bushels + harvest * commands.nextSeed;
		var rats = bushelsEatenByRats(commands.bushels);
		var bushels = bushels - rats;
		var acres = commands.acres + commands.nextAcres;
		var bushels = bushels - (commands.nextAcres * commands.price) - (commands.nextSoliders * commands.solidersPrice) 
		var	population = Math.floor(commands.population - starved + newcomers);
		var	soliders = commands.nextSoliders + commands.soliders;

		if (plague()) {
			latestAdvice = "A horrible plague occured! Half of our population died. ";
			population = Math.floor(commands.population / 2);
		};

		latestAdvice += "My lord, I beg to inform you: we've harvested " + (harvest * commands.nextSeed) + " bushels. " + starved + " of the population starved. The rats ate " + rats + " bushels from our stockpile.";

		Kingdoms.update({_id : commands._id},{
			$set:{
				"turnMade" : "Not yet",
				"advice" : latestAdvice,
				"year" : commands.year + 1,
				"starved" : starved,
				"newcomers" : newcomers,
				"population" : population,
				"acres" : acres,
				"bushels" : bushels,
				"harvest" : harvest,
				"rats" : 200,
				"price" : price,
				"solidersPrice" : price * 3,
				"nextAcres" : 0,
				"nextFeed" : 0,
				"nextSeed" : 0,
				"nextSoliders" : 0,
				"totalStarved": totalStarved,
				"soliders" : soliders
		}});

		console.log("kingdom updated for " + player);

	});
};
