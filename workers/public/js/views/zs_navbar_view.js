define(['Backbone', 'bootstrap', 'recaptcha', 'views/zs_add_shopex_modal_view', 'views/zs_add_question_modal_view', 'views/zs_notify_view', 'views/zs_pending_view'], function(B, b, rc, zs_add_shopex_modal_view, zs_add_question_modal_view, zsNotifyView, zsPendingView) {
  console.log("inside zs_navbar_view")
  var zsNavbarView = Backbone.View.extend({
    el: 'body',
    disable_mail: false,

    events: {
      // "click .show_recaptcha": "onShowRecaptcha",

      // "click #loginModalLink": this.swapScreen('mySigninModal'),
      "click #loginModalLink": "swapScreenLogin",
      "click .loginModalLink": "swapScreenLogin",
      
      // "click #registerModalLink": this.swapScreen('myRegisterModal'),
      "click #registerModalLink": "swapScreenRegister",
      "click .registerModalLink": "swapScreenRegister",

      // "click #forgotModalLink": this.swapScreen('myForgotModal'),
      "click #forgotModalLink": "swapScreenForgot",
      "click .forgotModalLink": "swapScreenForgot",

      "click #login-submit": "zslogin",
      // "submit form": "zslogin",
      "keypress #loginInputEmail": "zsloginEnter",
      "keypress #loginInputPassword": "zsloginEnter",

      "click #logout-link": "zslogout",

      "click #forgot-submit": "zsforgotPassword",
      // "submit form": "zsforgotPassword",
      // "keypress #forgotPasswordEmail": "zsforgotPasswordEnter",

      "click #register-submit": "zsregister",
      // "submit form": "zsregister",
      "keypress #registerInputName": "zsregisterEnter",
      "keypress #registerInputEmail": "zsregisterEnter",
      "keypress #registerInputPassword": "zsregisterEnter",
      "keypress #registerInputPasswordConfirm": "zsregisterEnter",

      "click #zs_content_search_btn": "zsContentSearch",

      "click [data-poload]": "zsPendingAction",
      "click [pending-feature]": "zsPendingAction",
    },

    initialize: function() {
      console.log("zs_navbar_view initialized");
      zsNotifyView = new zsNotifyView();
      zsPendingView = new zsPendingView();

      var zsasmv = new zs_add_shopex_modal_view();
      var zsaqmv = new zs_add_question_modal_view();
      // $(document).on( 'click', '.editReview', this.editReview );
      // $(document).on( 'click', '.saveReview', this.saveReview );

      // $("#zs_content_search_btn").on("click", function(e){e.preventDefault(); console.log($("#zs_content_search_query").val())})
    },

    zsUserVoiceTrigger: function(e){
      console.log("inside zsUserVoiceTrigger");
      
      UserVoice.push(['hide']);
      UserVoice.push(['show', { mode: 'smartvote' }]);
    },

    zsPendingAction: function(e) {
      e.preventDefault();
      zsPendingView.zsPendingMessage(e);
      this.zsUserVoiceTrigger(e);
    },

    zsContentSearch: function(e) {
      e.preventDefault();
      search_query = $("#zs_content_search_query").val();
      console.log(search_query);
    },

    swapScreenLogin: function() {
      // console.log("inside swapScreen()")
      $("[id$=Modal]").modal('hide');
      $("#mySigninModal").modal('show');
      return false;
    },

    onShowRecaptcha: function() {
      element = 'recaptcha_div';
      Recaptcha.create("6LepS_ISAAAAAK_GJp-LYAm1MzcNUsgl2EeGHf6X", element, {
          theme: "white",
          callback: Recaptcha.focus_response_field});
    },

    swapScreenRegister: function() {
      console.log("inside swapScreenRegister()")
      $("[id$=Modal]").modal('hide');
      $("#myRegisterModal").modal('show');
      this.onShowRecaptcha();

      // var showRecaptcha = function (element) {
      //   Recaptcha.create("6LepS_ISAAAAAK_GJp-LYAm1MzcNUsgl2EeGHf6X", element, {
      //     theme: "red",
      //     callback: Recaptcha.focus_response_field});
      // };

      // $.ajax({
      //     type: 'GET',
      //     // url: '/registermodal',
      //     url: '/recaptcha',
      //     // data: comment_obj,
      //     success: function(data, status, jqxhr) {
      //       // zsNotifyView.nv_hide(1);
      //       // console.log(jqxhr.status);
      //       // console.log(data);
      //       // $(data).modal('show');
      //       // $(data).show();
      //       // document.head.appendChild(data);
      //       // $("body").append(data);
      //       // console.log($(data).find("script").attr("src"));
      //       recaptcha_source = $($(data)[0]).attr("src");
      //       console.log(recaptcha_source);
      //       $.getScript(recaptcha_source, function(){
      //         alert("Running recaptcha_source");
      //       });
      //     },
      //     error: function(jqxhr, status) {
      //       console.log(jqxhr.status);
      //       // zsNotifyView.nv_show(1, jqxhr.responseText);
      //       // $("#myRegisterModal").modal('show');
      //     },
      //   });
      return false;
    },

    swapScreenForgot: function() {
      // console.log("inside swapScreen()")
      $("[id$=Modal]").modal('hide');
      $("#myForgotModal").modal('show');
      return false;
    },

    zsloginEnter: function(e) {
      if ( e.which === 13 ) {
        // console.log("Enter pressed");
        this.zslogin();
      }
    },

    zslogin: function() {
      console.log("inside zslogin");

      login_info = {
        email: $('#loginInputEmail').val(),
        password: $('#loginInputPassword').val(),
        rememberme: $('#loginRememberMe').val()
      };

      // console.log(login_info);

      $.post('/login', login_info , function(data) {
        // console.log("Login Successful");
        // console.log(data.user_info);


        // Show message as alert-success
        // $("#login-message").hide();
        // $("#login-message").html('Success, You are logged in.').removeClass('alert-danger').addClass('alert-success');
        // $("#login-message").fadeIn();

        // // change the nav bar to display user info dropdown and remove login link/button
        // // id="zs-navbar-login"
        // // id="zs-navbar-user-dropdown"

        // if (data.user_info.name != null && data.user_info.name.first != null) {
        //     username = data.user_info.name.first;
        // } else {
        //     username = data.user_info.email;
        // }

        // $("#zs-navbar-login").hide();
        // $("#zs-user").html(username+"<b class='caret'></b>");
        // $("#zs-navbar-user-dropdown").show();


        // // hide login modal
        $("[id$=Modal]").modal('hide');

        window.location.reload();

      }).error(function(){
        console.log("Login Failed");
        // Show message as alert-error
        $("#login-message").hide();
        $("#login-message").html('Unable to login, check credentials.').removeClass('alert-success').addClass('alert-danger');
        $("#login-message").fadeIn();

        // window.location.reload();
      });
      return false;
    },

    zslogout: function() {
      // console.log("inside zslogout");

      $.post('/logout', {} , function(data) {
        // console.log("Logout Successful");

        // change the nav bar to display user info dropdown and remove login link/button
        // id="zs-navbar-login"
        // id="zs-navbar-user-dropdown"
        
        // $("#zs-navbar-user-dropdown").hide();
        // $("#zs-navbar-login").show();
        window.location.reload();

      }).error(function(){
        // $("#zs-navbar-user-dropdown").hide();
        // $("#zs-navbar-login").show();
        window.location.reload();

      });
      return false;
    },

    zsforgotPasswordEnter: function(e) {
      if ( e.which === 13 ) {
        // console.log("Enter pressed");
        this.zsforgotPassword();
      }
    },

    zsforgotPassword: function() {
      // console.log("inside zsforgotPassword");
      $("#forgot-message").html();

      mail_info = {
        email: $('#forgotPasswordEmail').val(),
      };

      this_view = this;
      // console.log(mail_info);

      if (!this_view.disable_mail){
        this_view.disable_mail = true;
        $.ajax({
          type: 'POST',
          url: '/forgotpassword',
          data: mail_info,
          success: function(data, status, jqxhr) {
            // console.log("email Sent Successfully");
            // console.log(data.user_info);
            $("#forgot-message").html('Success, Check your mail for instructions to reset your password.').removeClass('alert-danger').addClass('alert-success');
            $("#forgot-message").fadeIn();
            setTimeout(function(){
              window.location = "/";
            }, 5000);
          },
          error: function(jqxhr, status) {
            this_view.disable_mail = false;
            $("#forgot-message").html('email not found, check again.').removeClass('alert-success').addClass('alert-danger');
            $("#forgot-message").fadeIn();
          },
        });

      } else {
        $("#forgot-message").html('Button Disabled.').addClass('alert-danger').removeClass('alert-success');
        $("#forgot-message").fadeIn();
      }
      return false;
    },

    zsregisterEnter: function(e) {
      if ( e.which === 13 ) {
        // console.log("Enter pressed");
        this.zsregister();
      }
    },

    validateEmail: function(email) { 
      var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    },

    validatePassword: function(password) { 
      return password.length > 4;
    },

    validateFullname: function(fullname) { 
      return fullname.length > 1;
    },

    zsregister: function() {
      // console.log("inside zsregister");
      var fn = $('#registerInputName').val();
      var em = $('#registerInputEmail').val();
      var pass = $('#registerInputPassword').val();
      var cpass = $('#registerInputPasswordConfirm').val();

      var rcf = $('#recaptcha_challenge_field').attr("value");
      var rrf = $('#recaptcha_response_field').val();

      var msg_element = $("#register-message");

      // if ($('#registerInputName').val().split(' ').length < 2) {
      if (!this.validateFullname(fn)) {
        msg_element.hide();
        msg_element.html('Please enter your full name').removeClass('alert-success').addClass('alert-danger');
        msg_element.fadeIn();
        return false;
      }

      if (!this.validateEmail(em)) {
        msg_element.hide();
        msg_element.html('Not a Valid email').removeClass('alert-success').addClass('alert-danger');
        msg_element.fadeIn();
        return false;
      }

      if (!this.validatePassword(pass)) {
        msg_element.hide();
        msg_element.html('Password must be atleast 5 characters.').removeClass('alert-success').addClass('alert-danger');
        msg_element.fadeIn();
        return false;
      }

      if (pass != cpass) {
        msg_element.hide();
        msg_element.html('Password not matching, Try Again.').removeClass('alert-success').addClass('alert-danger');
        msg_element.fadeIn();
        return false;
      }

      if (!rrf) {
        msg_element.hide();
        msg_element.html('Please fill the captcha.').removeClass('alert-success').addClass('alert-danger');
        msg_element.fadeIn();
        return false;
      }

      register_info = {
        firstName: fn.split(' ')[0],
        lastName: fn.split(' ')[1],
        email: em,
        password: pass,
        recaptcha_challenge_field: rcf,
        recaptcha_response_field: rrf,
      };

      // console.log(register_info);
      this_view = this;
      $.post('/register', register_info , function(data) {
        // console.log("Registration Successful");
        // console.log(data.user_info);

        // #TODO Automatic login without email verification?
        // $.post('/login', register_info, function(data) {
        //   window.location.reload();
        // }).error(function(){
        //   window.location.reload();
        // }); 
        
        // Show message as alert-success
        msg_element.hide();
        msg_element.html('Success, You now have a Zorsay Account, Please Check your mail for verification.').removeClass('alert-danger').addClass('alert-success');
        msg_element.fadeIn();

        zsNotifyView.nv_show(1, '<div class="btn-success zs_notify_html_message">Your Account is Created. You can now <b>Login</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);

        this_view.swapScreenLogin();

        // change the nav bar to display user info dropdown and remove login link/button
        // id="zs-navbar-login"
        // id="zs-navbar-user-dropdown"

        // if (data.user_info.name != null && data.user_info.name.first != null) {
        //     username = data.user_info.name.first;
        // } else {
        //     username = data.user_info.email;
        // }

        // $("#zs-navbar-login").hide();
        // $("#zs-user").html(username+"<b class='caret'></b>");
        // $("#zs-navbar-user-dropdown").show();


        // // hide login modal
        // $("[id$=Modal]").modal('hide');
        
      }).error(function(jqxhr, status){
        // console.log(jqxhr.status);
        // console.log(jqxhr.responseText);
        // console.log("Problem during Registration");
        // Show message as alert-error
        this_view.onShowRecaptcha();
        msg_element.hide();
        msg_element.html(jqxhr.responseText).removeClass('alert-success').addClass('alert-danger');
        msg_element.fadeIn();
      });
      return false;
    },

    render: function() {
      // console.log("in all_shopex_view render function");
      return this;
    }

  });

  return zsNavbarView;
});