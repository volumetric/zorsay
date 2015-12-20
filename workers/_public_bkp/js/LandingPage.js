define(['router'], function(router) {
  var initialize = function() {
    runApplication();
  };

  var runApplication = function() {
    window.location.hash = 'landing';
    Backbone.history.start();
  };

  return {
    initialize: initialize
  };
});
