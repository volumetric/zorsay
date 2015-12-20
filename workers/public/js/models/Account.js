define(['models/ReviewCollection'], function(ReviewCollection) {
  var Account = Backbone.Model.extend({
    urlRoot: '/accounts',

    initialize: function() {
      this.review       = new ReviewCollection();
      this.review.url   = '/accounts/' + this.id + '/reviews';
      // this.activity     = new ReviewCollection();
      // this.activity.url = '/accounts/' + this.id + '/activity';
    }
  });

  return Account;
});
