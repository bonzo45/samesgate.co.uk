define(["jquery"], function($) {
  
  var usefulThings = {
    me: [      
      {
        icon: "facebook.png",
        url: "http://www.facebook.com/bonzo45"
      },
      {
        icon: "twitter.png",
        url: "http://www.twitter.com/bonzo450"
      },      
      {
        icon: "linkedin.png",
        url: "https://uk.linkedin.com/in/sam-esgate-b93b0468"
      },    
      {
        icon: "github.png",
        url: "https://github.com/bonzo45"
      },      
      {
        icon: "youtube.png",
        url: "http://www.youtube.com/user/Bonzo450/videos"
      },
      {
        icon: "g+.png",
        url: "https://plus.google.com/u/0/+SamEsgate/"
      }
    ],

    links: [
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
      },
      {
        icon: "heart_internet.png",
        url: "https://www.heartinternet.uk/login"
      }
    ]
  }

  return {  
    init: function() {
      var totalWidth = 35;
      var columns = 5;
      var paddingRatio = 3;
      var unitWidth = totalWidth / (columns * paddingRatio + columns + 1);

      $("#bonzos_useful_things").css("width", (totalWidth - unitWidth) + "vmin");
      $("#bonzos_useful_things").css("height", "auto");
      $("#bonzos_useful_things").css("padding", (unitWidth / 2) + "vmin");

      /* Go through each section */
      $.each(usefulThings, function(category, entries) {
        /* Go through each entry */
        $.each(entries, function() {
          var div = $("#bonzos_useful_things");
          var image = "<img src=\"image/icon/" + this.icon + "\" class=\"useful_icon\"></a>";
          var link = "<a href=\"" + this.url + "\">" + image + "</a>";
          div.append(link);
        });
      });

      $(".useful_icon").css("width", (unitWidth * paddingRatio) + "vmin");
      $(".useful_icon").css("height", (unitWidth * paddingRatio) + "vmin");
      $(".useful_icon").css("padding", (unitWidth / 2) + "vmin");
    }
  }
})