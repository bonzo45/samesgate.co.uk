define(["jquery", "moment", "app/daynightutil", "app/constant"], function($, Moment, Util, Const) {

  // How dark is midnight?
  var maxOpacity = 0.7;
  // What time is it now? (
  var currentTime = Moment().startOf('day');
  // How many degrees are the sun/moon rotated by now? (moon at top)
  var currentRotation = 0;

  /**
    * Changes the time of day.
    */
  function setTime(newTime) {
    // If the time is the same as the current one, do nothing.
    if (newTime.isSame(currentTime)) {
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
    * Returns a new Moment within 48 hours of first, with the same time as second.
    *   i.e. brings second closer to first.
    */
  function clipTime(first, second) {
    var lowerLimit = Moment(first).subtract(2, 'days');
    var upperLimit = Moment(first).add(2, 'days');
    if (second.isBetween(lowerLimit, upperLimit))
      return second;

    if (second.isBefore(first))
      return Moment(second).add(Math.ceil(lowerLimit.diff(second, 'hours') / 24), 'days');

    else
      return Moment(second).remove(Math.ceil(second.diff(upperLimit, 'hours') / 24), 'days');
  }

  /**
    * Works out how long the animation of changing time should take, given the time difference.
    */
  function computeTransitionTime(duration) {
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
    var direction = (currentTime.isBefore(nextTime)) ? 1 : -1;

    // Work from the current time, to the next time, working out darkness 'keyframes'.
    // Keyframes for animating opacity.
    var opacityKeyframes = [];
    var totalTimeToGo = Math.abs(nextTime.diff(currentTime));
    var timeToGo = Math.abs(nextTime.diff(currentTime));
    var tempTime = Moment(currentTime);
    while (timeToGo > 0) {
      // See how long until the next midday/midnight.
      timeToNextMiddaynight = Util.timeToMiddayNight(tempTime, direction);
      // If our time to go is less than this we have reached the last 'keyframe'.
      if (timeToGo <= timeToNextMiddaynight) {
        opacityKeyframes.push({
          "opacity": targetOpacity,
          "duration": (timeToGo / totalTimeToGo) * transitionTime
        });
        timeToGo = Moment.duration(0);
      }
      // If not then this midday/midnight is our next keyframe, then we continue.
      else {
        timeToGo -= timeToNextMiddaynight;
        tempTime = (direction == 1) ? Moment(tempTime).add(timeToNextMiddaynight) : Moment(tempTime).subtract(timeToNextMiddaynight);
          //new Date(tempTime.getTime() + (direction * timeToNextMiddaynight));
        opacityKeyframes.push({
          "opacity": tempTime.hours() == 12 ? 0.0 : maxOpacity,
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
    var difference = time2.diff(time1, 'milliseconds');
    return (difference / Const.DAY_MS) * 360;
  }

  /**
    * Sets the watch to the time given.
    */
  function setWatch(time) {
    $("#watch_time").html(time.format("HH:mm"));
    $("#watch_date").html(time.format("D"));
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

  function getWatchCoordinates(clickEvent, watchDiv) {
    var parentOffset = watchDiv.offset();
    var watchSize = watchDiv.width();

    // Get coordinate clicked within watch.
    var x = clickEvent.pageX - parentOffset.left;
    var y = clickEvent.pageY - parentOffset.top;
    
    // Compute coordinates of center of watch.
    var center = watchSize / 2;

    return {
      'x' : x - center,
      'y' : y - center,
      'distance' : Math.pow(Math.pow(x - center, 2) + Math.pow(y - center, 2), 0.5) / watchSize
    };
  }

  function coordinatesToAngle(coordinates) {
    return 90 + ((180 / Math.PI) * Math.atan2((coordinates.y), (coordinates.x)));
  }

  function getNearbyTime(currentTime, newAngle) {
    var currentAngle = timeToIndicatorAngle(currentTime);
    var angleDifference = Util.difference180(newAngle, currentAngle);
    var timeDifference = Moment.duration(degreesToMs(angleDifference));
    return Moment(currentTime).add(timeDifference);
  }

  function degreesToMs(theta) {
    return (theta / 360) * (12 * Const.HOUR_MS)
  }

  return {
    init: function() {
      $("#watch_time_minus").click(function() {
        setTime(Moment(currentTime).subtract(1, 'hour'));
      });

      $("#watch_time_plus").click(function() {
        setTime(Moment(currentTime).add(1, 'hour'));
      });

      // Holds the time of the last click/drag event.
      var mousedownTime;

      $("#watch").mousedown(function(e) {
        var coordinates = getWatchCoordinates(e, $(this));
        mousedownTime = Moment(currentTime);
        if (0.325 < coordinates.distance) {
          $(this).mousemove(function(e) {
            var coordinates = getWatchCoordinates(e, $(this));
            var newTime = getNearbyTime(mousedownTime, coordinatesToAngle(coordinates))
            setWatch(newTime);
            mousedownTime = newTime;
          });
        }
      }).mouseup(function(e) {
        var coordinates = getWatchCoordinates(e, $(this));
        if (0.325 < coordinates.distance) {
          setTime(getNearbyTime(mousedownTime, coordinatesToAngle(coordinates)));
        }
        $(this).unbind('mousemove');
      });

      setTime(Moment());
    }
  }
})