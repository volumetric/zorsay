define(['Backbone', 'bootstrap', 'summernote', 'models/zs_answer', 'models/zs_answer_collection', 'views/zs_answer_view', 'views/zs_notify_view'], function(B, b, s, zsAnswer, zsAnswerCollection, zsAnswerView, zsNotifyView) {
  console.log("inside zs_answer_handling_view")

  var zsAnswerHandlingView = Backbone.View.extend({
    el: 'body',

    events: {
      "click .question-answer-btn": "question_answer",
    },

    // user_info: {
    //  //#TODO  get user_info from navbar or session or something and add it to onCommmeentAdded() function.
    // },

    initialize: function(args) {
      console.log("zs answer handling view initialized");

      zsNotifyView = new zsNotifyView();
      
      var zsAnswerCollection_var = new zsAnswerCollection();
      zsAnswerCollection_var.url = args.answer_url;

      uinfo = JSON.parse($("#user_info_div").text());
      // console.log(uinfo);
      this.user_info = uinfo;
      // this.user_info = args.user_info;

      this.answer_collection = zsAnswerCollection_var;
      // zsAnswerCollection_var.fetch();

      this.answer_collection.on('add', this.onAnswerAdded, this);
      this.answer_collection.on('reset', this.onAnswerCollectionReset, this);

    },

    onAnswerCollectionReset: function(answer_collection) {
      // console.log("reset");
      var that = this;
      answer_collection.each(function (model) {
        that.onAnswerAdded(model);
      });
      // console.log("2");
    },

    onAnswerAdded: function(answer) {
      // console.log("added");
      // if (!review.pscategory)
      //   review.pscategory = "n/a";

      // console.log("inside onAnswerAdded");
      // console.log(JSON.stringify(answer));
      
      // var reviewHtml = (new ReviewView({ model: review })).render().el;
      var answerHtml = (new zsAnswerView({ model: answer, user_info: this.user_info })).render().el;
      // console.log(answerHtml);
      // console.log("4");
      // $(answerHtml).prependTo('.answer_list').hide().fadeIn('slow');
      
      $(answerHtml)
      .prependTo('.answer_list')
      .css('opacity', 0.0)
      .css('background-color', 'rgb(240, 236, 135)')
      // .css('background-color', '#ffff00')
      .animate({
        'opacity': 1.0,
      }, 1000, function(){ $(this).css('background-color', '#ffffff') });

      // $('.zs_answer_count span') = $('.zs_answer_count span').text();
      var ac = $('.zs_answer_count h3 span').text();
      // console.log(ac);
      new_ac = parseInt(ac) + 1;
      // console.log(new_ac);
      $('.zs_answer_count h3 span').text(new_ac);

      // console.log("3");
    },

    question_answer: function() {
      console.log("inside question_answer");

      // Notify Loading...
      zsNotifyView.nv_show(1);
      
      parent_str = this.$(".post-div").attr("id");

      answer_obj = {
        content_text: this.$(".answer_input_editable").code(),
        // parent_name: parent_str.split('_')[0],
        question_id: parent_str.split('_')[1],
        anon: false,
      }

      // console.log(parent_str);
      // console.log(answer_obj);
      // #TODO do more testing for this and add more rules here about the structure of acceptable answers.
      empty_content_text = 
      /^(<div>(<br>|\s|\&nbsp\;)*<\/div>)*$/.test(answer_obj.content_text) ||
      /^(<p>(<br>|\s|\&nbsp\;)*<\/p>)*$/.test(answer_obj.content_text) ||
      /^(<br>|\s|\&nbsp\;)*$/.test(answer_obj.content_text);

      // if (answer_obj.content_text.length > 0) {
      if (!empty_content_text) {
        // console.log("not empty");
        // that = this;
        // $.post('/answer', answer_obj, function(data){
        //   that.answer_collection.add(new zsAnswer(answer_obj));
        //   that.$(".add-answer .answer-content").val('');
        // });

        that = this;
        $.ajax({
          type: 'POST',
          url: '/answer',
          data: answer_obj,
          success: function(answer_data, status, jqxhr) {
            // that.answer_collection.add(new zsAnswer(answer_obj));
            that.answer_collection.add(new zsAnswer(answer_data));
            
            that.$(".answer_input_editable").code("");
            that.$(".answer_input_editable").destroy();

            zsNotifyView.nv_hide(1);
            // zsNotifyView.nv_show(1, '<div class="btn-success zs_notify_html_message"><b>Thanks you for your answer!</b></div>', 2000);
          },
          error: function(jqxhr, status) {
            // #TODO show some message to user
            // console.log(jqxhr.status, status);
            zsNotifyView.nv_show(1, jqxhr.responseText);
          },
        });

      } else {
        // console.log("empty answer");
        // zsNotifyView.nv_show(1, "<b>Answer Cannot be Empty.</b>", 2000);
        zsNotifyView.nv_show(1, '<div class="btn-warning zs_notify_html_message"><b>Your Answer cannot be empty.</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
      }

    },

    render: function() {
      return this;
    }

  });

  return zsAnswerHandlingView;
});