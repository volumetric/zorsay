define(['Backbone', 'bootstrap', 'summernote', 'views/zs_notify_view', 'views/zs_access_control_view'], function(B, b, s, zsNotifyView, zsAccessControlView) {
  console.log("inside zs_single_question_view")
  var zsSingleQuestionView = Backbone.View.extend({
    el: 'body',

    events: {
      "click #question_title_edit a": "question_edit",
      // "click #question_title_edit.editor_opened a": "question_save",
      "click #question_text_edit a": "question_edit",
      // "click #question_text_edit.editor_opened a": "question_save",
      "click #answer_edit a": "answer_edit",
      
      "click #comment_text_edit a": "comment_edit",


      // "click #question_text_edit.editor_opened a": "question_save",

      // $('.note-image-input').on("change", this.editor_s3_upload);
      
      // "change .note-image-input": "editor_s3_upload",

      // "click .question-div .zs_question_fav": "zs_question_fav",
      // "click .question-div .zs_question_upvote": "zs_question_upvote",
      // "click .question-div .zs_question_downvote": "zs_question_downvote",
      // "click .question-div .zs_comment_count": "zs_post_toggle_comments",

      // "click .question-div .zs_comment_count": "zs_toggle_comments",


      // "click .question-div .zs_question_fav": "zs_post_fav",
      // "click .question-div .zs_question_upvote": "zs_post_upvote",
      // "click .question-div .zs_question_downvote": "zs_post_downvote",

      // "click .post-div .zs_post_fav": "zs_post_fav",
      // "click .post-div .zs_post_upvote": "zs_post_upvote",
      // "click .post-div .zs_post_downvote": "zs_post_downvote",
      // "click .post-div .zs_toggle_comments": "zs_post_toggle_comments",

      // #TODO remove this event binding after replacing classes
      // "click .post-div .zs_comment_count": "zs_toggle_comments",
    },

    initialize: function(args) {
      console.log("zs single question view initialized")
      zsNotifyView = new zsNotifyView();
      zsAccessControlView = new zsAccessControlView();
      // this.post_pub_id = args.post_pub_id;

      this.$(".answer_input_editable").on("focus", function(e){
        
        // this.$(".answer_input_editable").summernote({
        $(e.target).summernote({
          // height: 120,
          focus: true,
          toolbar: [
            ['style', ['style']], // no style button
            ['style', ['bold', 'italic', 'underline']],
            // ['fontsize', ['fontsize']],
            // ['color', ['color']],
            ['para', ['ul', 'ol']],
            // ['height', ['height']],
            ['insert', ['picture', 'video', 'link']], // no insert buttons
            // ['table', ['table']], // no table button
            // ['help', ['help']] //no help button
          ],
        });

      });
    },

    // zs_toggle_comments: function(e) {
    //   // console.log("zs_toggle_comments");
    //   // console.log($(e.target).closest(".post-div"));
    //   // console.log($(e.target).closest(".post-div").find("#comment-container"));
    //   // console.log($(e.target).closest(".post-div").find(".comment-container-wrap"));
    //   // console.log("zs_toggle_comments");

    //   // $(e.target).closest(".post-div").find("#comment-container").toggle();

    //   var comment_element = $(e.target).closest(".post-div").find(".comment-container-wrap");
      
    //   // console.log(comment_element);
    //   comment_element.toggle();
      
    //   // this.$("#comment-container").toggle();
    //   return false;
    // },

    // zs_question_upvote: function(e) {
    //   console.log("Inside zs_question_upvote");
    //   question_id = $(".post-div").attr("id").split("_")[1];

    //   $.ajax({
    //     type: 'POST',
    //     url: '/question/'+question_id+'/meta/upvote',
    //     success: function(data, status, jqxhr) {
    //       // console.log(data);
          
    //       // var uv = $('.zs_question_upvote');
    //       // var dv = $('.zs_question_downvote');
    //       // var vc = $('.zs_question_votecount');

    //       var parent_div = $(e.target).closest(".post-div");

    //       var uv = $(parent_div.find('.zs_question_upvote'));
    //       var dv = $(parent_div.find('.zs_question_downvote'));
    //       var vc = $(parent_div.find('.zs_question_votecount'));
          
    //       if (dv.hasClass("vote-down-on")){
    //         vc.text(parseInt(vc.text()) + 1);
    //       }

    //       if (!uv.hasClass("vote-up-on")){
    //         vc.text(parseInt(vc.text()) + 1);
    //       } else {
    //         vc.text(parseInt(vc.text()) - 1);
    //       }

    //       uv.toggleClass("vote-up-off").toggleClass("vote-up-on");
    //       dv.removeClass("vote-down-on").addClass("vote-down-off");

    //     },
    //     error: function(jqxhr, status) {
    //       console.log(status);
    //     },
    //   });
    //   return false;
    // },

    // zs_question_downvote: function(e) {
    //   // console.log("Inside zs_question_downvote");
    //   question_id = $(".post-div").attr("id").split("_")[1];

    //   $.ajax({
    //     type: 'POST',
    //     url: '/question/'+question_id+'/meta/downvote',
    //     success: function(data, status, jqxhr) {
    //       // console.log(data);
          
    //       // var dv = $('.zs_question_downvote');
    //       // var uv = $('.zs_question_upvote');
    //       // var vc = $('.zs_question_votecount');

    //       var parent_div = $(e.target).closest(".post-div");

    //       var uv = $(parent_div.find('.zs_question_upvote'));
    //       var dv = $(parent_div.find('.zs_question_downvote'));
    //       var vc = $(parent_div.find('.zs_question_votecount'));
          
    //       if (uv.hasClass("vote-up-on")){
    //         vc.text(parseInt(vc.text()) - 1);
    //       }

    //       if (!dv.hasClass("vote-down-on")){
    //         vc.text(parseInt(vc.text()) - 1);
    //       } else {
    //         vc.text(parseInt(vc.text()) + 1);
    //       }

    //       dv.toggleClass("vote-down-off").toggleClass("vote-down-on");
    //       uv.removeClass("vote-up-on").addClass("vote-up-off");

    //     },
    //     error: function(jqxhr, status) {
    //       console.log(status);
    //     },
    //   });
    //   return false;
    // },

    // zs_question_fav: function() {
    //   // console.log("Inside zs_question_downvote");
    //   question_id = $(".post-div").attr("id").split("_")[1];

    //   $.ajax({
    //     type: 'POST',
    //     url: '/question/'+question_id+'/meta/favourite',
    //     success: function(data, status, jqxhr) {
    //       // console.log(data);
          
    //       var fa = $('.zs_question_fav');
    //       var fc = $('.zs_question_favcount');

    //       if (!fa.hasClass("star-on")){
    //         fc.text(parseInt(fc.text()) + 1);
    //       } else {
    //         fc.text(parseInt(fc.text()) - 1);
    //       }

    //       fa.toggleClass("star-off").toggleClass("star-on");

    //     },
    //     error: function(jqxhr, status) {
    //       console.log(status);
    //     },
    //   });
    //   return false;
    // },



    // COMMENT, UPVOTE, DOWNVOTE and FAVOURITE for a generic "Post"

    // zs_post_toggle_comments: function(e) {
    //   // console.log("inside zs_post_toggle_comments");
    //   // console.log(e.target);

    //   var parent_div = $(e.target).closest(".post-div");
    //   var comment_element = parent_div.find(".comment-container-wrap");

    //   if (comment_element.hasClass("comments-populated")) {
    //     comment_element.toggle();
    //   } else {
        
    //     post_id = parent_div.attr("id").split("_")[1];
    //     post_name = parent_div.attr("post");
    //     post_title = "dummy_question_title";

    //     if (post_name.toLowerCase() == "question")
    //       var comment_url = '/'+post_name+'/'+post_id+'/'+post_title+'/comments';
    //     else
    //       var comment_url = '/'+post_name+'/'+post_id+'/comments';

    //     console.log(comment_url);

    //     comment_element.load(comment_url, function(res, status, jqxhr){
    //       comment_element.addClass("comments-populated");  
    //     });
    //   }
    //   return false;
    // },

    // zs_post_upvote: function(e) {
    //   console.log("Inside zs_post_upvote");

    //   var parent_div = $(e.target).closest(".post-div");
    //   post_id = parent_div.attr("id").split("_")[1];
    //   post_name = parent_div.attr("post");

    //   $.ajax({
    //     type: 'POST',
    //     url: '/'+post_name+'/'+post_id+'/meta/upvote',
    //     success: function(data, status, jqxhr) {
    //       // console.log(data);
          
    //       // var uv = $('.zs_post_upvote');
    //       // var dv = $('.zs_post_downvote');
    //       // var vc = $('.zs_post_votecount');

    //       // var parent_div = $(e.target).closest(".post-div");

    //       var uv = $(parent_div.find('.zs_post_upvote'));
    //       var dv = $(parent_div.find('.zs_post_downvote'));
    //       var vc = $(parent_div.find('.zs_post_votecount'));
          
    //       if (dv.hasClass("vote-down-on")){
    //         vc.text(parseInt(vc.text()) + 1);
    //       }

    //       if (!uv.hasClass("vote-up-on")){
    //         vc.text(parseInt(vc.text()) + 1);
    //       } else {
    //         vc.text(parseInt(vc.text()) - 1);
    //       }

    //       uv.toggleClass("vote-up-off").toggleClass("vote-up-on");
    //       dv.removeClass("vote-down-on").addClass("vote-down-off");

    //     },
    //     error: function(jqxhr, status) {
    //       console.log(status);
    //     },
    //   });
    //   return false;
    // },

    // zs_post_downvote: function(e) {
    //   // console.log("Inside zs_post_downvote");

    //   var parent_div = $(e.target).closest(".post-div");
    //   post_id = parent_div.attr("id").split("_")[1];
    //   post_name = parent_div.attr("post");

    //   $.ajax({
    //     type: 'POST',
    //     url: '/'+post_name+'/'+post_id+'/meta/downvote',
    //     success: function(data, status, jqxhr) {
    //       // console.log(data);
          
    //       // var dv = $('.zs_post_downvote');
    //       // var uv = $('.zs_post_upvote');
    //       // var vc = $('.zs_post_votecount');

    //       // var parent_div = $(e.target).closest(".post-div");

    //       var uv = $(parent_div.find('.zs_post_upvote'));
    //       var dv = $(parent_div.find('.zs_post_downvote'));
    //       var vc = $(parent_div.find('.zs_post_votecount'));
          
    //       if (uv.hasClass("vote-up-on")){
    //         vc.text(parseInt(vc.text()) - 1);
    //       }

    //       if (!dv.hasClass("vote-down-on")){
    //         vc.text(parseInt(vc.text()) - 1);
    //       } else {
    //         vc.text(parseInt(vc.text()) + 1);
    //       }

    //       dv.toggleClass("vote-down-off").toggleClass("vote-down-on");
    //       uv.removeClass("vote-up-on").addClass("vote-up-off");

    //     },
    //     error: function(jqxhr, status) {
    //       console.log(status);
    //     },
    //   });
    //   return false;
    // },

    // zs_post_fav: function(e) {
    //   // console.log("Inside zs_post_downvote");

    //   var parent_div = $(e.target).closest(".post-div");
    //   post_id = parent_div.attr("id").split("_")[1];
    //   post_name = parent_div.attr("post");

    //   $.ajax({
    //     type: 'POST',
    //     url: '/'+post_name+'/'+post_id+'/meta/favourite',
    //     success: function(data, status, jqxhr) {
    //       // console.log(data);
          
    //       // var fa = $('.zs_post_fav');
    //       // var fc = $('.zs_post_favcount');

    //       // var parent_div = $(e.target).closest(".post-div");

    //       var fa = $(parent_div.find('.zs_post_fav'));
    //       var fc = $(parent_div.find('.zs_post_favcount'));

    //       if (!fa.hasClass("star-on")){
    //         fc.text(parseInt(fc.text()) + 1);
    //       } else {
    //         fc.text(parseInt(fc.text()) - 1);
    //       }

    //       fa.toggleClass("star-off").toggleClass("star-on");

    //     },
    //     error: function(jqxhr, status) {
    //       console.log(status);
    //     },
    //   });
    //   return false;
    // },

    // editor_s3_upload: function(e){
    //   e.preventDefault();
    //   console.log("inside editor_s3_upload function");

    //   changed_element = $($('.note-image-input').parent());
    //   changed_status_element = $(changed_element.find("h5")[0]);

    //   var s3upload = new S3Upload({
    //       // file_dom_selector: '#user_profile_img_edit',
    //       file_dom_selector: '.note-image-input',
    //       s3_sign_put_url: '/sign_s3',
    //       onProgress: function(percent, message) {
    //           console.log("onProgress");
    //           changed_status_element.html(percent + '% ' + message);
    //       },
    //       onFinishS3Put: function(public_url) {
    //           console.log("onFinishS3Put", public_url);
    //           // $('#user_profile_img_status').html('Upload completed. Uploaded to: '+ public_url);

    //           // $('#user_profile_img_status').html('');
    //           // $('#user_profile_img_edit').hide();
    //           // $('#user_profile_img_submit').show();
    //           // $('#user_profile_img_cancel').show();

    //           // $("#user_profile_img_avatar_url").val(public_url);
    //           // $("#user_profile_img_preview").html('<img src="'+public_url+'" style="width:300px;" />');

    //           // console.log(public_url);
    //           // $("#user_profile_img_preview").attr("src", public_url);
              
    //           changed_status_element.html(public_url);              
    //           return public_url;
    //       },
    //       onError: function(status, jqxhr) {
    //           console.log("onError", status);
    //           // console.log(jqxhr.status);
    //           // $('#user_profile_img_status').html('Upload error: ' + status);
    //           changed_status_element.html('Upload error: ' + status);
    //           return "";
    //       }
    //   });
    // },

    open_editor: function(editable, type) {
      if (type == 0) {
        // open editor without a toolbar
        editable.summernote({
          focus: true,
          toolbar: false,
        })
        return;
      } else if (type == 1) {
        // open editor with a small toolbar
        if (zsAccessControlView.isAdmin() || zsAccessControlView.isStaff()) {
            editable.summernote({
              focus: true,
              toolbar: [
                ['style', ['style']],
                ['style', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']],
                ['insert', ['picture', 'video', 'link']],
                ['misc', ['codeview', 'fullscreen']],
              ],
            })    
        } else {
            editable.summernote({
              focus: true,
              toolbar: [
                ['style', ['style']],
                ['style', ['bold', 'italic', 'underline']],
                ['para', ['ul', 'ol']],
                ['insert', ['picture', 'video', 'link']],
              ],
            })
        }
        return;
      } else {
        if (zsAccessControlView.isAdmin() || zsAccessControlView.isStaff()) {
            editable.summernote({
              // height: 300,
              focus: true,
              toolbar: [
                ['style', ['style']],
                ['style', ['bold', 'italic', 'underline']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['picture', 'video', 'link']],
                // ['table', ['table']], // no table button
                // ['help', ['help']] //no help button
                ['misc', ['codeview', 'fullscreen']],
              ],
            });
        } else {
            editable.summernote({
              // height: 300,
              focus: true,
              toolbar: [
                ['style', ['style']],
                ['style', ['bold', 'italic', 'underline']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['height', ['height']],
                ['insert', ['picture', 'video', 'link']],
                // ['table', ['table']], // no table button
                // ['help', ['help']] //no help button
              ],
            });

        }
        return;
      }
      
    },

    question_edit: function(e) {
      // console.log("inside question_edit");
      zsNotifyView.nv_show(1);
      var clicked_op = $(e.target).text().toLowerCase();
      // console.log(clicked_op);

      var clicked_element = $(e.target).parent();
      // console.log(clicked_element);
      // console.log(clicked_element.attr("id"));

      var edit_target_class = clicked_element.attr("id")+"_content";

      var post_div = clicked_element.closest(".post-div");
      var post_type = post_div.attr("id").split("_")[0].toLowerCase() ;
      var post_id = post_div.attr("id").split("_")[1] ;

      // console.log(edit_target_class);
      var edit_target_element = post_div.find("."+edit_target_class);
      
      if (clicked_element.hasClass("editor_opened")) {
        // do save operations
        // should not destroy it until a update confirmation comes back
        
        if (clicked_op == "cancel") {
            edit_target_element.code(edit_target_element.html());

            clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
            edit_target_element.destroy();

            zsNotifyView.nv_hide(1);
        } else {
            updated_question = this.getQuestionEditObj(edit_target_element);
            // console.log(updated_question);

            that = this;
            $.ajax({
              type: 'POST',
              url: '/'+post_type+'/'+post_id,
              data: updated_question,
              success: function(data, status, jqxhr) {
                // console.log("question edited successfully")
                
                clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
                edit_target_element.destroy();
                zsNotifyView.nv_hide(1);
              },
              error: function(jqxhr, status) {
                // console.log(jqxhr.status, status);
                // #TODO display the html message sent by the server
                zsNotifyView.nv_show(1, jqxhr.responseText);
              },
            });
        }

        // clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
      } else {
        // do edit operations

        // #TODO disallow "html" in "question_title_edit_content"
        // both in UX and backend.
        if (edit_target_class == "question_title_edit_content")
          this.open_editor(edit_target_element, 0);
        else
          this.open_editor(edit_target_element, 1);

        clicked_element.toggleClass("editor_opened").html("<a>Cancel</a> <a>Save</a>");
        zsNotifyView.nv_hide(1);
      }
      // clicked_element.addClass("editor_opened").html("<a>Save</a>");      
    },

    answer_edit: function(e) {
      // console.log("inside answer_edit");
      zsNotifyView.nv_show(1);

      var clicked_op = $(e.target).text().toLowerCase();
      var clicked_element = $(e.target).parent();
      // console.log(clicked_element);
      // console.log(clicked_element.attr("id"));

      edit_target_class = clicked_element.attr("id")+"_content";
      // console.log(edit_target_class);

      post_div = clicked_element.closest(".post-div");
      post_type = post_div.attr("id").split("_")[0].toLowerCase() ;
      post_id = post_div.attr("id").split("_")[1] ;

      // console.log(post_div);
      var edit_target_element = post_div.find("."+edit_target_class);
      // console.log(edit_target_element);
      
      if (clicked_element.hasClass("editor_opened")) {
        // #TODO Check for empty post, same while posting new post and show "Post cannot be empty" message in zs_notify
        // do save operations
        // should not destroy it until a update confirmation comes back
        
        // console.log(edit_target_element);

        if (clicked_op == "cancel") {
            edit_target_element.code(edit_target_element.html());

            clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
            edit_target_element.destroy();
            
            zsNotifyView.nv_hide(1);
        } else {
            updated_answer = this.getAnswerEditObj(edit_target_element);
            // console.log(updated_answer);


            that = this;
            $.ajax({
              type: 'POST',
              url: '/'+post_type+'/'+post_id,
              data: updated_answer,
              success: function(data, status, jqxhr) {
                // console.log("answer edited successfully")
                
                clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
                edit_target_element.destroy();

                zsNotifyView.nv_hide(1);
              },
              error: function(jqxhr, status) {
                // console.log(jqxhr.status, status);
                // #TODO display the html message sent by the server
                zsNotifyView.nv_show(1, jqxhr.responseText);
              },
            });
        }

        // #TODO remove this
        // edit_target_element.destroy();
        // clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
      } else {
        // do edit operations
        this.open_editor(edit_target_element, 1);
        clicked_element.toggleClass("editor_opened").html("<a>Cancel</a> <a>Save</a>");
        zsNotifyView.nv_hide(1);
      }
      // clicked_element.addClass("editor_opened").html("<a>Save</a>");      
    },

    comment_edit: function(e) {
      zsNotifyView.nv_show(1);

      var clicked_op = $(e.target).text().toLowerCase();
      var clicked_element = $(e.target).parent();

      edit_target_class = clicked_element.attr("id")+"_content";

      post_div = clicked_element.closest(".post-div");
      post_type = post_div.attr("id").split("_")[0].toLowerCase() ;
      post_id = post_div.attr("id").split("_")[1] ;

      var edit_target_element = post_div.find("."+edit_target_class);
      
      if (clicked_element.hasClass("editor_opened")) {
        updated_comment = this.getCommentEditObj(edit_target_element);
        // console.log(updated_comment);

        if (clicked_op == "cancel") {
            // console.log(edit_target_element.attr("data-orig"));
            // console.log("--------------------------------------------");
            // console.log(edit_target_element.html());

            edit_target_element.html(edit_target_element.attr("data-orig"));

            clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
            edit_target_element.toggleClass("comment-content").toggleClass("full-comment").attr("contenteditable", false);
            
            zsNotifyView.nv_hide(1);
        } else {
            that = this;
            $.ajax({
              type: 'POST',
              url: '/'+post_type+'/'+post_id,
              data: updated_comment,
              success: function(data, status, jqxhr) {
                // console.log("comment edited successfully")
                
                clicked_element.toggleClass("editor_opened").html("<a>Edit</a>");
                // edit_target_element.destroy();
                edit_target_element.toggleClass("comment-content").toggleClass("full-comment").attr("contenteditable", false);
                zsNotifyView.nv_hide(1);
              },
              error: function(jqxhr, status) {
                zsNotifyView.nv_show(1, jqxhr.responseText);
              },
            });
        }
      } else {
        // this.open_editor(edit_target_element, 1);
        var orig = edit_target_element.html();
        edit_target_element.attr("data-orig", orig);

        edit_target_element.toggleClass("comment-content").toggleClass("full-comment").attr("contenteditable", true);
        clicked_element.toggleClass("editor_opened").html("<a>Cancel</a> <a>Save</a>");
        zsNotifyView.nv_hide(1);
      }   
    },


    // question_save: function(e) {
    //   console.log("inside question_save");

    //   var clicked_element = $(e.target).parent();
    //   // console.log(clicked_element);
    //   // console.log(clicked_element.attr("id"));

    //   save_target_class = clicked_element.attr("id")+"_content";

    //   post_div = clicked_element.closest(".post-div");
    //   post_id = post_div.attr("id"); // e.g.. "Queston_23"

    //   // console.log(save_target_class);
    //   var save_target_element = post_div.find("."+save_target_class);
      
    //   // should not destroy it until a update confirmation comes back
    //   save_target_element.destroy();
    //   console.log(save_target_element);

    //   updated_question = this.getQuestionEditObj(save_target_element);
    //   console.log(updated_question);

    //   clicked_element.removeClass("editor_opened").html("<a>Edit</a>");
    // },

    getQuestionEditObj: function(target_element) {
      var key = target_element.attr("key");
      var uq = {}, val;

      if (key == "content_title"){
        // val = target_element.text().trim();
        val = $("<div></div>").html(target_element.code().trim()).text();
      } else if (key == "content_text") {
        val = target_element.code().trim();
      // } else if (key == "") {
        // _seller _pro_cat _ser_cat _pro _ser
      } else {
        return;
      }

      uq[key] = val;
      // console.log(uq);
      return uq;
    },

    getAnswerEditObj: function(target_element) {
      var key = target_element.attr("key");
      var ua = {}, val;

      if (key == "content_text") {
        val = target_element.code().trim();
      // } else if (key == "") {
        // do it for _seller _pro_cat _ser_cat _pro _ser tags
      } else {
        return;
      }

      ua[key] = val;
      // console.log(ua);
      return ua;
    },

    getCommentEditObj: function(target_element) {
      var key = target_element.attr("key");
      var ua = {}, val;

      if (key == "content_text") {
        val = target_element.code().trim();
      // } else if (key == "") {
        // do it for _seller _pro_cat _ser_cat _pro _ser tags
      } else {
        return;
      }

      ua[key] = val;
      // console.log(ua);
      return ua;
    },

    render: function() {
      // console.log("in all_question_view render function");
      return this;
    }

  });

  return zsSingleQuestionView;
});