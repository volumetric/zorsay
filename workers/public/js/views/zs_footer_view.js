define(['Backbone', 'bootstrap', 'summernote', 'snake'], function(B, b, s, snake) {
  console.log("inside zs_footer_view")
  var zsFooterView = Backbone.View.extend({
    el: 'body',

    events: {
      // "click #question_title_edit a": "question_edit",
      // "click #question_text_edit a": "question_edit",
      // "click #answer_edit a": "answer_edit",
      // "click #comment_text_edit a": "comment_edit",
    },

    initialize: function(args) {
      console.log("zs footer view initialized")
    },

    render: function() {
      // console.log("in all_question_view render function");
      return this;
    }

  });

  return zsFooterView;
});