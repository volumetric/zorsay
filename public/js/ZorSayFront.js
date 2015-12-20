// define(['router'], function(router) {
//   var initialize = function() {
//     runApplication();
//   };

//   var runApplication = function() {
//     window.location.hash = 'landing';
//     Backbone.history.start();
//   };

//   return {
//     initialize: initialize
//   };
// });


define(['router'], function(router) {
  var initialize = function() {
    checkLogin(runApplication);
  };

  var checkLogin = function(callback) {
    $.ajax("/account/authenticated", {
      method: "GET",
      success: function() {
        return callback(true);
      },
      error: function(data) {
        return callback(false);
      }
    });
  };

  var runApplication = function(authenticated) {
    // console.log("runApplication");
    if (!authenticated) {
      // console.log("not auth");
      // console.log(window.location.hash);

      // check if its an unknow url, then redirect to #login, else just stay on that page
      // if (window.location.hash == ''){
      if (window.location.hash == '' || window.location.hash == '#' || window.location.hash == '#userhome' || window.location.hash == '#reviews/all' || window.location.hash == '#profile' || window.location.hash == '#settings' || window.location.hash == '#logout'){
        // console.log("going to #login");
        window.location.hash = 'login';
      }
      // }
    } 
    else {
      // console.log("auth yes");
      if (window.location.hash == '' || window.location.hash == '#' || window.location.hash == '#login' || window.location.hash == '#register' || window.location.hash == '#forgotpassword') {
        window.location.hash = 'userhome';
      }
    }
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});
