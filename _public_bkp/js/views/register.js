define(['SocialNetView', 'text!templates/register.html'], function(SocialNetView, registerTemplate) {
  var registerView = SocialNetView.extend({
    requireLogin: false,

	el: $('#content'),

    events: {
      "submit form": "register"
    },

    register: function() {
      $.post('/register', {
        firstName: $('input[name=firstName]').val(),
        lastName: $('input[name=lastName]').val(),
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val(),
      }, function(data) {
        console.log(data);
        $("#error").slideUp();
        $("#error").text('Great! You are now registered with us, Check your mail to get activated.');
        // $("#error").text('Great!! You are now registered with us. Check your mail.');
        $("#error").slideDown();
        $('#register_btn').attr('disabled',true);
        $('input[name=firstName]').val('');
        $('input[name=lastName]').val('');
        $('input[name=email]').val('');
        $('input[name=password]').val('');
        $('#register_btn').attr('disabled',true);
      }).error(function(){
        $("#error").slideUp();
        $("#error").text('An account with this mail id is already registered with us, Check Credentials');
        $("#error").slideDown();
      });
      return false;
    },

    render: function() {
      this.$el.html(registerTemplate);
      $("#error").hide();
      $("#message").hide();
    }
  });

  return registerView;
});
