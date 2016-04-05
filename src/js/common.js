(function ($) {  
  var heightDetect = function heightDetect() {
    $(".top").css("height", $(window).height());
  };
  
  $(function () {
    heightDetect();
      
    $(".top_text h1").addClass("fadeInDown animated");
    $(".top_text p").addClass("fadeInUp animated");
    
    // rollover effect for sections of the site
    $('#artesaos-navbar').localScroll({duration:800});

    $(window).resize(function() {
      heightDetect();
    });
      
  });
})(jQuery);
