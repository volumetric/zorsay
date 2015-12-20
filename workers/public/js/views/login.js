define(['ZorSayFrontView', 'text!templates/login.html'], function(ZorSayFrontView, loginTemplate) {
  var loginView = ZorSayFrontView.extend({
    requireLogin: false,

	el: $('#content'),

    events: {
      "submit form": "login"
    },

    login: function() {
      $.post('/login', {
        email: $('input[name=email]').val(),
        password: $('input[name=password]').val()
      }, function(data) {
        // window.location.hash = 'userhome';
        // Backbone.history.navigate('userhome');
        // Backbone.history.navigate('userhome', true);
        Backbone.history.navigate('userhome', true);
        // console.log("after history navigation");

        // console.log("vent trigger");
        // vent.trigger('user:info', {
        //   first_name: 'vinit',
        //   last_name: 'agrawal',
        //   email: 'vender007@gmail.com',
        //   notif_count: 43,
        // });

        // vent.trigger('user:info', data.user_info);
        
      }).error(function(){
        $("#error").text('Unable to login, check credentials.').css("color","red");
        $("#error").slideDown();
      });
      return false;
    },

    render: function() {
      console.log("in loginTemplate render")
      this.$el.html(loginTemplate);
      $("#error").hide();
      $("#message").hide();
      $("input[name=email]").focus();
    }
  });

  return loginView;
});
