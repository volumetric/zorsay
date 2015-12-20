define(function(require) {
  console.log("inside ZorSayFrontView")
  var ZorSayFrontView = Backbone.View.extend({
    requireLogin: true
  });

  return ZorSayFrontView;
});
