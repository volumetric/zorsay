require(['./boot_common_minimal'], function () {
    require([
    	'views/zs_navbar_view', 
    	'views/zs_user_profile_view',
    	], function(
    		zs_navbar_view,
    		zs_user_profile_view
    		) 
    	{
    	var zsnv = new zs_navbar_view();
    	var zsssv = new zs_user_profile_view();
    });
});