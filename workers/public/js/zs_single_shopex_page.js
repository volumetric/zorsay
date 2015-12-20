require(['./boot_common_minimal'], function () {
    require([
        'views/zs_navbar_view', 

        'views/zs_popover_view',

        'views/zs_post_utility_handling_view',
        'views/zs_comment_handling_view',

        'views/zs_single_shopex_view',
        ], function(
            zs_navbar_view, 
            
            zs_popover_view,

            zs_post_utility_handling_view,
            zs_comment_handling_view,

            zs_single_shopex_view
            ) 
        {
 
    	shopex_pub_id = $(".post-div").attr("id").split("_")[1];
    	var zsnv = new zs_navbar_view();
    	var zspv = new zs_popover_view();
    	var zsssv = new zs_single_shopex_view({post_pub_id: shopex_pub_id});

        var zspuhv = new zs_post_utility_handling_view();
      
    	comment_url = window.location.pathname+'/comment'
        
        var zschv = new zs_comment_handling_view({
            comment_url: comment_url,
        });

    });
});