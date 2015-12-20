define(['Backbone', 'bootstrap', 'summernote', 'models/zs_comment', 'models/zs_comment_collection', 'views/zs_comment_view', 'views/zs_notify_view'], function(B, b, s, zsComment, zsCommentCollection, zsCommentView, zsNotifyView) {
  // console.log("inside zs_comment_handling_view");

  var zsCommentHandlingView = Backbone.View.extend({
    el: 'body',

    events: {
      // "click .shopex-comment-btn": "shopex_comment",
      "click .shopex-comment-btn": "zs_post_comment",

      // "click .question-div .zs_comment_count": "zs_post_toggle_comments",
      "click .post-div .zs_comment_count": "zs_post_toggle_comments",
      "click .post-div .zs_toggle_comments": "zs_post_toggle_comments",
    },

    initialize: function(args) {
      console.log("zs comment handling view initialized");

      zsNotifyView = new zsNotifyView();

      // this.note_div_left = $("#zs_global_notification_left");
      // this.note_div_right = $("#zs_global_notification_right");
      
      var zsCommentCollection_var = new zsCommentCollection();
      zsCommentCollection_var.url = args.comment_url;

      uinfo = JSON.parse($("#user_info_div").text());
      // console.log(uinfo);
      this.user_info = uinfo;
      // this.user_info = args.user_info;

      this.comment_collection = zsCommentCollection_var;
      // zsCommentCollection_var.fetch();

      this.comment_collection.on('add', this.onCommentAdded, this);
      this.comment_collection.on('reset', this.onCommentCollectionReset, this);

    },

    onCommentCollectionReset: function(comment_collection) {
      // console.log("reset");
      var that = this;
      comment_collection.each(function (model) {
        that.onCommentAdded(model);
      });
      // console.log("2");
    },

    onCommentAdded: function(comment) {
      // console.log("added");
      // if (!review.pscategory)
      //   review.pscategory = "n/a";
      // console.log("inside onCommentAdded");
      // console.log(comment);
      // console.log("comment_collection:", comment.comment_collection);
      // console.log("options:", options);
      // console.log(options);
      // console.log(comment.attributes.comment_list_selector);
      // console.log(comment.comment_data);

      // console.log(JSON.stringify(comment.comment_data));
      
      // var reviewHtml = (new ReviewView({ model: review })).render().el;
      var commentHtml = (new zsCommentView({ model: comment, user_info: this.user_info })).render().el;
      // console.log(commentHtml);
      // console.log("4");
      // $(commentHtml).prependTo('.comment_list').hide().fadeIn('slow');
      // console.log("11111")
      $(commentHtml)
      // .prependTo('.comment_list')
      .prependTo(comment.attributes.comment_list_selector)
      .css('opacity', 0.0)
      // .css('background-color', 'rgb(240, 236, 135)')
      // .css('background-color', '#ffff00')
      .css('background-color', '#EAF2C2')
      .animate({
        'opacity': 1.0,
      }, 1000, function(){ $(this).css('background-color', '#ffffff') });
      // console.log("22222")

      // $('.zs_comment_count span') = $('.zs_comment_count span').text();
      var cc = $('.zs_comment_count span').text();
      new_cc = parseInt(cc.substr(1, cc.length - 2)) + 1;
      // console.log(new_cc);
      // console.log("33333")

      $('.zs_comment_count span').text('('+new_cc+')');
      // console.log("44444")

      // console.log("3");
    },

    shopex_comment: function(e) {
      // console.log("inside shopex_comment");
      zsNotifyView.nv_show(1);
      parent_str = this.$(".post-div").attr("id");

      comment_obj = {
        // content_text: this.$(".add-comment .comment-content").val(),
        content_text: this.$(".add-comment .comment-content").html(),
        parent_name: parent_str.split('_')[0],
        parent_id: parent_str.split('_')[1],
        anon: false,
      }

      // console.log(parent_str);
      // console.log(comment_obj);
      if (comment_obj.content_text.length > 0) {

        // that = this;
        // $.post('/comment', comment_obj, function(data){
        //   that.comment_collection.add(new zsComment(comment_obj));
        //   that.$(".add-comment .comment-content").val('');
        // });

        that = this;
        $.ajax({
          type: 'POST',
          url: '/comment',
          data: comment_obj,
          success: function(comment_data, status, jqxhr) {
            // console.log(jqxhr.status, status);
            // that.comment_collection.add(new zsComment(comment_obj));
            that.comment_collection.add(new zsComment(comment_data));
            
            // that.$(".add-comment .comment-content").val(''); 
            that.$(".add-comment .comment-content").html('');
            zsNotifyView.nv_hide(1);
          },
          error: function(jqxhr, status) {
            // #TODO show some message to user
            // console.log(jqxhr.status, status);
            zsNotifyView.nv_show(1, jqxhr.responseText);
          },
        });

      } else {
        // console.log("empty comment");
      }

    },

    zs_post_toggle_comments: function(e) {
      console.log("inside zs_post_toggle_comments");
      // console.log(e.target);

      // zsNotifyView.nv_show(1, "<b>Inner Loading...</b>", 1000);
      // zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      var comment_element = parent_div.find(".comment-container-wrap");

      if (comment_element.hasClass("comments-populated")) {
        comment_element.toggle();
        // zsNotifyView.nv_hide(1);
      } else {
        zsNotifyView.nv_show(1);
        
        post_permalink = parent_div.find("#permalink a").attr("href");
        // post_id = parent_div.attr("id").split("_")[1];
        // post_name = parent_div.attr("post");
        // post_title = "dummy_question_title";

        // if (post_name.toLowerCase() == "question")
        //   var comment_url = '/'+post_name+'/'+post_id+'/'+post_title+'/comments';
        // else
        //   var comment_url = '/'+post_name+'/'+post_id+'/comments';
          
        var comment_url = post_permalink+'/comments';

        // console.log(comment_url);

        comment_element.load(comment_url, function(res, status, jqxhr){
          if (status == "error"){
            zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
          } else {
            comment_element.addClass("comments-populated");
            zsNotifyView.nv_hide(1);
          }
        });
      }
      return false;
    },

    zs_post_comment: function(e) {
      console.log("inside post_comment");
      
      zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      post_model = parent_div.attr("id").split("_")[0];
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      comment_counter_element = $(parent_div.find('.zs_toggle_comments span'));


      // comment_list_element = $(parent_div.find('.comment_list'));      
      comment_list_selector = "#"+parent_div.attr("id")+" .comment_list";

      post_add_comment_element = $(parent_div.find('.add-comment .comment-content'));
      
      // parent_str = this.$(".post-div").attr("id");

      comment_obj = {
        // content_text: this.$(".add-comment .comment-content").val(),
        content_text: post_add_comment_element.html().trim(),
        parent_name: post_model,
        parent_id: post_id,
        anon: false,
      }

      // console.log(parent_str);
      // console.log("### COMMENT ###");
      // console.log(comment_obj);
      // console.log("### COMMENT ###");
      // #TODO do more testing for this and add more rules here about the structure of acceptable answers.
      empty_content_text = 
      /^(<div>(<br>|\s|\&nbsp\;)*<\/div>)*$/.test(comment_obj.content_text) ||
      /^(<p>(<br>|\s|\&nbsp\;)*<\/p>)*$/.test(comment_obj.content_text) ||
      /^(<br>|\s|\&nbsp\;)*$/.test(comment_obj.content_text);

      // if (comment_obj.content_text.length > 0) {
      if (!empty_content_text) {
        // that = this;
        // $.post('/comment', comment_obj, function(data){
        //   that.comment_collection.add(new zsComment(comment_obj));
        //   that.$(".add-comment .comment-content").val('');
        // });

        that = this;
        $.ajax({
          type: 'POST',
          url: '/comment',
          data: comment_obj,
          success: function(comment_data, status, jqxhr) {
            // console.log(jqxhr.status, status);
            // that.comment_collection.add(new zsComment(comment_obj));

            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>");
            // console.log(comment_list_element);
            // console.log(comment_list_selector);
            // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>");        
            
            comment_data.comment_list_selector = comment_list_selector;
            that.comment_collection.add(new zsComment(comment_data));
        
            // that.comment_collection.add(
            //   {
            //     comment_data: new zsComment(comment_data),
            //     comment_list_element: comment_list_element,
            //   }
            // );


            
            // that.$(".add-comment .comment-content").val(''); 
            post_add_comment_element.html('');

            // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$");
            // console.log(comment_counter_element);

            comment_count = parseInt(comment_counter_element.text().substr(1, comment_counter_element.text().length - 2));

            // console.log(comment_count);

            
            comment_counter_element.text("("+(comment_count+1)+")");

            zsNotifyView.nv_hide(1);
            // zsNotifyView.nv_show(1, '<div class="btn-success zs_notify_html_message"><b>Posted your comment.</b></div>', 2000);
          },
          error: function(jqxhr, status) {
            // console.log(jqxhr.responseText);

            // console.log(jqxhr.status, status);
            // #TODO display the html message sent by the server
            zsNotifyView.nv_show(1, jqxhr.responseText);
          },
        });

      } else {
        // console.log("empty comment");
        // zsNotifyView.nv_show(1, "<b>Comment Cannot be Empty.</b>", 2000);
        zsNotifyView.nv_show(1, '<div class="btn-warning zs_notify_html_message"><b>Your Comment cannot be empty.</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);

      }

    },

    render: function() {
      // console.log("in all_shopex_view render function");
      return this;
    }

  });

  return zsCommentHandlingView;
});