require(['./boot_common_minimal'], function () {
    require(['views/zs_navbar_view'], function(zs_navbar_view) {
 
    	var zsnv = new zs_navbar_view();
        zsnv.swapScreenLogin();
    });
});