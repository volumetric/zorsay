require(['./boot_common_minimal'], function () {
    require([
        'views/zs_navbar_view', 
        'views/zs_about_zorsay_view',
        ], function(
            zs_navbar_view, 
            zs_about_zorsay_view
            ) 
        {
 
    	var zsnv = new zs_navbar_view();
    	var zsssv = new zs_about_zorsay_view();
      
        // var user_info = {};
        // $.get('/account/info', function(data){
        //     user_info._author = data;
        //     // console.log(user_info);

        //     var zschv = new zs_comment_handling_view({
        //         comment_url: comment_url,
        //         user_info: user_info,
        //     });
        // });
    });
});