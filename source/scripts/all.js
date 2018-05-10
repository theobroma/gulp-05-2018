@@include('../../node_modules/jquery/dist/jquery.min.js')

// $(document).ready(function () {
// 	//Animation all blocks
// 	function onScrollInit( items, trigger ) {
// 		items.each( function() {
// 			var osElement = $(this),
// 				osAnimationClass = osElement.attr('data-os-animation'),
// 				osAnimationDelay = osElement.attr('data-os-animation-delay');
// 				osElement.css({
// 					'animation-delay': osAnimationDelay
// 				});
// 			var osTrigger = ( trigger ) ? trigger : osElement;
// 			osTrigger.waypoint(function() {
// 				osElement.addClass('animated').addClass(osAnimationClass);
// 				},{
// 					triggerOnce: true,
// 					offset: '90%'
// 			});
// 		});
// 	}

// 	onScrollInit( $('.os-animation') );
// 	onScrollInit( $('.staggered-animation'), $('.staggered-animation-container') );


// 	//Button down
// 	$(".intro__button-down").click(function() {
// 		$("html, body").animate({ scrollTop: $(".main-header").height()+10}, "slow");
// 		return false;
// 	});

// 	//Jquery Accordion
// 	var icons = {
// 		header: "arrow-down",
// 		activeHeader: "arrow-up"
// 		};
// 		$( "#accordion" ).accordion({
// 			icons: icons,
// 			heightStyle: "content",
// 	});

// 	//Toggle menu
// 	$(".hamburger").on("click", function(){
// 		$(".main-nav__list").slideToggle();
// 		$(this).toggleClass("is-active");
// 	});

// 	//Open map
// 	$('.map__open').magnificPopup({ 
// 		type: 'iframe' 
// 	});

// 	//Carousel
// 	$('.owl-carousel').owlCarousel({
// 		items : 1,
// 		nav : true,
// 		navText : "",
// 		loop : true,
// 		autoplay : true,
// 		autoplayHoverPause : true,
// 		fluidSpeed : 600,
// 		autoplaySpeed : 600,
// 		navSpeed : 600,
// 		dotsSpeed : 600,
// 		dragEndSpeed : 600,
// 	});


// 	//Button-Up
// 	$(".footer__button-up").click(function() {
// 		$("html, body").animate({ scrollTop: 0 }, "slow");
// 		return false;
// 	});
// })
