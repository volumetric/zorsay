define(['ZorSayFrontView', 'text!templates/forgotpassword.html'], function(ZorSayFrontView, forgotpasswordTemplate) {
  var forgotpasswordView = ZorSayFrontView.extend({
    requireLogin: false,

    el: $('#content'),

    events: {
      "submit form": "password"
    },

    password: function() {
      $.post('/forgotpassword', {
        email: $('input[name=email]').val()
      }, function(data) {
        console.log(data);
        // // $("#message").slideUp();
        // $("#message").html('Check your mail for resetting your password.');
        // $("#message").slideDown();
      });
      $('#forgot_passwd_btn').attr('disabled',true);
      $("#message").slideUp();
      $("#message").html('Check your mail to reset your Password.');
      $("#message").slideDown();
      return false;
    },

    render: function() {
      this.$el.html(forgotpasswordTemplate);
      $("#error").hide();
      $("#message").hide();
    }
  });

  return forgotpasswordView;
});
