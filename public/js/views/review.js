define(['ZorSayFrontView', 'text!templates/review.html', 'css!styles/font-awesome.css', 'css!styles/summernote.css'], function(ZorSayFrontView, reviewTemplate) {
  console.log("review view ...")
  var reviewView = Backbone.View.extend({
    // tagName: 'div',
    el: 'body',

    events: {
      "click #editReview": "editReview",
      "click #saveReview": "saveReview",
    },

    initialize: function() {
      console.log("review view aka shopex view initialized")
      // $(document).on( 'click', '.editReview', this.editReview );
      // $(document).on( 'click', '.saveReview', this.saveReview );
    },

    editReview: function() {
      // console.log("in editReview");
      // console.log(this.$("#reviewText_editable").html());
      this.$("#reviewText_editable").summernote({
      // this.$(".summernote").summernote({
        // height: 300,
        focus: true,
        toolbar: [
          ['style', ['style']], // no style button
          ['style', ['bold', 'italic', 'underline']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['height', ['height']],
          ['insert', ['picture', 'video', 'link']], // no insert buttons

          // ['table', ['table']], // no table button
          // ['help', ['help']] //no help button
        ],
      });

      // this.$(".comment_summernote").hallo({editable: true});
      this.$(".comment_summernote").attr("contenteditable", true);

      // that = this;
      // this.$(".comment_summernote").on("click", function(){
      //   // that.$(".comment_summernote").destroy();
      //   // that.$(".comment_summernote").hallo({editable: false});

      //   $(this).hallo();
      //   // $(this).summernote({
      //   // // this.$(".summernote").summernote({
      //   //   focus: true,
      //   //   toolbar: [],
      //   // });
      // });
      
      // $('.note-toolbar .note-fontsize, .note-toolbar .note-color, .note-toolbar .note-para .dropdown-menu li:first, .note-toolbar .note-line-height').remove();


    },

    saveReview: function() { 
      // console.log("in saveReview");
      console.log(this.$("#reviewText_editable").html());
      // this.$("#reviewText_editable").destroy();
      this.$(".summernote").destroy();
      // this.$(".comment_summernote").hallo({editable: false});
      this.$(".comment_summernote").attr("contenteditable", false);

      updated_shopex = {
        reviewText: this.$("#reviewText_editable").html(),
        // vendor: vendor,
        // pscategory: pscategory,
        // anonymous:anonymous,
        
        otd_rating:this.$("#comment_editable_otd .user-criteria-rating").html(),
        pad_rating:this.$("#comment_editable_pad .user-criteria-rating").html(),
        pro_rating:this.$("#comment_editable_pro .user-criteria-rating").html(),
        pri_rating:this.$("#comment_editable_pri .user-criteria-rating").html(),
        eos_rating:this.$("#comment_editable_eos .user-criteria-rating").html(),
        rrp_rating:this.$("#comment_editable_rrp .user-criteria-rating").html(),
        csu_rating:this.$("#comment_editable_csu .user-criteria-rating").html(),
        
        all_rating:this.$("#comment_editable_all .user-criteria-rating").html(),

        otd_comment:this.$("#comment_editable_otd .user-criteria-comment").html(),
        pad_comment:this.$("#comment_editable_pad .user-criteria-comment").html(),
        pri_comment:this.$("#comment_editable_pri .user-criteria-comment").html(),
        pro_comment:this.$("#comment_editable_pro .user-criteria-comment").html(),
        eos_comment:this.$("#comment_editable_eos .user-criteria-comment").html(),
        rrp_comment:this.$("#comment_editable_rrp .user-criteria-comment").html(),
        csu_comment:this.$("#comment_editable_csu .user-criteria-comment").html(),
      }

      $.post('/shopping-experience/pub_id/', updated_shopex, function(data){});
      // $.ajax('/shopping-experience/pub_id/', updated_shopex, function(data){});

      // this.$("#comment_editable_otd .user-criteria-comment").html();
      // this.$("#comment_editable_otd .user-criteria-rating").html();

      // console.log(this.$("#comment_editable_otd .user-criteria-comment").html());
      // console.log(this.$("#comment_editable_otd .user-criteria-rating").html());



      // console.log(this.$("#reviewText_editable").html().trim());

      // this.$("#reviewText_editable").html().trim()
      
    },

    render: function() {
      // console.log(this.model.toJSON());

      console.log(JSON.stringify(this.model));
      console.log("in review render function");
      // $(this.el).html(_.template(reviewTemplate, {}));
      
      $(this.el).html(_.template(reviewTemplate, JSON.stringify(this.model)));

      // $("#editReview").on("click", this.editReview);
      // $("#saveReview").on("click", this.saveReview);

      var edit = function() {
        console.log(this);
        // $('.click2edit').summernote({focus: true});
      };
      var save = function() {
        console.log(this);
        // var aHTML = $('.click2edit').code(); //save HTML If you need(aHTML: array).
        // $('.click2edit').destroy();
      };      


      // this.$(".rating_box").on('hover', function () {
      // 	// console.log(this.id);
      // 	// console.log("mouserover");
      // });

      // this.$(".rating_box").on('mouseout',function () {
      // 	// console.log("mouserout");
      // });

      // if (typeof(termifier) === undefined) {
      //   // console.log("termifier undefined");
      // } else {
      //   // console.log("termifier defined");
      //   this.$(".rating_box").termifier('comment');
      // }

      return this;
    }
  });

  // return {
  //   initialize: reviewView,
  // }
  return reviewView;
});
