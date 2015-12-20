define(function(require) {
  var Review = Backbone.Model.extend({
    urlRoot: '/accounts/' + this.accountId + '/reviews'
  });

  return Review;
});
