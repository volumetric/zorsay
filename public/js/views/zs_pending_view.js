define(['Backbone', 'views/zs_notify_view'], function(b, zsNotifyView) {
  console.log("inside zs_pending_view")

  var zsPendingView = Backbone.View.extend({
    el: 'body',

    events: {
      // "click .zs_global_notification_close": "nv_close"
      // "click [data-poload]": "zs_pending",
      // "click .zs_pending": "zs_pending",
      // #TODO add modal

      // "click [data-uv-trigger=smartvote]": "zsPendingMessage",
    },

    initialize: function(args) {
      console.log("zs pending view initialized");

      zsNotifyView = new zsNotifyView();
      
      // this.zsgnl = $("#zs_global_notification_left");
      // this.zsgnl.showing = false;

      // this.zsgnr = $("#zs_global_notification_right");
      // this.zsgnr.showing = false;
    },

    render: function() {
      console.log("in render function for zs pending view");
      return this;
    },

    zsPendingMessage: function(e) {
      // console.log("inside zsPendingMessage");
      // console.log(e.target);
      zsNotifyView.nv_show(1, '<div class="btn-success zs_notify_html_message">We are still working on this page/feature. Please share your <b>ideas</b> and <b>thoughts</b> on what you want to see here.<a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 10000);
    },

    zs_pending: function(e) {
      e.preventDefault();

      $("[id$=Modal]").modal('hide');
      $("#missingFeatureModal").modal('show');

      // console.log("This is something we are still working on to publish. Please 'Bear' with us.");

      return false;
      // zsNotifyView.nv_show(1, "We are still working on this page. <a class='zs_global_notification_close' href='#'> X</a>", 3000);
    }
  });

  // var zs_pending = function(e) {
  //   e.preventDefault();
  //   console.log("This is something we are still working on to publish. Please 'Bear' with us.")

  //   // zsNotifyView.nv_show(1, "We are still working on this page. <a class='zs_global_notification_close' href='#'> X</a>", 3000);
  // };

  return zsPendingView;
  // return zs_pending;
});
