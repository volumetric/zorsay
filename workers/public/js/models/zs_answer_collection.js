define(['models/zs_answer'], function(zs_answer) {
  var zs_answer_collection = Backbone.Collection.extend({
    model: zs_answer,
  });

  return zs_answer_collection;
});
