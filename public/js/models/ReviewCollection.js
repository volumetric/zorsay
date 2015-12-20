define(['models/Review'], function(Review) {
  var ReviewCollection = Backbone.Collection.extend({
    model: Review
  });

  return ReviewCollection;
});
