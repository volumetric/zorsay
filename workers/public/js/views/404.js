define(['text!templates/404.html'], function(p404Template) {
  var p404View = Backbone.View.extend({
    el: $('#content'),

    render: function() {
      $(this.el).html(p404Template);
      // this.$el.html(p404Template);
      return this;
    }
  });

  return p404View;
});
