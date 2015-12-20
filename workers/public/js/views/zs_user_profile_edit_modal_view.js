define(['Backbone', 'bootstrap'], function() {
  console.log("inside zsUserProfileEditModalView")
  var zsUserProfileEditModalView = Backbone.View.extend({
    el: 'body',

    events: {
      "click #user_profile_update_btn": "send_update_req",
    },

    initialize: function() {
      console.log("zsUserProfileEditModalView initialized");
    },

    send_update_req: function() {
      req_data = {};

      req_data.first_name = $("#first_name").val();
      req_data.last_name = $("#last_name").val();
      req_data.aboutme = $("#aboutme").val();
      req_data.areacode = $("#areacode").val();
      req_data.profile_image_url = $("#profile_image_url").val();
      req_data.verify_password = $("#verify_password").val();

      // console.log(req_data);
    },

    render: function() {
      console.log("zsUserProfileEditModalView render function");
      return this;
    }

  });

  return zsUserProfileEditModalView;
});

// I am the silver surfer, Explorer of the universe, Guardian of humanity.