@@include('../../node_modules/jquery/dist/jquery.min.js')
@@include('./vendor/baslider.js')
@@include('./vendor/jquery.parallax-1.1.3.js')
@@include('./vendor/jquery.localScroll.min.js')
@@include('./vendor/jquery.scrollTo.js')
@@include('./vendor/jquery.easing.js')
@@include('./vendor/jquery.viewport.mini.js')
@@include('./vendor/imagesloaded.pkgd.js')

window.onload = function () {
  $('.ba-slider').beforeAfter();

  $("body").imagesLoaded(function(){
    $(".page-loader div").fadeOut();
    $(".page-loader").delay(200).fadeOut("slow");
  });

}
$(document).ready(function(){
  $(window).trigger("resize");
  init_parallax();
  init_scroll_navigate();
});

/* ---------------------------------------------
  Scroll navigation
  --------------------------------------------- */

  function init_scroll_navigate(){

  $(".local-scroll").localScroll({
      target: "body",
      duration: 1500,
      offset: 0,
      easing: "easeInOutExpo"
  });

  var sections = $(".home-section, .split-section, .page-section");
  var menu_links = $(".scroll-nav li a");

  $(window).scroll(function(){

      sections.filter(":in-viewport:first").each(function(){
          var active_section = $(this);
          var active_link = $('.scroll-nav li a[href="#' + active_section.attr("id") + '"]');
          menu_links.removeClass("active");
          active_link.addClass("active");
      });
  });
}

/* ---------------------------------------------
  Sections helpers
  --------------------------------------------- */

// Sections backgrounds

var pageSection = $(".home-section, .page-section, .small-section, .split-section");
pageSection.each(function(indx){

    if ($(this).attr("data-background")){
        $(this).css("background-image", "url(" + $(this).data("background") + ")");
    }
});

/* -------------------------------------------
  Parallax
  --------------------------------------------- */

  function init_parallax(){

  // Parallax
  if (($(window).width() >= 1024) && (mobileTest == false)) {
      $(".parallax-1").parallax("50%", 0.1);
      $(".parallax-2").parallax("50%", 0.2);
      $(".parallax-3").parallax("50%", 0.3);
      $(".parallax-4").parallax("50%", 0.4);
      $(".parallax-5").parallax("50%", 0.5);
      $(".parallax-6").parallax("50%", 0.6);
      $(".parallax-7").parallax("50%", 0.7);
      $(".parallax-8").parallax("50%", 0.5);
      $(".parallax-9").parallax("50%", 0.5);
      $(".parallax-10").parallax("50%", 0.5);
      $(".parallax-11").parallax("50%", 0.05);
  }

}

/* --------------------------------------------
     Platform detect
     --------------------------------------------- */
     var mobileTest;
     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
         mobileTest = true;
         $("html").addClass("mobile");
     }
     else {
         mobileTest = false;
         $("html").addClass("no-mobile");
     }

     var mozillaTest;
     if (/mozilla/.test(navigator.userAgent)) {
         mozillaTest = true;
     }
     else {
         mozillaTest = false;
     }
     var safariTest;
     if (/safari/.test(navigator.userAgent)) {
         safariTest = true;
     }
     else {
         safariTest = false;
     }

     // Detect touch devices
     if (!("ontouchstart" in document.documentElement)) {
         document.documentElement.className += " no-touch";
     }
