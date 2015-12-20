define(['ZorSayFrontView', 'text!templates/review.html', 'termifier'], function(ZorSayFrontView, reviewTemplate, termifier) {
  var reviewView = ZorSayFrontView.extend({
    tagName: 'div',

    render: function() {
      // console.log(this.model.toJSON());
      $(this.el).html(_.template(reviewTemplate, this.model.toJSON()));
      // $(this.el).html(_.template(reviewTemplate, JSON.stringify(this.model)));

      this.$(".rating_box").on('hover', function () {
      	// console.log(this.id);
      	// console.log("mouserover");
      });

      // this.$(".rating_box").on('mouseout',function () {
      // 	// console.log("mouserout");
      // });

      if (typeof(termifier) === undefined) {
        // console.log("termifier undefined");
      } else {
        // console.log("termifier defined");
        this.$(".rating_box").termifier('comment');
      }

      return this;
    }
  });

  return reviewView;
});
