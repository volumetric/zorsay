require.config({
  paths: {
    jQuery: ["http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min", "/js/libs/jquery.min"],
    Underscore: ["http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min", "/js/libs/underscore"],
    Backbone: ["http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min", "/js/libs/backbone"],
    bootstrap: ["http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.3/js/bootstrap.min", "/js/bootstrap.min"],
    jQuery_color: ["http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min", "/js/libs/jquery.color.min"],

    models: 'models',
    text: '/js/libs/text',
    css: '/js/libs/css.min',
    termifier: '/js/libs/jquery.vinit.attr_tooltip',
    templates: '../templates',
    styles: '../styles',
    
    shopex: '/js/script',
        
    hallo: ["http://hallojs.org/js/hallo", "/js/libs/hallo.min"],
    jQuery_ui: ["http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min", "/js/libs/jquery-ui.min"],
    rangy_core: ["http://rangy.googlecode.com/svn/trunk/currentrelease/rangy-core", "/js/libs/rangy-core"],

    // SocialNetView: '/js/SocialNetView',
  },

  shim: {
    'Backbone': ['Underscore', 'jQuery'],
    'ZorSayFront': ['Backbone'],
    'termifier': ['jQuery'],
    'hallo': ['jQuery', 'jQuery_ui', 'rangy_core'],
    'bootstrap': ['jQuery'],
    'jQuery_color' : ['jQuery'],
    'shopex': ['jQuery_color'],
  }
});

// require(['SocialNet'], function(SocialNet) {
//   SocialNet.initialize();
// });

// require(['ZorSayFront', 'termifier', 'hallo'], function(ZorSayFront) {
require(['ZorSayFront', 'jQuery'], function(ZorSayFront, $) {  
  console.log("Test output");
  console.log("$: " + typeof($));
  ZorSayFront.initialize();
});
