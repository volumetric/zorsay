define(['Backbone', 'bootstrap'], function() {
  // console.log("inside all_shopex_view")
  var allShopexView = Backbone.View.extend({
    el: 'body',

    events: {
      // "click #loginModalLink": this.swapScreen('mySigninModal'),
      "click #loginModalLink": "swapScreenLogin",
      
      // "click #registerModalLink": this.swapScreen('myRegisterModal'),
      "click #registerModalLink": "swapScreenRegister",

      // "click #forgotModalLink": this.swapScreen('myForgotModal'),
      "click #forgotModalLink": "swapScreenForgot",
    },

    initialize: function() {
      // console.log("all_shopex_view initialized")
      // $(document).on( 'click', '.editReview', this.editReview );
      // $(document).on( 'click', '.saveReview', this.saveReview );
    },

    swapScreenLogin: function() {
      // console.log("inside swapScreen()")
      $("[id$=Modal]").modal('hide');
      $("#mySigninModal").modal('show');
      return false;
    },

    swapScreenRegister: function() {
      // console.log("inside swapScreen()")
      $("[id$=Modal]").modal('hide');
      $("#myRegisterModal").modal('show');
      return false;
    },

    swapScreenForgot: function() {
      // console.log("inside swapScreen()")
      $("[id$=Modal]").modal('hide');
      $("#myForgotModal").modal('show');
      return false;
    },


    render: function() {
      console.log("in all_shopex_view render function");
      return this;
    }
  });

  return allShopexView;
});