define(["moment", "app/constant"], function(Moment, Const) {
  
  return {
    /**
    * Given two angles between 0 and 360 degrees, returns the difference.
    * This function wraps around (i.e. result is between -180 and 180).
    */
    difference180 : function(newAngle, oldAngle) {
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
    },

    /**
    * Given a number as a string, returns a version with at least two characters.
    */
    padTwoChars : function(numberString) {
      while (numberString.length < 2) {
        numberString = '0' + numberString;
      }
      return numberString;
    },

    /**
    * Returns the number of ms (going forwards if direction is +ve, going backwards if direction is -ve) to the nearest midday or midnight.
    */
    timeToMiddayNight : function(time, direction) {
      var twelveHours = 12 * Const.HOUR_MS;
      var differenceMidday = this.msFromMidday(time);
      
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
      console.log("timeToMiddayNight cannot deal with the following parameters:");
      console.log("time: " + time + ", direction: " + direction);
      return -10000;
    },
    
    /**
      * Returns the number of hours between the given time and midday.
      * - Negative if before midday.
      * - Positive if past midday.
      * e.g. 10:30 returns -1.5.
      */
    hoursFromMidday : function(time) {
      return this.msFromMidday(time) / Const.HOUR_MS;
    },

    /**
      * Returns the time (in ms) between the given time and midday.
      * - Negative if before midday.
      * - Positive if past midday.
      */
    msFromMidday : function(time) {
      var midday = Moment(time).hour(12).minute(0).second(0).millisecond(0);
      return time.diff(midday);
    },

    mostRecentMidnight : function(time) {
      return Moment(time).startOf('day');
    }
  }
})