function insertUsefulThings() {
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
  college: [
  {
    icon: "cate.png",
    url: "https://cate.doc.ic.ac.uk"
  },
  {
    icon: "calendar.png",
    url: "http://www.doc.ic.ac.uk/~ms6611/table/3"
  },
  {
    icon: "gitlab.png",
    url: "https://gitlab.doc.ic.ac.uk/"
  }
  ],

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
    icon: "heart internet.png",
    url: "https://customer.heartinternet.co.uk/manage/manage.cgi/hosting"
  },
  {
    icon: "colour picker.png",
    url: "http://www.w3schools.com/tags/ref_colorpicker.asp"
  }
  ]
}