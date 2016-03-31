(function ($) {
  var heightDetect = function heightDetect() {
    $(".top").css("height", $(window).height());
  };
  
  $(function () {
    heightDetect();
    $(".top_text h1").addClass("fadeInDown animated");
    $(".top_text p").addClass("fadeInUp animated");

    $(window).resize(function() {
      heightDetect();
    });
  });
})(jQuery);
