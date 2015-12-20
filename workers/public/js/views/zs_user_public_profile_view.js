define(['Backbone', 'bootstrap', 'summernote', 's3upload', 'views/zs_notify_view'], function(B, b, s, s3, zsNotifyView) {
  console.log("inside zs_user_profile_view")
  var zsUserPublicProfileView = Backbone.View.extend({
    el: 'body',

    events: {
      "click .usrinfo-sidebar .list-group-item": "usrinfo_clicked",
    },

    initialize: function(args) {
      console.log("zs user public profile view initialized");
      zsNotifyView = new zsNotifyView();
    },

    usrinfo_clicked: function(e) {
      // console.log("inside usrinfo_clicked");

      var all_list_element = $(".usrinfo-sidebar .list-group-item");
      all_list_element.removeClass("active");
      
      var clicked_element = $(e.target)
      clicked_element.addClass("active");

      var parent_div = clicked_element.closest(".zs-div");
      post = parent_div.attr("post");
      id = parent_div.attr("num");

      var clicked_element_value = clicked_element.attr("value");
      // console.log(clicked_element_value)

      var all_display_element = $(".usrinfo-display");
      all_display_element.hide();

      var display_element = $(".usrinfo-display."+clicked_element_value);
      display_element.show();

      if (!display_element.hasClass("zs-populated")) {
        zsNotifyView.nv_show(1);
        $.ajax({
          type: 'GET',
          url: '/'+post+'/'+id+'/'+clicked_element_value,
          // data: {some: "data"},
          success: function(data, status, jqxhr) {
            // console.log(data);
            display_element.html(data);
            display_element.addClass("zs-populated");
            zsNotifyView.nv_hide(1);
          },
          error: function(jqxhr, status) {
            // console.log(jqxhr.status);
            zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
            // zsNotifyView.nv_show(1, '<div class="btn-warning zs_notify_html_message"><b>'+status+' '+jqxhr.status+'</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
          },
        });
      }
      return false;
    },

    render: function() {
      // console.log("in all_question_view render function");
      return this;
    }

  });

  return zsUserPublicProfileView;
});