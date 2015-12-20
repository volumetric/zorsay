define(['Backbone', 'text!templates/zs_answer_template.html'], function(b, zsAnswerTemplate) {
  var zsAnswerView = Backbone.View.extend({
    tagName: 'div',

    events: {
    },

    initialize: function(args) {
      // console.log("zs answer view initialized")
      // console.log(this.model);

      this.model = args.model;
      this.user_info = args.user_info;

    },

    render: function() {
      answer_data = this.model.attributes;
      answer_data._author = this.user_info;

      // answer_data._author = this.user_info._author

      // console.log("############");
      // console.log({answer_data: answer_data, user_info: this.user_info._author});
      $(this.el).html(_.template(zsAnswerTemplate, JSON.stringify({answer_data : answer_data,
        user_info: this.user_info, })));
      // console.log("$$$$$$$$$$");

      return this;
    }
  });
  return zsAnswerView;
});
