define(["jquery"], function($) {

  return {
    init : function() {
      this.initMenu();
      this.initExocet();
      this.initBirds();
    },

    initMenu : function() {
      $("#welcome_bars").click(this.toggleMenu);
    },

    initExocet : function() {
      $("#exocet_wrapper").css("transition", "all 0s");
      $("#exocet_wrapper").css("transform", "translateX(200%)");
      $("#button_exocet").click(this.animateExocet);
    },

    initBirds: function() {
      $("#birds").css("transition", "all 0s");
      $("#birds").css("transform", "");
      $("#button_birds").click(this.animateBirds);
    },

    toggleMenu : function() {
      $("#welcome_drop_down").css("transition", "all 0.75s");
      if ($("#welcome_drop_down").css("opacity") == 0) {
        $("#welcome_drop_down").css("opacity", "1");
      }
      else if ($("#welcome_drop_down").css("opacity") == 1){
        $("#welcome_drop_down").css("opacity", "0");
      }
    },

    animateExocet : function() {
      $("#exocet_wrapper").css("transition", "all 0s");
      $("#exocet_wrapper").css("transform", "translateX(200%)");
      setTimeout(function(){
        $("#exocet_wrapper").css("transition", "all 7s");
        $("#exocet_wrapper").css("transform", "translateX(1200%)"); 
      }, 100);
    },

    animateBirds : function() {
      $("#birds").css("transition", "all 0s");
      $("#birds").css("transform", "");
      setTimeout(function(){
        $("#birds").css("transition", "all linear 0.5s");
        $("#birds").css("opacity", "1");
        $("#birds").css("transform", "translate(-30%, -7.5%)");
        setTimeout(function(){
          $("#birds").css("transition", "all linear 20s");
          $("#birds").css("transform", "translate(-1200%, -300%) scale(1.2, 1.2)");
          setTimeout(function(){
            $("#birds").css("transition", "all linear 0.5s");
            $("#birds").css("opacity", "0"); 
            $("#birds").css("transform", "translate(-1230%, -307.5%)");
          }, 20000);
        }, 500);
      }, 100);
    }
  }
})