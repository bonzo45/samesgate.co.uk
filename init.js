var sidebar_open = false;

function init() {
  initSideBar();
  initCountdowns();
  initUsefulThings();
  initDayNight();
}

function toggleSidebar() {
  if (sidebar_open) {    
    $("#sidebar").addClass("sidebar_closed");
    $("#sidebar").removeClass("sidebar_open");
  }
  else {
    $("#sidebar").addClass("sidebar_open");
    $("#sidebar").removeClass("sidebar_closed");
  }
  
  sidebar_open = ! sidebar_open;
}

function initSideBar() {
  $("#tab").click(toggleSidebar);
}

function initCountdowns() {
  $("#got").mouseover(function(){
    $("#got_cover").addClass("countdown_hide");
    $("#got_cover").removeClass("countdown_show");
  });

  $("#got").mouseout(function(){
    $("#got_cover").addClass("countdown_show");
    $("#got_cover").removeClass("countdown_hide");
  });

  $("#got_days").empty();
  $("#got_days").append(days_until(next_game_of_thrones()));

  $("#f1").mouseover(function(){
    $("#f1_cover").addClass("countdown_hide");
    $("#f1_cover").removeClass("countdown_show");
  });

  $("#f1").mouseout(function(){
    $("#f1_cover").addClass("countdown_show");
    $("#f1_cover").removeClass("countdown_hide");
  });

  $("#f1_days").empty();
  $("#f1_days").append(days_until(next_f1()));

  $("#project").mouseover(function(){
    $("#project_cover").addClass("countdown_hide");
    $("#project_cover").removeClass("countdown_show");
  });

  $("#project").mouseout(function(){
    $("#project_cover").addClass("countdown_show");
    $("#project_cover").removeClass("countdown_hide");
  });

  $("#project_days").empty();
  $("#project_days").append(days_until(project_due()));
}

var days_until = function(then) {
  if (then == null) {
    return "\u2639";
  }
  var now = new Date();
  var diff_ms = then - now;
  var diff_days = diff_ms / (1000 * 60 * 60 * 24);
  return pad(Math.floor(diff_days));
}

var pad = function(number) {
  var string = "" + number;
  if (string.length == 1) {
    return "0" + string;
  }
  
  return string;
}

var next_game_of_thrones = function() {
  var next_date = new Date("04/12/2015 21:00");
  var today = new Date();
  
  // Go through each of the episodes.
  for (var i = 2; i <= 11; i++) {
    if (today < next_date) {
      return next_date;
    }
    
    // Each episode is 7 days later
    next_date.setDate(next_date.getDate() + 7);
    // The eighth episode is delayed an extra week.
    if (i == 8) {
      next_date.setDate(next_date.getDate() + 7);
    }
  }  
  return null;
}

var next_f1 = function() {
  var f1_races = new Array();
  f1_races[0] = new Date("03/15/2015");
  f1_races[1] = new Date("03/29/2015");
  f1_races[2] = new Date("04/12/2015");
  f1_races[3] = new Date("04/19/2015");
  f1_races[4] = new Date("05/10/2015");
  f1_races[5] = new Date("05/24/2015");
  f1_races[6] = new Date("06/07/2015");
  f1_races[7] = new Date("06/21/2015");
  f1_races[8] = new Date("07/05/2015");
  f1_races[9] = new Date("07/19/2015");
  f1_races[10] = new Date("07/26/2015");
  f1_races[11] = new Date("08/23/2015");
  f1_races[12] = new Date("09/06/2015");
  f1_races[13] = new Date("09/20/2015");
  f1_races[14] = new Date("09/27/2015");
  f1_races[15] = new Date("10/11/2015");
  f1_races[16] = new Date("10/25/2015");
  f1_races[17] = new Date("11/01/2015");
  f1_races[18] = new Date("11/15/2015");
  f1_races[19] = new Date("11/29/2015");
  
  var today = new Date();
  
  for (var i = 0; i < f1_races.length; i++) {
    if (today < f1_races[i]) {
      return f1_races[i];
    }
  }
  
  return null;
}

var project_due = function() {
  return new Date("06/16/2015");
}

function initUsefulThings() {
  /* Go through each section */
  $.each(usefulThings, function(category, entries) {
    var div = $("#bonzos_useful_things");
    var separator = "<div class=\"separator\"></div>";
    div.append(separator);

    /* Go through each entry */
    $.each(entries, function() {
      var div = $("#bonzos_useful_things");
      var image = "<img src=\"image/icon/" + this.icon + "\" class=\"useful_icon\"></a>";
      var link = "<a href=\"" + this.url + "\">" + image + "</a>";
      div.append(link);

      var separator = "<div class=\"separator\"></div>";
      div.append(separator);
    });
  });
}

var usefulThings = {
  social: [
  {
    icon: "facebook.png",
    url: "http://www.facebook.com/bonzo45"
  },
  {
    icon: "twitter.png",
    url: "http://www.twitter.com/bonzo450"
  },
  {
    icon: "g+.png",
    url: "https://plus.google.com/u/0/+SamEsgate/"
  },
  {
    icon: "youtube.png",
    url: "http://www.youtube.com/user/Bonzo450/videos"
  }
  ],

  misc: [
  {
    icon: "bbc.png",
    url: "http://www.bbc.co.uk/news"
  },
  {
    icon: "netflix.png",
    url: "http://www.netflix.com"
  },
  {
    icon: "colour_picker.png",
    url: "http://www.w3schools.com/tags/ref_colorpicker.asp"
  }
  ],
  college: [
  {
    icon: "cate.png",
    url: "https://cate.doc.ic.ac.uk"
  },
  {
    icon: "gitlab.png",
    url: "https://gitlab.doc.ic.ac.uk/"
  }
  ]
}

// How dark is midnight?
var maxOpacity = 0.7;
// What time is it now? (midnight)
var currentTime = new Date(0);
// How many degrees are the sun/moon rotated by now? (moon at top)
var currentRotation = 0;
// Keyframes for animating opacity.
var opacityKeyframes = [];

function initDayNight() {
  setTime(new Date(0));
}

function setTime(newTime) {
  // If the time is the same as the current one, do nothing.
  if (newTime.getTime() === currentTime.getTime()) {
    return;
  }

  // New time could be years away. For animation's sake clip it to be within 48 hours of current time.
  var clippedTime = clipTime(currentTime, newTime);

  var transitionTime = computeTransitionTime(clippedTime - currentTime);
  setDarkness(currentTime, clippedTime, transitionTime);
  setSunMoonRotation(currentTime, clippedTime, transitionTime);

  currentTime = newTime;

  // // Calculate how many hours away from midday we are. (-ve before, +ve after)
  // var difference = hoursFromMidday(time);

  // // Update Display
  // var stringHours = padOneZero(time.getHours() + '');
  // var stringMinutes = padOneZero(time.getMinutes() + '');
  // $("#input_hours").val(stringHours);
  // $("#input_minutes").val(stringMinutes);

  // // Calculate how long until next keyframe (either midday or midnight).
  // var keyframe2 = (difference < 0) ? ((-difference / 24) * 100) : 50 - ((difference / 24) * 100);
  // var opacity2 = (difference < 0) ? 0 : maxOpacity; 


  // // Calculate how long until the next keyframe (the other one).
  // var keyframe3 = keyframe2 + 50;
  // var opacity3 = (difference < 0) ? maxOpacity : 0;
}

/**
  * Returns a 'clipped' version secondTime that is within 48 hours of firstTime, but with the same time.
  *   i.e. returns a version with the same time as secondTime but with a potentially new date.
  */
function clipTime(firstTime, secondTime) {
  var twentyFourHours = new Date(1970, 0, 2, 0, 0, 0, 0); // (y, m, d, h, m, s, ms) 
  var fortyEightHours = new Date(1970, 0, 3, 0, 0, 0, 0);
  var difference = new Date((firstTime < secondTime) ? secondTime - firstTime : firstTime - secondTime);

  // If the difference is less than or equal to 48 hours then return secondTime.
  if (difference <= fortyEightHours) {
    return secondTime;
  }
  // Otherwise mod the difference by 24 hours and add/subtract that to firstTime.
  else {
    var clippedDifference = new Date(difference.getTime() % twentyFourHours.getTime());
    return new Date((firstTime < secondTime) 
      ? fortyEightHours.getTime() + firstTime.getTime() + clippedDifference.getTime()
      : fortyEightHours.getTime() + (firstTime - clippedDifference));
  }
}

/**
  * Works out how long the animation of changing time should take, given the time difference.
  */
function computeTransitionTime(difference) {
  // Default transition is three seconds.
  // TODO: Make larger jumps in time take longer?
  return 3;
}

function setDarkness(currentTime, nextTime, transitionTime) {
  // Light-Dark Cycle.
  // Calculate how light it should be.
  var targetOpacity = timeToOpacity(nextTime);
  console.log("Time: " + nextTime + ", Opacity: " + targetOpacity);

  // Direction is 1 if the next time is in the future, -1 if in the past.
  var direction = (currentTime < nextTime) ? 1 : -1;

  // Work from the current time, to the next time, working out darkness 'keyframes'.
  var totalTimeToGo = Math.abs(nextTime - currentTime);
  var timeToGo = Math.abs(nextTime - currentTime);
  var tempTime = new Date(currentTime.getTime());
  while (timeToGo > 0) {
    // See how long until the next midday/midnight.
    timeToNextMiddaynight = timeToMiddaynight(tempTime, direction);
    // If our time to go is less than this we have reached the last 'keyframe'.
    if (timeToGo <= timeToNextMiddaynight) {
      opacityKeyframes.push({
        "opacity": targetOpacity,
        "time": (timeToGo / totalTimeToGo) * transitionTime
      });
      timeToGo = 0;
    }
    // If not then this midday/midnight is our next keyframe, then we continue.
    else {
      timeToGo -= timeToNextMiddaynight;
      tempTime = new Date(tempTime.getTime() + (direction * timeToNextMiddaynight));
      opacityKeyframes.push({
        "opacity": tempTime.getHours() == 12 ? 0.0 : maxOpacity,
        "time": (timeToNextMiddaynight / totalTimeToGo) * transitionTime
      });
    }
  }
  console.log(opacityKeyframes);
  opacityKeyframes = [];
}

function setSunMoonRotation(currentTime, nextTime, transitionTime) {
  // Rotation of Sun/Moon.
  // Calculate where the sun/moon are now.
  var rotation = timeToRotation(currentTime, nextTime);
  currentRotation += rotation;
  console.log("Time: " + nextTime + ", Rotation: " + rotation);
  $("#sky_background_sun_moon_rotating").css("transition", "all " + transitionTime + "s");
  $("#sky_background_sun_moon_rotating").css("transform", "rotate(" + currentRotation + "deg)");
}

/**
  * Given the time returns the opacity for the darkness filters. High opacity means darker, low opacity means lighter.
  */
function timeToOpacity(time) {
  return (Math.abs(hoursFromMidday(time)) / 12) * maxOpacity;
}

/**
  * Returns the number of hours (going forwards if direction is +ve, going backwards if direction is -ve) to the nearest midday or midnight.
  */
function timeToMiddaynight(time, direction) {
  var twelveHours = 12 * 60 * 60 * 1000;
  var differenceMidday = timeFromMidday(time);
  // If it's before (or exactly) midday and we're going backwards.
  if (differenceMidday <= 0 && direction < 0) {
    return twelveHours + differenceMidday;
  }
  // If it's before midday and we're going forwards.
  else if (differenceMidday < 0 && direction > 0) {
    return -differenceMidday;
  }
  // If it's after midday and we're going backwards.
  else if (differenceMidday > 0 && direction < 0) {
    return differenceMidday;
  }
  // If it's after (or exactly) midday and we're going forwards.
  else if (differenceMidday >= 0 && direction > 0) {
    return twelveHours - differenceMidday;
  }
  // Error case.
  console.log("timeToMiddaynight cannot deal with the following parameters:");
  console.log("time: " + time + ", direction: " + direction);
  return -10000;
}

/**
  * Returns the number of degrees required to get from one time to another.
  */
function timeToRotation(time1, time2) {
  var maxRotation = 360;
  var difference = time2 - time1;
  return (difference / (24 * 60 * 60 * 1000)) * maxRotation;
}

/**
  * Returns the number of hours between the given time and midday.
  * - Negative if before midday.
  * - Positive if past midday.
  * e.g. 10:30 returns -1.5.
  */
function hoursFromMidday(time) {
  // // 60 second version (for debugging)
  // var seconds = time.getSeconds(); // 0 to 59
  // return ((seconds - 30) / 30) * 12;

  // 24 hour version (for release)
  return ((timeFromMidday(time) / 1000) / 60) / 60;
}

/**
  * Returns the time (in milliseconds) between the given time and midday.
  * - Negative if before midday.
  * - Positive if past midday.
  */
function timeFromMidday(time) {
  var justTime = new Date(0, 0, 0, time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
  var midday = new Date(0, 0, 0, 12, 0, 0, 0);
  return justTime  - midday;
}

/**
  * Given a number represented as a string, returns a version with at least two characters.
  */
function padOneZero(numberString) {
  while (numberString.length < 2) {
    numberString = '0' + numberString;
  }
  return numberString;
}