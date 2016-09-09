define(["jquery"], function($) {

  return {
    init : function() {
      this.initExocet();
      this.initBirds();
    },

    initExocet : function() {
      $("#exocet_wrapper").css("transition", "all 0s");
      $("#exocet_wrapper").css("transform", "translateX(100%)");
      $("#watch_control_car").click(this.animateExocet);
    },

    initBirds: function() {
      $("#birds").css("transition", "all 0s");
      $("#birds").css("transform", "");
      $("#watch_control_birds").click(this.animateBirds);
    },

    animateExocet : function() {
      $("#exocet_wrapper").css("transition", "all 0s");
      $("#exocet_wrapper").css("transform", "translateX(100%)");
      setTimeout(function(){
        $("#exocet_wrapper").css("transition", "all 10s");
        $("#exocet_wrapper").css("transform", "translateX(100vw)"); 
      }, 100);
    },

    animateBirds : function() {
      $("#birds").css("transition", "all 0s");
      $("#birds").css("transform", "");
      setTimeout(function(){
        $("#birds").css("transition", "all linear 0.5s");
        $("#birds").css("opacity", "1");
        setTimeout(function(){
          $("#birds").css("transition", "all linear 20s");
          $("#birds").css("transform", "translate(-100vw, -30vh) scale(1.2, 1.2)");
          setTimeout(function(){
            $("#birds").css("transition", "all linear 0.5s");
            $("#birds").css("opacity", "0"); 
          }, 20000);
        }, 600);
      }, 100);
    }
  }
})