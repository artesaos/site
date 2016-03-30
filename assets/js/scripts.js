	// ################ ANIMATION ##############

	$(".top_text h1").addClass("fadeInDown animated");
	$(".top_text p").addClass("fadeInUp animated");

	function heightDetect() {
		$(".top").css("height", $(window).height());
	};
	heightDetect();
	$(window).resize(function() {
		heightDetect();
	});
