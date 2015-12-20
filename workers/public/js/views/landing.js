define(['text!templates/landing.html'], function(landingTemplate) {
  var landingView = Backbone.View.extend({
    requireLogin: false,

	el: $('#content'),

    events: {
      "submit form": "launchListSubmit"
    },

    launchListSubmit: function() {
      $.post('/landing', {
        email: $('input[name=email]').val(),
        // password: $('input[name=password]').val()
      }, function(data) {
        console.log(data);
        $('input[name=email]').val('');
        // window.location.hash = 'index';
        $("#error").slideUp();
        $("#error").html('Thanks for that. You will be, one of the "first few" to hear from us, When we launch <b>Full Blown</b>');
        $("#error").slideDown();
      }).error(function(jqXHR){
        $("#error").slideUp();
        if (jqXHR.status == 400){
          $("#error").html('Some problem with your email, <b>check again</b>');
        }
        else if (jqXHR.status == 412){
          // $('input[name=email]').val('');
          $("#error").html('You are already on our Lauch Announcement List, We will let you know. <b>Thanks for checking up!!</b>');
        }
        else if (jqXHR.status == 500){
          $("#error").html('Some problem occured from our side, our developers are being notified. <b>Try Again</b> after some time.');
        }
        $("#error").slideDown();
      });
      return false;
    },

    render: function() {
      this.$el.html(landingTemplate);
      $("#error").hide();
      $("input[name=email]").focus();
    }
  });

  return landingView;
});
