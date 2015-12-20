define(['models/zs_comment'], function(zs_comment) {
  var zs_comment_collection = Backbone.Collection.extend({
    model: zs_comment,
  });

  return zs_comment_collection;
});
