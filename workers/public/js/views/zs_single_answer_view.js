define(['Backbone', 'bootstrap', 'summernote', 'views/zs_notify_view'], function(B, b, s, zsNotifyView) {
  console.log("inside zs_single_answer_view")
  var zsSingleAnswerView = Backbone.View.extend({
    el: 'body',

    events: {
      // "click #answer_edit a": "answer_edit",
      // "click .ans-check-off": "accept_answer",      
      "click .ans-check-off span": "accept_answer",      
    },

    initialize: function(args) {
      console.log("zs single answer view initialized")
      zsNotifyView = new zsNotifyView();
      // this.post_pub_id = args.post_pub_id;
    },

    accept_answer: function(e) {
      // console.log("inside accept_answer");
      zsNotifyView.nv_show(1);

      var clicked_element = $(e.target).parent();
      // console.log(clicked_element);

      // edit_target_class = clicked_element.attr("id")+"_content";
      // console.log(edit_target_class);

      post_div = clicked_element.closest(".post-div");
      
      parent_type = post_div.attr("parent").split("_")[0].toLowerCase() ;
      parent_id = post_div.attr("parent").split("_")[1] ;

      // post_type = post_div.attr("post");
      post_id = post_div.attr("num");

      this_view = this;
      $.ajax({
        type: 'POST',
        url: '/'+parent_type+'/'+parent_id+'/meta/acceptanswer',
        data: {answer_id: post_id},
        success: function(data, status, jqxhr) {
          console.log("answer accepted successfully")

          clicked_element.toggleClass("ans-check-off").toggleClass("ans-check-on");
          $(".ans-check-off").hide();
          
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status, status);
          // #TODO display the html message sent by the server
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
        },
      });

      return false;
    },


    // answer_edit: function(e) {
    //   // console.log("inside answer_edit");
    //   zsNotifyView.nv_show(1);

    //   var clicked_element = $(e.target).parent();
    //   // console.log(clicked_element);
    //   // console.log(clicked_element.attr("id"));

    //   edit_target_class = clicked_element.attr("id")+"_content";
    //   console.log(edit_target_class);

    //   post_div = clicked_element.closest(".post-div");
    //   post_type = post_div.attr("id").split("_")[0].toLowerCase() ;
    //   post_id = post_div.attr("id").split("_")[1] ;

    //   console.log(post_div);
    //   var edit_target_element = post_div.find("."+edit_target_class);
    //   console.log(edit_target_element);
      
    //   if (clicked_element.hasClass("editor_opened")) {
    //     // #TODO Check for empty post, same while posting new post and show "Post cannot be empty" message in zs_notify
    //     // do save operations
    //     // should not destroy it until a update confirmation comes back
        
    //     // console.log(edit_target_element);
    //     updated_answer = this.getAnswerEditObj(edit_target_element);
    //     console.log(updated_answer);


    //     this_view = this;
    //     $.ajax({
    //       type: 'POST',
    //       url: '/'+post_type+'/'+post_id,
    //       data: updated_answer,
    //       success: function(data, status, jqxhr) {
    //         console.log("answer edited successfully")
            
    //         clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
    //         edit_target_element.destroy();

    //         zsNotifyView.nv_hide(1);
    //       },
    //       error: function(jqxhr, status) {
    //         // console.log(jqxhr.status, status);
    //         // #TODO display the html message sent by the server
    //         zsNotifyView.nv_show(1, "<b>"+jqxhr.status+"</b><a class='zs_global_notification_close' href='#'> X</a>");
    //       },
    //     });

    //     // #TODO remove this
    //     // edit_target_element.destroy();
    //     // clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
    //   } else {
    //     // do edit operations
    //     this.open_editor(edit_target_element, 1);
    //     clicked_element.toggleClass("editor_opened").html("<a>Save</a>");
    //     zsNotifyView.nv_hide(1);
    //   }
    //   // clicked_element.addClass("editor_opened").html("<a>Save</a>");      
    // },


    // getAnswerEditObj: function(target_element) {
    //   var key = target_element.attr("key");
    //   var ua = {}, val;

    //   if (key == "content_text") {
    //     val = target_element.code().trim();
    //   // } else if (key == "") {
    //     // do it for _seller _pro_cat _ser_cat _pro _ser tags
    //   } else {
    //     return;
    //   }

    //   ua[key] = val;
    //   // console.log(ua);
    //   return ua;
    // },

    render: function() {
      // console.log("in all_question_view render function");
      return this;
    }

  });

  return zsSingleAnswerView;
});