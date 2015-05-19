var sidebar_open = false;

function init() {
  initSideBar();
  initCountdowns();
  initUsefulThings();
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