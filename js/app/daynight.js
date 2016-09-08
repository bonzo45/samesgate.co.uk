define(["jquery", "app/daynightutil", "app/constant"], function($, Util, Const) {

  // How dark is midnight?
  var maxOpacity = 0.7;
  // What time is it now? (
  var currentTime = Util.mostRecentMidnight(new Date());
  // How many degrees are the sun/moon rotated by now? (moon at top)
  var currentRotation = 0;

  /**
    * Changes the time of day.
    */
  function setTime(newTime) {
    // If the time is the same as the current one, do nothing.
    if (newTime.getTime() == currentTime.getTime()) {
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
      timeToNextMiddaynight = Util.timeToMiddayNight(tempTime, direction);
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
    $("#sky_background_sun_moon_rotating").css("transition", "all " + transitionTime + "s");
    $("#sky_background_sun_moon_rotating").css("transform", "rotate(" + currentRotation + "deg)");
  }

  /**
    * Given the time returns the opacity for the darkness filters. High opacity means darker, low opacity means lighter.
    */
  function timeToOpacity(time) {
    return (Math.abs(Util.hoursFromMidday(time)) / 12) * maxOpacity;
  }

  /**
    * Returns the number of degrees required to get from one time to another.
    */
  function timeToRotation(time1, time2) {
    var difference = time2.getTime() - time1.getTime();
    return (difference / Const.DAY_MS) * 360;
  }

  /**
    * Sets the watch to the time given.
    */
  function setWatch(time) {
    $("#watch_time").html(Util.padTwoChars(time.getHours() + "") + ":" + Util.padTwoChars(time.getMinutes() + ""));
    $("#watch_date").html(Util.padTwoChars(time.getDate()));
    $("#watch_indicator").css("transform", "rotate(" + timeToIndicatorAngle(time) + "deg)");
  }

  /**
    * Sets just the watch indicator to the angle given.
    */
  function setWatchIndicator(angle) {
    $("#watch_indicator").css("transform", "rotate(" + angle + "deg)");
  }

  /**
    * Computes the rotation of the indicator for a given time.
    */
  function timeToIndicatorAngle(time) {
    var msFrom12 = Util.timeToMiddayNight(time, -1);
    return (msFrom12 / (12 * Const.HOUR_MS)) * 360;
  }

  function getWatchCoordinates(e, parentOffset, watchSize) {
    // Get coordinate clicked within watch.
    var x = e.pageX - parentOffset.left;
    var y = e.pageY - parentOffset.top;
    
    // Compute coordinates of center of watch.
    var center = watchSize / 2;

    return {'x' : x - center, 'y' : y - center};
  }

  function getWatchDistance(coordinates, watchSize) {
    var distanceFromCenter = Math.pow(Math.pow(coordinates.x, 2) + Math.pow(coordinates.y, 2), 0.5);
    return distanceFromCenter / watchSize;
  }

  return {
    init: function() {
      $("#watch_time_minus").click(function() {
        var timeBefore = new Date(currentTime.getTime() - Const.HOUR_MS);
        setTime(timeBefore);
      });

      $("#watch_time_plus").click(function() {
        var timeAfter = new Date(currentTime.getTime() + Const.HOUR_MS);
        setTime(timeAfter);
      });

      $("#watch").mousedown(function(e) {
        var parentOffset = $(this).offset();
        var watchSize = $(this).width();
        var coordinates = getWatchCoordinates(e, parentOffset, watchSize);
        var normalisedDistance = getWatchDistance(coordinates, watchSize);
        if (0.325 < normalisedDistance) {
          $(this).mousemove(function(e) {        
            var parentOffset = $(this).offset();
            var watchSize = $(this).width();
            var coordinates = getWatchCoordinates(e, parentOffset, watchSize);
            //  Compute angle to rotate indicator.
            var angle = 90 + ((180 / Math.PI) * Math.atan2((coordinates.y), (coordinates.x)));
            setWatchIndicator(angle);
          });
        }
      }).mouseup(function(e) {
        var parentOffset = $(this).offset();
        var watchSize = $(this).width();
        var coordinates = getWatchCoordinates(e, parentOffset, watchSize);
        var normalisedDistance = getWatchDistance(coordinates, watchSize);
        if (0.325 < normalisedDistance) {
          //  Compute angle to rotate indicator.
          var angle = 90 + ((180 / Math.PI) * Math.atan2((coordinates.y), (coordinates.x)));
          var angleDifference = Util.difference180(angle, timeToIndicatorAngle(currentTime));
          var angleHours = 12 * (angleDifference / 360);
          var timeDifference = new Date(angleHours * Const.HOUR_MS);
          setTime(new Date(currentTime.getTime() + timeDifference.getTime()));
        }
        $(this).unbind('mousemove');
      });

      setTime(new Date());
    }
  }
})