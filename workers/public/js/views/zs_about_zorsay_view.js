define(['Backbone', 'bootstrap', 'summernote', 'select2', 'bootstrap_slider', 'comment-box'], function() {
  console.log("inside zsAboutZorsayView")
  
  var zsAboutZorsayView = Backbone.View.extend({
    el: 'body',

    events: {
      "click #zs-tour a": "setUrl",
    },

    initialize: function() {
      // console.log("zsAboutZorsayView initialized");

      var hashFrag = window.location.hash// + "_";
      $("#zs-tour a[href="+hashFrag+"]").tab("show")

      window.scrollTo(0, 0);

      // $("#zs-tour a").on("click", function(){ window.location =  $(this).attr("href")})
    },

    setUrl: function(e){ 
      window.location = $(e.target).attr("href")
      
      // var hl =  $(e.target).attr("href");
      // window.location = hl.substr(0, hl.length - 1);      
    },

    render: function() {
      // console.log("in zsAboutZorsayView render function");
      return this;
    }

  });

  return zsAboutZorsayView;
});