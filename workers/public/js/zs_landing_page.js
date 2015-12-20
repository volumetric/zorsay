require(['./boot_common_minimal'], function (common) {
    require([
    	'views/zs_navbar_view',
    	'views/zs_landing_view'
    	], function(
    		zs_navbar_view,
    		zs_landing_view
    		)
    	{  
      	// console.log("inside zs_landing_page.js")
      	var znv = new zs_navbar_view();
      	var zslv = new zs_landing_view();
    });
});