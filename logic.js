
// Capture #submit Button Click
$("#submit").on("click", function() {

	// Capture User Inputs and store into variables

	var name = $('#name').val().trim();
	var destination = $('#destination').val().trim();
	var firstTrain = $('#firstTrain').val().trim();
	var frequency = $('#frequency').val().trim();

	// send the variables through the function that writes them to the firebase
	writenewRecord(name, destination, firstTrain, frequency);

	// Don't refresh the page!
	return false;
})

// connection to firebase
var db = new Firebase("trainthymes.firebaseio.com/");

// function that pushes new trains to the database
function writenewRecord(var1, var2, var3, var4){

	db.push({
		name: var1,
		destination: var2,
		firstTrain: var3,
		frequency: var4
	});

}

// get info from the database at page load or when a new train is added
db.on("child_added", function(snapshot, prechildKey){

	// log the results for troubleshooting
	console.log(snapshot.val());

	// get the data from the database
	var name = snapshot.val().name;
	var destination = snapshot.val().destination;
	var frequency = snapshot.val().frequency;
	var firstTrain = snapshot.val().firstTrain;

	// convert the first train time to min since midnight and log result
	var firstTrainHour = moment(firstTrain, "HH:mm").format('H');
	var firstTrainMin = moment(firstTrain, "HH:mm").format('m');
	var firstTrainValue = (firstTrainHour * 60) + (firstTrainMin * 1);
	console.log('first train (min since midnight): '+firstTrainValue);
	
	// convert the current time to min since midnight and log result
	var currentTimeHour = moment().format('H');
	var currentTimeMin = moment().format('m');
	var currentTimeValue = (currentTimeHour * 60) + (currentTimeMin * 1);
	console.log('current time (min since midnight): '+currentTimeValue);

	// get the difference in min from the first train to the current time
	var timeDiff = currentTimeValue - firstTrainValue;
	
	// figure out how many trains have come in that time and log result 
	var numberOfTrains = Math.floor(timeDiff / frequency);
	console.log('Number of trains since the first train: '+numberOfTrains);

	// get the number of min since midnight for the next trains arrival
	var nextArrivalTotalMin = ((numberOfTrains + 1) * frequency) + firstTrainValue;
	
	// Check to see if it's before the arrival of the first train of the day
	if (firstTrainValue < currentTimeValue) {
		// if it is not before the first train ...
		// calculate # of min from the current time until the next train arrives
		var minAway = nextArrivalTotalMin - currentTimeValue;
		// add the result to the current time using moment.js
		var nextArrival = moment().add(minAway, 'minutes').format('HH:mm');

	} else {
		// if it is before the first train ...
		// the next train will arrive when the first train does
		var nextArrival = firstTrain;
		// the min away is the difference from now to when the first train arrives
		var minAway = firstTrainValue - currentTimeValue;
	}
	
	// add the values to the train table
	$("#trainTable").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");

});


// display the current time using moment.js
function startTime() {

    var currentTime = moment().format('HH:mm:ss');
    $('#time').html(currentTime);

    // run "startTime" on a timeout
    var t = setTimeout(startTime, 500);

}

// show the clock at page load
$(document).ready(function() {
	startTime();
});