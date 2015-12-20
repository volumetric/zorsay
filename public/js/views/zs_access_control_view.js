define(['Backbone'], function(b) {
  console.log("inside zs_access_control_view")

  var zsAccessControlView = Backbone.View.extend({
    el: 'body',

    user_info: null,

    events: {
      // "click .zs_global_notification_close": "nv_close"
    },

    initialize: function(args) {
      console.log("zs access control initialized");
      
      var jstr = $("#user_info_div").html();
      try {
        this.user_info = JSON.parse(jstr); 
      } catch(e) {
        this.user_info = null;
      }
    },

    isAdmin: function() {
      return this.user_info.admin;
    },

    isMod: function() {
      return this.user_info.mod;
    },

    isStaff: function() {
      return this.user_info.staff;
    },

    render: function() {
      console.log("in render function for zs access control");
      return this;
    }
  });

  return zsAccessControlView;
});
