define(['Backbone', 'bootstrap', 'views/zs_notify_view'], function(B, b, zsNotifyView) {
  // console.log("inside zs_post_utility_handling_view")

  var zsPostUtilityHandlingView = Backbone.View.extend({
    el: 'body',

    events: {
      "click .post-div .zs_post_fav": "zs_post_fav",
      "click .post-div .zs_post_upvote": "zs_post_upvote",
      "click .post-div .zs_post_downvote": "zs_post_downvote",

      "click .post-div .zs_post_thank": "zs_post_thank",
      "click .post-div .zs_post_follow": "zs_post_follow",
      
      "click .post-div .zs_post_share": "zs_post_share",
      "click .post-div .zs_post_report": "zs_post_report",

      "click .zs_social_share" : "zs_social_share",
      
      "click #shopex_delete a": "zs_post_delete",
      "click #question_delete a": "zs_post_delete",
      "click #answer_delete a": "zs_post_delete",
      "click #comment_delete a": "zs_post_delete",

      // "click .zs_fb_share" : "zs_fb_share",
      // "click .zs_tw_share" : "zs_tw_share",
      // "click .zs_gp_share" : "zs_gp_share",
    },

    initialize: function(args) {
      console.log("zs post utility handling view initialized");

      zsNotifyView = new zsNotifyView();
    },

    update_count: function(element, class_name, before, after) {
      if (element.hasClass(class_name)){
        inc = 1;
        if (after) element.html(after);
      } else {
        inc = -1;
        if (before) element.html(before);
      }

      count_element = $(element.parent()).find("span");
      count_value = parseInt(count_element.text().substr(1, count_element.text().length - 1));
      count_element.text("("+(count_value+inc)+")")
    },

    zs_post_thank: function(e) {
      console.log("Inside zs_post_thank");
      zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      this_view = this;
      $.ajax({
        type: 'POST',
        url: '/'+post_name+'/'+post_id+'/meta/upvote',
        success: function(data, status, jqxhr) {
          // console.log(data);

          var uv = $(parent_div.find('.zs_post_thank'));

          this_view.update_count(uv, "thank", "Say Thanks", "Thanked");

          uv.toggleClass("thank").toggleClass("thanked");
          // dv.removeClass("vote-down-on").addClass("vote-down-off");
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          // #TODO display the html message sent by the server
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      });
      return false;
    },

    zs_post_upvote: function(e) {
      // console.log("Inside zs_post_upvote");
      zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      $.ajax({
        type: 'POST',
        url: '/'+post_name+'/'+post_id+'/meta/upvote',
        success: function(data, status, jqxhr) {
          // console.log(data);

          var uv = $(parent_div.find('.zs_post_upvote'));
          var dv = $(parent_div.find('.zs_post_downvote'));
          var vc = $(parent_div.find('.zs_post_votecount'));
          
          if (dv.hasClass("vote-down-on")){
            vc.text(parseInt(vc.text()) + 1);
          }

          if (!uv.hasClass("vote-up-on")){
            vc.text(parseInt(vc.text()) + 1);
          } else {
            vc.text(parseInt(vc.text()) - 1);
          }

          uv.toggleClass("vote-up-off").toggleClass("vote-up-on");
          dv.removeClass("vote-down-on").addClass("vote-down-off");

          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      });
      return false;
    },

    zs_post_downvote: function(e) {
      // console.log("Inside zs_post_downvote");
      zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      $.ajax({
        type: 'POST',
        url: '/'+post_name+'/'+post_id+'/meta/downvote',
        success: function(data, status, jqxhr) {
          // console.log(data);
          
          var uv = $(parent_div.find('.zs_post_upvote'));
          var dv = $(parent_div.find('.zs_post_downvote'));
          var vc = $(parent_div.find('.zs_post_votecount'));
          
          if (uv.hasClass("vote-up-on")){
            vc.text(parseInt(vc.text()) - 1);
          }

          if (!dv.hasClass("vote-down-on")){
            vc.text(parseInt(vc.text()) - 1);
          } else {
            vc.text(parseInt(vc.text()) + 1);
          }

          dv.toggleClass("vote-down-off").toggleClass("vote-down-on");
          uv.removeClass("vote-up-on").addClass("vote-up-off");

          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      });
      return false;
    },

    zs_post_fav: function(e) {
      // console.log("Inside zs_post_fav");
      zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      $.ajax({
        type: 'POST',
        url: '/'+post_name+'/'+post_id+'/meta/favourite',
        success: function(data, status, jqxhr) {
          // console.log(data);
          
          var fa = $(parent_div.find('.zs_post_fav'));
          var fc = $(parent_div.find('.zs_post_favcount'));

          if (!fa.hasClass("star-on")){
            fc.text(parseInt(fc.text()) + 1);
          } else {
            fc.text(parseInt(fc.text()) - 1);
          }

          fa.toggleClass("star-off").toggleClass("star-on");

          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      });
      return false;
    },

    zs_post_follow: function(e) {
      // console.log("Inside zs_post_thank");
      zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      this_view = this;
      $.ajax({
        type: 'POST',
        url: '/'+post_name+'/'+post_id+'/meta/follow',
        success: function(data, status, jqxhr) {
          // console.log(data);

          var uv = $(parent_div.find('.zs_post_follow'));

          this_view.update_count(uv, "follow", "Follow", "Following");

          uv.toggleClass("follow").toggleClass("following");
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          // #TODO display the html message sent by the server
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      });
      return false;
    },

    zs_social_share: function(e) {
      e.preventDefault();
      clicked_element = $(e.target).parent();

      share_social_url = clicked_element.attr("href");
      // console.log(share_social_url);

      window.open( share_social_url, "myWindow", "status = 1, height = 400, width = 500" );
      return false;
    },

    zs_post_share: function(e) {
      // console.log("Inside zs_post_thank");
      zsNotifyView.nv_show(1);

      clicked_element = $(e.target).parent().find("a");

      var parent_div = $(e.target).closest(".post-div");
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      permalink = window.location.origin + parent_div.find("#permalink a").attr("href");
      title_text = $("title").text().split(" - ")[0];
      posting_type = parent_div.attr("post"); //#TODO capitalize first letter

      // this_view = this;
      // $.ajax({
      //   type: 'POST',
      //   url: '/'+post_name+'/'+post_id+'/meta/share',
      //   success: function(data, status, jqxhr) {
      //     // console.log(data);

      //     var uv = $(parent_div.find('.zs_post_share'));
      //     this_view.update_count(uv, "share");

      //     zsNotifyView.nv_hide(1);
      //   },
      //   error: function(jqxhr, status) {
      //     // console.log(jqxhr.status);
      //     // #TODO display the html message sent by the server
      //     zsNotifyView.nv_show(1, jqxhr.responseText);
      //   },
      // });
  
      fb_share = function(page_info) {
        return "http://www.facebook.com/sharer.php?u="+encodeURIComponent(page_info.page_link)+"&ref=fbshare&t="+page_info.page_title;
        // https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fstackoverflow.com%2Fq%2F5653858%2F907753%3Fsfb%3D2&ref=fbshare&t=FB+share+in+new+window
      }

      tw_share = function(page_info) {

        if ((page_info.page_title + page_info.page_link).length > 138)
              page_info.page_title = page_info.post_type;

        return "http://twitter.com/share?url="+encodeURIComponent(page_info.page_link)+"&text="+page_info.page_title;
        // https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F5653858%2Ffb-share-in-new-window&text=FB+share+in+new+window&url=http%3A%2F%2Fstackoverflow.com%2Fq%2F5653858%2F907753%3Fstw%3D2
      }

      gp_share = function(page_info) {
        return "https://plus.google.com/share?url="+encodeURIComponent(page_info.page_link);
        // https://plus.google.com/share?url=http%3A%2F%2Fstackoverflow.com%2Fq%2F5653858%2F907753?sgp=2
      }


      // if ($("#zs_modal_heaven").hasClass("share-populated")){
      //   $("[id$=Modal]").modal('hide');
      //   $("#zsShareModal").modal('show');
      //   zsNotifyView.nv_hide(1);
      // } else {
        this_view = this;
        $.ajax({
          type: 'GET',
          url: '/share_post',
          success: function(data, status, jqxhr) {
            // console.log(data);
            // console.log("=============================================");
            // $(data).modal();
            // $("#zs_modal_heaven").append(data);
            // $("#zs_modal_heaven").addClass("share-populated");
            
            if(clicked_element.attr("data-content")){
              var page_info = JSON.parse(clicked_element.attr("data-content"));
            } else{
              var page_info = {};
              page_info.page_title = posting_type +" for "+ title_text;
              page_info.page_link = permalink;
              page_info.post_type = posting_type;
            }
            // var page_info = clicked_element.attr("data-content");
            // console.log(clicked_element);
            // console.log(page_info);

            // populated_share_modal = _.template(data, JSON.stringify({page_info : clicked_element.attr("data-content")}));
            populated_share_modal = _.template(data, {page_info : page_info});
            // console.log(populated_share_modal);
            
            // $("#zs_modal_heaven").remove("#zsShareModal");
            $("#zsShareModal").remove();
            $("#zs_modal_heaven").append(populated_share_modal);

            $("[id$=Modal]").modal('hide');
            $("#zsShareModal").modal('show');

            
            // var uv = $(parent_div.find('.zs_post_share'));
            // this_view.update_count(uv, "zs_post_share");

            zsNotifyView.nv_hide(1);
          },
          error: function(jqxhr, status) {
            // console.log(jqxhr.status);
            // #TODO display the html message sent by the server
            zsNotifyView.nv_show(1, jqxhr.responseText);
          },
        });
      // }

      return false;
    },

    zs_post_report: function(e) {
      // console.log("Inside zs_post_thank");
      zsNotifyView.nv_show(1);

      var parent_div = $(e.target).closest(".post-div");
      post_id = parent_div.attr("id").split("_")[1];
      post_name = parent_div.attr("post");

      // this_view = this;
      // $.ajax({
      //   type: 'POST',
      //   url: '/'+post_name+'/'+post_id+'/meta/share',
      //   success: function(data, status, jqxhr) {
      //     // console.log(data);

      //     var uv = $(parent_div.find('.zs_post_report'));

      //     this_view.update_count(uv, "share", "Follow", "Following");

      //     uv.toggleClass("follow").toggleClass("following");
      //     zsNotifyView.nv_hide(1);
      //   },
      //   error: function(jqxhr, status) {
      //     // console.log(jqxhr.status);
      //     // #TODO display the html message sent by the server
      //     zsNotifyView.nv_show(1, "<b>"+jqxhr.status+"</b><a class='zs_global_notification_close' href='#'> X</a>");
      //   },
      // });
      return false;
    },

    getCounterElement: function(e) {

        // comment_counter_element = $(parent_div.find('.zs_toggle_comments span'));
    },

    zs_confirm_action: function() {
      return confirm("Continue Deletion?\nDeletion Cannot be reverted back.");
    },

    zs_post_delete: function(e) {
      console.log("inside post_delete");

      if (!this.zs_confirm_action()){
        return;
      }


      // #TODO show popup for confirmation (try hard and soft popup)
      zsNotifyView.nv_show(1);

      var clicked_element = $(e.target).parent();

      var post_div = clicked_element.closest(".post-div");
      var post_type = post_div.attr("id").split("_")[0].toLowerCase();
      var post_id = post_div.attr("id").split("_")[1] ;
      
        var this_view = this;
        $.ajax({
          type: 'DELETE',
          url: '/'+post_type+'/'+post_id,
          success: function(data, status, jqxhr) {
            console.log("post:", post_type , "deleted successfully")
            
            post_div.addClass("hidden");

            // edit_target_element.toggleClass("comment-content").toggleClass("full-comment").attr("contenteditable", false);
            zsNotifyView.nv_hide(1);
            
            if (post_type == "answer")
              window.location.reload();

            if (post_type == "question")
              window.location = "/questions";

            if (post_type == "shopex")
              window.location = "/shopping-experiences";
          },
          error: function(jqxhr, status) {
            zsNotifyView.nv_show(1, jqxhr.responseText);
          },
        });
    },


    render: function() {
      return this;
    }

  });

  return zsPostUtilityHandlingView;
});