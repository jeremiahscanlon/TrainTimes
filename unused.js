function startTime() {

    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    var currentTime = h + ":" + m + ":" + s;
 	
    $('#time').html(currentTime);

    var t = setTimeout(startTime, 500);

}	

// make sure all of the hours
function checkTime(i) {
    if (i < 10) {
    	i = "0" + i
    };  // add zero in front of numbers < 10
    return i;
}