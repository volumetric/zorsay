define(['Backbone', 'bootstrap'], function(B, b) {
  console.log("inside zs_landing_view")

  var zsLandingView = Backbone.View.extend({
    el: 'body',

    events: {
      // #TODO replace load more button click with page end scroll event
      // "click .shopex-short-load-more": "load_more",
    },

    initialize: function() {
      // console.log("zs landing view initialized");
    },

    render: function() {
      // console.log("in zs_landing_view render function");
      return this;
    }

  });

  return zsLandingView;
});