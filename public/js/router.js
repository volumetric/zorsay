define(['views/userhome', 'views/register', 'views/login', 'views/landing',
        'views/forgotpassword', 'views/all_reviews', 'views/404', 'models/Account',
        'models/ReviewCollection'],
function(UserHomeView, RegisterView, LoginView, LandingView, ForgotPasswordView, AllReviewsView, P404View,
         Account, ReviewCollection) {
  var SocialRouter = Backbone.Router.extend({
    currentView: null,

    routes: {
      "landing": "landing",
      "userhome": "userhome",
      "logout": "logout",
      "login": "login",
      "register": "register",
      "forgotpassword": "forgotpassword",
      "reviews/all": "reviews_all",
      "profile": "profile",
      "settings": "settings",
      ":whatever": "page_not_found",
    },

    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    page_not_found: function() {
      // this.changeView(new AllReviewsView());
      console.log(404);
      console.log("page_not_found");
      // this.userhome();
      this.changeView(new P404View());
    },

    profile: function() {
      console.log("profile page visited");
      // this.userhome();
    },

    settings: function() {
      console.log("settings page visited");
      // this.userhome();
    },

    reviews_all: function() {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.changeView(new AllReviewsView());
      
      // var reviewCollection = new ReviewCollection();
      // reviewCollection.url = '/reviews/all';
      // this.changeView(new AllReviewsView({
      //   collection: reviewCollection
      // }));
      // // cannot fetch this its post request with skip and anchor parameters
      // reviewCollection.fetch();
    },

    landing: function() {
      this.changeView(new LandingView());
    },

    logout: function() {
      $.post('/logout', {}, function(data) {
        console.log(data);
        window.location.hash = 'login';
      });
    },

    index: function() {
      var statusCollection = new StatusCollection();
      statusCollection.url = '/accounts/me/activity';
      this.changeView(new IndexView({
        collection: statusCollection
      }));
      statusCollection.fetch();
    },

    userhome: function() {
      var reviewCollection = new ReviewCollection();
      reviewCollection.url = '/accounts/me/reviews';
      this.changeView(new UserHomeView({
        collection: reviewCollection
      }));
      reviewCollection.fetch();
    },

    login: function() {
      console.log("in LoginView")
      this.changeView(new LoginView());
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView());
    },

    register: function() {
      this.changeView(new RegisterView());
    },

    // profile: function() {
    //   var model = new Account({id:'me'});
    //   this.changeView(new ProfileView({model:model}));
    //   model.fetch();
    // }
  });

  return new SocialRouter();
});

