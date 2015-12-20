/*
* Author:      Marco Kuiper (http://www.marcofolio.net/)
*/

(function($){

$.fn.shopex = function() {
	// Variable to set the duration of the animation
	var animationTime = 200;
		// Variable to set the rating
	var rate;

	// Variable to store the colours
    // var colours = ["bd2c33", "e49420", "ecdb00", "3bad54", "1b7db9"];
    var colours = ["CB202D", "FF7800", "FFD800", "107D1D", "43D42D"];

	
	// Add rating information box after rating
	var ratingInfobox1 = $("<div />")
		.attr("id", "ratinginfo1")
		.insertAfter($("#rating1"));

	// Function to colorize the right ratings
	var colourizeRatings1 = function(nrOfRatings) {
		$("#rating1 li a").each(function() {
			if($(this).parent().index() <= nrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[nrOfRatings] } , animationTime);
			}
		});
	};
	
	// Handle the hover events
	$("#rating1 li a").hover(function() {
		
		// Empty the rating info box and fade in
		ratingInfobox1
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Add the text to the rating info box
		$("<p />")
			.html($(this).html())
			.appendTo(ratingInfobox1);
		
		// Call the colourize function with the given index
		colourizeRatings1($(this).parent().index());
	}, function() {
		
		// Fade out the rating information box
		ratingInfobox1
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Restore all the rating to their original colours
		$("#rating1 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

		// Restore the rating to the one clicked earlier
		var one_indexed_rating = Number($(this).parent().parent().attr('rating'));
		colourizeRatings1(one_indexed_rating - 1);

		// Add the text to the rating info box to the one clicked earlier, if rating != 0
		if (one_indexed_rating != 0) {
			$("<p />")
				.html($(this).parent().parent().attr('rating_info'))
				.appendTo(ratingInfobox1);	
		}
		
	});

	// Handle the click events
	$("#rating1 li a").click(function() {
		$("#rating1").attr('rating', $(this).parent().index() + 1);
		$("#rating1").attr('rating_info', $(this).html());
		return false;
	});

	// rating 2

	
	// Add rating information box after rating
	var ratingInfobox2 = $("<div />")
		.attr("id", "ratinginfo2")
		.insertAfter($("#rating2"));

	// Function to colorize the right ratings
	var colourizeRatings2 = function(nrOfRatings) {
		$("#rating2 li a").each(function() {
			if($(this).parent().index() <= nrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[nrOfRatings] } , animationTime);
			}
		});
	};
	
	// Handle the hover events
	$("#rating2 li a").hover(function() {
		
		// Empty the rating info box and fade in
		ratingInfobox2
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Add the text to the rating info box
		$("<p />")
			.html($(this).html())
			.appendTo(ratingInfobox2);
		
		// Call the colourize function with the given index
		colourizeRatings2($(this).parent().index());
	}, function() {
		
		// Fade out the rating information box
		ratingInfobox2
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Restore all the rating to their original colours
		$("#rating2 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

		// Restore the rating to the one clicked earlier
		var one_indexed_rating = Number($(this).parent().parent().attr('rating'));
		colourizeRatings2(one_indexed_rating - 1);

		// Add the text to the rating info box to the one clicked earlier, if rating != 0
		if (one_indexed_rating != 0) {
			$("<p />")
				.html($(this).parent().parent().attr('rating_info'))
				.appendTo(ratingInfobox2);	
		}
	});

	// Handle the click events
	$("#rating2 li a").click(function() {
		$("#rating2").attr('rating', $(this).parent().index() + 1);
		$("#rating2").attr('rating_info', $(this).html());
		return false;
	});

	//rating 3


	// Add rating information box after rating
	var ratingInfobox3 = $("<div />")
		.attr("id", "ratinginfo3")
		.insertAfter($("#rating3"));

	// Function to colorize the right ratings
	var colourizeRatings3 = function(nrOfRatings) {
		$("#rating3 li a").each(function() {
			if($(this).parent().index() <= nrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[nrOfRatings] } , animationTime);
			}
		});
	};
	
	// Handle the hover events
	$("#rating3 li a").hover(function() {
		
		// Empty the rating info box and fade in
		ratingInfobox3
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Add the text to the rating info box
		$("<p />")
			.html($(this).html())
			.appendTo(ratingInfobox3);
		
		// Call the colourize function with the given index
		colourizeRatings3($(this).parent().index());
	}, function() {
		
		// Fade out the rating information box
		ratingInfobox3
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Restore all the rating to their original colours
		$("#rating3 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

		// Restore the rating to the one clicked earlier
		var one_indexed_rating = Number($(this).parent().parent().attr('rating'));
		colourizeRatings3(one_indexed_rating - 1);

		// Add the text to the rating info box to the one clicked earlier, if rating != 0
		if (one_indexed_rating != 0) {
			$("<p />")
				.html($(this).parent().parent().attr('rating_info'))
				.appendTo(ratingInfobox3);	
		}
	});

	// Handle the click events
	$("#rating3 li a").click(function() {
		$("#rating3").attr('rating', $(this).parent().index() + 1);
		$("#rating3").attr('rating_info', $(this).html());
		return false;
	});

	//rating 4


	// Add rating information box after rating
	var ratingInfobox4 = $("<div />")
		.attr("id", "ratinginfo4")
		.insertAfter($("#rating4"));

	// Function to colorize the right ratings
	var colourizeRatings4 = function(nrOfRatings) {
		$("#rating4 li a").each(function() {
			if($(this).parent().index() <= nrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[nrOfRatings] } , animationTime);
			}
		});
	};
	
	// Handle the hover events
	$("#rating4 li a").hover(function() {
		
		// Empty the rating info box and fade in
		ratingInfobox4
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Add the text to the rating info box
		$("<p />")
			.html($(this).html())
			.appendTo(ratingInfobox4);
		
		// Call the colourize function with the given index
		colourizeRatings4($(this).parent().index());
	}, function() {
		
		// Fade out the rating information box
		ratingInfobox4
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Restore all the rating to their original colours
		$("#rating4 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

		// Restore the rating to the one clicked earlier
		var one_indexed_rating = Number($(this).parent().parent().attr('rating'));
		colourizeRatings4(one_indexed_rating - 1);

		// Add the text to the rating info box to the one clicked earlier, if rating != 0
		if (one_indexed_rating != 0) {
			$("<p />")
				.html($(this).parent().parent().attr('rating_info'))
				.appendTo(ratingInfobox4);	
		}
	});

	// Handle the click events
	$("#rating4 li a").click(function() {
		$("#rating4").attr('rating', $(this).parent().index() + 1);
		$("#rating4").attr('rating_info', $(this).html());
		return false;
	});

	//rating 5


	// Add rating information box after rating
	var ratingInfobox5 = $("<div />")
		.attr("id", "ratinginfo5")
		.insertAfter($("#rating5"));

	// Function to colorize the right ratings
	var colourizeRatings5 = function(nrOfRatings) {
		$("#rating5 li a").each(function() {
			if($(this).parent().index() <= nrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[nrOfRatings] } , animationTime);
			}
		});
	};
	
	// Handle the hover events
	$("#rating5 li a").hover(function() {
		
		// Empty the rating info box and fade in
		ratingInfobox5
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Add the text to the rating info box
		$("<p />")
			.html($(this).html())
			.appendTo(ratingInfobox5);
		
		// Call the colourize function with the given index
		colourizeRatings5($(this).parent().index());
	}, function() {
		
		// Fade out the rating information box
		ratingInfobox5
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Restore all the rating to their original colours
		$("#rating5 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

		// Restore the rating to the one clicked earlier
		var one_indexed_rating = Number($(this).parent().parent().attr('rating'));
		colourizeRatings5(one_indexed_rating - 1);

		// Add the text to the rating info box to the one clicked earlier, if rating != 0
		if (one_indexed_rating != 0) {
			$("<p />")
				.html($(this).parent().parent().attr('rating_info'))
				.appendTo(ratingInfobox5);	
		}
	});

	// Handle the click events
	$("#rating5 li a").click(function() {
		$("#rating5").attr('rating', $(this).parent().index() + 1);
		$("#rating5").attr('rating_info', $(this).html());
		return false;
	});

	//rating 6



	// Add rating information box after rating
	var ratingInfobox6 = $("<div />")
		.attr("id", "ratinginfo6")
		.insertAfter($("#rating6"));

	// Function to colorize the right ratings
	var colourizeRatings6 = function(nrOfRatings) {
		$("#rating6 li a").each(function() {
			if($(this).parent().index() <= nrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[nrOfRatings] } , animationTime);
			}
		});
	};
	
	// Handle the hover events
	$("#rating6 li a").hover(function() {
		
		// Empty the rating info box and fade in
		ratingInfobox6
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Add the text to the rating info box
		$("<p />")
			.html($(this).html())
			.appendTo(ratingInfobox6);
		
		// Call the colourize function with the given index
		colourizeRatings6($(this).parent().index());
	}, function() {
		
		// Fade out the rating information box
		ratingInfobox6
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Restore all the rating to their original colours
		$("#rating6 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

		// Restore the rating to the one clicked earlier
		var one_indexed_rating = Number($(this).parent().parent().attr('rating'));
		colourizeRatings6(one_indexed_rating - 1);

		// Add the text to the rating info box to the one clicked earlier, if rating != 0
		if (one_indexed_rating != 0) {
			$("<p />")
				.html($(this).parent().parent().attr('rating_info'))
				.appendTo(ratingInfobox6);	
		}
	});

	// Handle the click events
	$("#rating6 li a").click(function() {
		$("#rating6").attr('rating', $(this).parent().index() + 1);
		$("#rating6").attr('rating_info', $(this).html());
		return false;
	});

	//rating 7



	// Add rating information box after rating
	var ratingInfobox7 = $("<div />")
		.attr("id", "ratinginfo7")
		.insertAfter($("#rating7"));

	// Function to colorize the right ratings
	var colourizeRatings7 = function(nrOfRatings) {
		$("#rating7 li a").each(function() {
			if($(this).parent().index() <= nrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[nrOfRatings] } , animationTime);
			}
		});
	};
	
	// Handle the hover events
	$("#rating7 li a").hover(function() {
		
		// Empty the rating info box and fade in
		ratingInfobox7
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Add the text to the rating info box
		$("<p />")
			.html($(this).html())
			.appendTo(ratingInfobox7);
		
		// Call the colourize function with the given index
		colourizeRatings7($(this).parent().index());
	}, function() {
		
		// Fade out the rating information box
		ratingInfobox7
			.empty()
			.stop()
			.animate({ opacity : 1 }, animationTime);
		
		// Restore all the rating to their original colours
		$("#rating7 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

		// Restore the rating to the one clicked earlier
		var one_indexed_rating = Number($(this).parent().parent().attr('rating'));
		colourizeRatings7(one_indexed_rating - 1);

		// Add the text to the rating info box to the one clicked earlier, if rating != 0
		if (one_indexed_rating != 0) {
			$("<p />")
				.html($(this).parent().parent().attr('rating_info'))
				.appendTo(ratingInfobox7);	
		}
	});

	// Handle the click events
	$("#rating7 li a").click(function() {
		$("#rating7").attr('rating', $(this).parent().index() + 1);
		$("#rating7").attr('rating_info', $(this).html());
		return false;
	});


	//rating 8: overall rating

	// console.log("inside script.js aka shopex");
	// Add rating information box after rating
	var ratingInfobox8 = $("<div />")
		.attr("id", "ratinginfo8")
		.insertAfter($("#rating8"));

	// Function to colorize the right ratings
	var colourizeRatings8 = function(nrOfRatings) {
		roundedNrOfRatings = Math.round(nrOfRatings);

		$("#rating8 li a").each(function() {
			if($(this).parent().index() <= roundedNrOfRatings) {
				$(this).stop().animate({ backgroundColor : "#" + colours[roundedNrOfRatings] } , animationTime);
			}
		});
	};

	// Handle the click events
	$("dd[id^=rating] li a").click(function() {
		if ($(this).parent().parent().attr('name') != "all_rating") {
			// console.log("calc_rating");
			
			calc_rating = 0;
			c = 0;

			$("dd[id^=rating]").each(function() {
				if ($(this).attr('name') != "all_rating") {
					r = Number($(this).attr('rating'));
					if(r != 0) {
						c++;
						calc_rating += r;
						// console.log("r: " + r);
					}
				}
			});
			if (c != 0){
				calc_rating /= c;
				// calc_rating = Math.round(calc_rating*10)/10;
				calc_rating_dec = ((calc_rating*10)%10 == 0) ? String(calc_rating)+'.0' : Math.round(calc_rating*10)/10;
			}
			console.log(calc_rating);

			// Set the rating param for overall rating to calculated rating
			$("#rating8").attr('rating', calc_rating);


			// Restore all the rating to their original colours
			$("#rating8 li a").stop().animate({ backgroundColor : "#333" } , animationTime);

			// Set the overall rating to calculated rating
			colourizeRatings8(calc_rating - 1);

			// Display the overall calculated rating next to colored rating bulbs 
			$(".calc_rating").html(calc_rating_dec);
		}

		return false;
	});

	

	//#TODO calculate the rating from earlier ratings and display it here, this will be read only, no hover/click events to listen to
}

})(jQuery);
