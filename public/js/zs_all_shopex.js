require(['./boot_common_minimal'], function (common) {
    require(['views/zs_navbar_view'], function(zs_navbar_view) {  
      var znv = new zs_navbar_view();
    });
});