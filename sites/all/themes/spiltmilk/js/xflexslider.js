(function ($) {
  Drupal.behaviors.spiltmilk = {
    attach: function(context, settings) {
      // you can implement your custom javascript/jquery here,
      // and also create other attached behaviors
	// Switch buttons Open to Close Drawer on click
 $(window).load(function() {

    $('.flexslider').flexslider({
          	animation: "slide",
          	controlsContainer: ".group_slider",
          	slideDirection: "horizontal",   //String: Select the sliding direction, "horizontal" or "vertical"
		  	slideshow: false,                //Boolean: Animate slider automatically
			directionNav: true,             //Boolean: Create navigation for previous/next navigation? (true/false)
			controlNav: true,               //Boolean: Create navigation for paging control of each clide? Note: Leave true for manualControls usage
			keyboardNav: true,              //Boolean: Allow slider navigating via keyboard left/right keys
			mousewheel: true,              //Boolean: Allow slider navigating via mousewheel
			animationLoop: true            //Boolean: Should the animation loop? If false, directionNav will received "disable" classes at either end
    });
  });  
  		
          

    }
  };
})(jQuery);