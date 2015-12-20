define(['Backbone', 'bootstrap', 'views/zs_notify_view'], function(B, b, zsNotifyView) {
  console.log("inside zs_all_shopex_view")

  var zsAllShopexView = Backbone.View.extend({
    el: 'body',

    events: {
      // #TODO replace load more button click with page end scroll event
      "click .shopex-short-load-more": "load_more",
      "click .shopex_short_body.shrunk": "expand_shopex",
      "mouseover .spx-comment": "sss",
    },

    initialize: function() {
      console.log("zs all shopex view initialized");
      zsNotifyView = new zsNotifyView();
      $(".spx-comment").popover({
        trigger: 'hover',
        // selector: '.criteria_content',
        html: true,
      });
    },

    sss: function() {
      $(".spx-comment").popover({
        trigger: 'hover',
        // selector: '.criteria_content',
        html: true,
      });
    },

    expand_shopex: function(e) {
      console.log("inside expand_shopex");
      // console.log(e.target);
      zsNotifyView.nv_show(1);

      var clicked_element = $(e.target);
      var parent_div = clicked_element.closest(".post-div");
      var element = parent_div.find(".shopex_short_body");
      var already_ratings = parent_div.find(".already_ratings");

      // var post_permalink = parent_div.find("#permalink a").attr("href");
      var post_id = parent_div.attr("id").split("_")[1];
      // console.log(post_permalink);

      $.ajax({
        type: 'GET',
        url: '/shopex/'+post_id+'/body/html',
        success: function(data, status, jqxhr) {
          // console.log(jqxhr.status);
          // $(".question_short_list").append(data);
          if (data){
            // console.log("putting it in...");
            // console.log(data);
            
            already_ratings.html("");
            element.html(data);
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
      var order = $(".shopex_short_list").attr("order");

      // console.log("lastId:", lastId);
      // console.log("limit:", limit);
      // console.log("order:", order);

      $.ajax({
        type: 'GET',
        url: '/shopping-experiences/'+order+'/'+lastId+'/'+limit+'/html',
        success: function(data, status, jqxhr) {
          // console.log(jqxhr.status);
          $(".shopex_short_list").append(data);
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status);
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
        },
      });

    },

    render: function() {
      // console.log("in zs_all_shopex_view render function");
      return this;
    }

  });

  return zsAllShopexView;
});