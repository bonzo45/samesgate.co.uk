define(["jquery"], function($) {

  // How dark is midnight?
  var maxOpacity = 0.7;
  // What time is it now? (midnight)
  var currentTime = new Date(0);
  // How many degrees are the sun/moon rotated by now? (moon at top)
  var currentRotation = 0;

  /**
    * Changes the time of day.
    */
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
    setWatch(newTime);

    currentTime = newTime;
  }

  /**
  * Given two angles between 0 and 360 degrees, returns the difference.
  * This function wraps around (i.e. result is between -180 and 180).
  */
  function difference180(newAngle, oldAngle) {
    var absoluteDifference = newAngle - oldAngle;
    if (absoluteDifference < -180) {
      return absoluteDifference + 360;
    }
    else if (absoluteDifference > 180) {
      return absoluteDifference - 360;
    }
    else {
      return absoluteDifference;
    }
  }

  /**
    * Returns a new Date within 48 hours of first, with the same time as second.
    *   i.e. brings second closer to first.
    */
  function clipTime(first, second) {
    var twentyFourHours = new Date(1970, 0, 2, 0, 0, 0, 0); // (y, m, d, h, m, s, ms) 
    var fortyEightHours = new Date(1970, 0, 3, 0, 0, 0, 0);
    var difference = new Date((first < second) ? second - first : first - second);

    // If the difference is less than or equal to 48 hours then return second.
    if (difference <= fortyEightHours) {
      return second;
    }
    // Otherwise mod the difference by 24 hours and add/subtract that to first.
    else {
      var clippedDifference = new Date(difference.getTime() % twentyFourHours.getTime());
      return new Date((first < second) 
        ? fortyEightHours.getTime() + first.getTime() + clippedDifference.getTime()
        : fortyEightHours.getTime() + (first - clippedDifference));
    }
  }

  /**
    * Works out how long the animation of changing time should take, given the time difference.
    */
  function computeTransitionTime(difference) {
    // Default transition.
    // TODO: Make larger jumps in time take longer?
    return 1.25;
  }

  /**
    * Animates darkness to new time.
    */
  function setDarkness(currentTime, nextTime, transitionTime) {
    // Light-Dark Cycle.
    // Calculate how light it should be.
    var targetOpacity = timeToOpacity(nextTime);
    console.log("Time: " + nextTime + ", Opacity: " + targetOpacity);

    // Direction is 1 if the next time is in the future, -1 if in the past.
    var direction = (currentTime < nextTime) ? 1 : -1;

    // Work from the current time, to the next time, working out darkness 'keyframes'.
    // Keyframes for animating opacity.
    var opacityKeyframes = [];
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
          "duration": (timeToGo / totalTimeToGo) * transitionTime
        });
        timeToGo = 0;
      }
      // If not then this midday/midnight is our next keyframe, then we continue.
      else {
        timeToGo -= timeToNextMiddaynight;
        tempTime = new Date(tempTime.getTime() + (direction * timeToNextMiddaynight));
        opacityKeyframes.push({
          "opacity": tempTime.getHours() == 12 ? 0.0 : maxOpacity,
          "duration": (timeToNextMiddaynight / totalTimeToGo) * transitionTime
        });
      }
    }
    console.log(opacityKeyframes);
    animateOpacity(opacityKeyframes);
  }

  /**
    * Applies opacity keyframes to all masks.
    */
  function animateOpacity(opacityKeyframes) {
    // Get next keyframe from list (and remove from list).
    var keyframe = opacityKeyframes.shift();
    
    // Get opacity and duration from keyframe.
    var opacity = keyframe.opacity;
    var duration = keyframe.duration;

    // Animate this part.
    $(".mask").css("transition", "all " + duration + "s");
    $(".mask").css("opacity", opacity);

    // See if there are any keyframes left.
    if (opacityKeyframes.length == 0) {
      return;
    }

    // Trigger callback for next keyframe.
    setTimeout(function(){animateOpacity(opacityKeyframes)}, duration * 1000);
  }

  /**
    * Animates sun/moon rotation to new time.
    */
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
    
    // If it's midnight, return 12.
    if (Math.abs(differenceMidday) == twelveHours) {
      return twelveHours;
    }
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
    * Sets the watch to the time given.
    */
  function setWatch(time) {
    $("#watch_time").html(padOneZero(time.getHours() + "") + ":" + padOneZero(time.getMinutes() + ""));
    $("#watch_date").html(padOneZero(time.getDate()));
    $("#watch_indicator").css("transform", "rotate(" + timeToIndicatorAngle(time) + "deg)");
  }

  function timeToIndicatorAngle(time) {
    var millisecondsSince12 = time.getTime() % (1000 * 60 * 60 * 12);
    return (millisecondsSince12 / (12 * 60 * 60 * 1000)) * 360;
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

  return {
    init: function() {
      setTime(new Date(0));
      setWatch(new Date(0));
      $("#watch_time_minus").click(function() {
        var timeBefore = new Date(currentTime.getTime() - 60 * 60 * 1000);
        setTime(timeBefore);
      });

      $("#watch_time_plus").click(function() {
        var timeAfter = new Date(currentTime.getTime() + 60 * 60 * 1000);
        setTime(timeAfter);
      });

      setTime(new Date(12 * 60 * 60 * 1000));

      $("#watch").click(function(e) {
        // Get coordinate clicked within watch.
        var parentOffset = $(this).offset(); 
        var x = e.pageX - parentOffset.left;
        var y = e.pageY - parentOffset.top;
        
        // Get size of watch.
        var watchSize = $(this).width();
        
        // Compute coordinates of center of watch.
        var center = watchSize / 2;

        // Rotate indicator if click is on rim.
        var distanceFromCenter = Math.pow(Math.pow(x - center, 2) + Math.pow(y - center, 2), 0.5);
        var normalisedDistance = distanceFromCenter / watchSize;
        if (0.325 < normalisedDistance && normalisedDistance < 0.42) {
          //  Compute angle to rotate indicator.
          var angle = 90 + ((180 / Math.PI) * Math.atan2((y - center), (x - center)));
          var angleDifference = difference180(angle, timeToIndicatorAngle(currentTime));
          var angleHours = 12 * (angleDifference / 360);
          var timeDifference = new Date(angleHours * 60 * 60 * 1000);
          setTime(new Date(currentTime.getTime() + timeDifference.getTime()));
        }

        console.log("Angle:" + angle + ", Distance: " + normalisedDistance);
      });
    }
  }
})