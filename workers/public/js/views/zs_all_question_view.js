define(['Backbone', 'bootstrap', 'views/zs_notify_view'], function(B, b, zsNotifyView) {
  console.log("inside zs_all_question_view")

  var zsAllQuestionView = Backbone.View.extend({
    el: 'body',

    events: {
      // #TODO replace load more button click with page end scroll event
      "click .question-short-load-more": "load_more",
      "click .question_short_body.shrunk": "expand_question",
      // "click .question_short_body.expanded": "expand_question",
    },

    initialize: function() {
      console.log("zs all question view initialized");
      zsNotifyView = new zsNotifyView();
    },

    expand_question: function(e) {
      console.log("inside expand_question");
      // console.log(e.target);
      zsNotifyView.nv_show(1);

      var clicked_element = $(e.target);
      var parent_div = clicked_element.closest(".post-div");
      var element = parent_div.find("a.question_short_body");
      var post_permalink = parent_div.find("#permalink a").attr("href");
      // console.log(post_permalink);

      $.ajax({
        type: 'GET',
        url: post_permalink+'/html',
        success: function(data, status, jqxhr) {
          // console.log(jqxhr.status);
          // $(".question_short_list").append(data);
          if (data.question_data.content_text){
            // console.log("putting it in...");
            // console.log(data.question_data.content_text);
            element.html(data.question_data.content_text);
            element.removeClass("shrunk");
            element.removeAttr("href");
          }
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
        },
      });

      return false;
    },

    load_more: function() {
      zsNotifyView.nv_show(1);
      // console.log("load even more button clicked");
      //#TODO#DONE get more stuff and stuff it in the thing
      var post_short = $(".post-div.post-short");
      var lastId = $(post_short[post_short.length - 1]).attr("num");
      var limit = 20;
      var order = $(".question_short_list").attr("order");

      // console.log("lastId:", lastId);
      // console.log("limit:", limit);
      // console.log("order:", order);

      $.ajax({
        type: 'GET',
        url: '/questions/'+order+'/'+lastId+'/'+limit+'/html',
        success: function(data, status, jqxhr) {
          // console.log(jqxhr.status);
          $(".question_short_list").append(data);
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
        },
      });

    },

    render: function() {
      // console.log("in zs_all_question_view render function");
      return this;
    }

  });

  return zsAllQuestionView;
});