require(['./boot_common_minimal'], function (common) {
    require([
    	'views/zs_navbar_view',
    	'views/zs_popover_view',

        'views/zs_post_utility_handling_view',
        'views/zs_comment_handling_view',

    	'views/zs_all_question_view'
    	], function(
    		zs_navbar_view,
    		zs_popover_view,
        
            zs_post_utility_handling_view,
            zs_comment_handling_view,

    		zs_all_question_view
    		)
    	{  
      	// console.log("inside zs_all_question_page.js")
      	var znv = new zs_navbar_view();
      	var zspv = new zs_popover_view();
    	
        var zsaqv = new zs_all_question_view();
        var zspuhv = new zs_post_utility_handling_view();

        comment_url = window.location.pathname+'/comment'
        // answer_url = window.location.pathname+'/answer'

        var zschv = new zs_comment_handling_view({
            comment_url: comment_url,
        }); 

        // var zsahv = new zs_answer_handling_view({
        //     answer_url: answer_url,
        // });        
    });
});