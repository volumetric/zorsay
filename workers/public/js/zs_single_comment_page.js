require(['./boot_common_minimal'], function () {
    require([
        'views/zs_navbar_view', 
        
        'views/zs_popover_view',        
        'views/zs_post_utility_handling_view',
        'views/zs_comment_handling_view',
        // 'views/zs_answer_handling_view',

        'views/zs_single_question_view',
        // 'views/zs_single_answer_view',
        'views/zs_footer_view',
        ], function(
            zs_navbar_view, 
           
            zs_popover_view,
            zs_post_utility_handling_view,
            zs_comment_handling_view,
            // zs_answer_handling_view,
            
            zs_single_question_view,
            // zs_single_answer_view,
            zs_footer_view
            ) 
        {
 
    	var zsnv = new zs_navbar_view();
    	var zspv = new zs_popover_view();

        var zssqv = new zs_single_question_view();
    	// var zssav = new zs_single_answer_view();
        
        var zspuhv = new zs_post_utility_handling_view();
      
        comment_url = window.location.pathname+'/comment'
    	// answer_url = window.location.pathname+'/answer'
        

        var zschv = new zs_comment_handling_view({
            comment_url: comment_url,
        });

        // var zsahv = new zs_answer_handling_view({
        //     answer_url: answer_url,
        // });

		var zsfv = new zs_footer_view();
    });
});