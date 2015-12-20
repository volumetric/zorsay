require.config({
  paths: {
    jQuery: ["http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min", "/js/libs/jquery.min"],
    // jQuery: ["/js/libs/jquery.min"],
    
    Underscore: ["http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min", "/js/libs/underscore"],
    // Underscore: ["/js/libs/underscore"],
 
    Backbone: ["http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min", "/js/libs/backbone"],
    // Backbone: "/js/libs/backbone",
    // bootstrap: ["http://netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min", "http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.3/js/bootstrap.min", "/js/libs/bootstrap.min"],
    bootstrap: ["/js/libs/bootstrap.min"],
    // jQuery_color: ["http://cdnjs.cloudflare.com/ajax/libs/jquery-color/2.1.2/jquery.color.min", "/js/libs/jquery.color.min"],
    
    text: ["http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text", "/js/libs/text"],
    css: ["http://cdnjs.cloudflare.com/ajax/libs/require-css/0.1.1/css", "/js/libs/css"],
    // termifier: '/js/libs/jquery.vinit.attr_tooltip',

    // hallo: ["http://cdnjs.cloudflare.com/ajax/libs/hallo.js/1.0.2/hallo", "http://hallojs.org/js/hallo", "/js/libs/hallo.min"],
    // jQuery_ui: ["http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.2/jquery-ui.min", "/js/libs/jquery-ui.min"],
    // rangy_core: ["http://cdnjs.cloudflare.com/ajax/libs/rangy/1.2.3/rangy-core", "http://rangy.googlecode.com/svn/trunk/currentrelease/rangy-core", "/js/libs/rangy-core"],

    summernote: ["/js/libs/summernote.min"],
    codemirror: ["http://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.min", "/js/libs/codemirror.min"],
    // codemirror: ["/js/libs/codemirror.min"],
    xml: ["http://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.min", "/js/libs/xml.min"],
    formatting: ["http://cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.min", "/js/libs/formatting.min"],

    // select2: ["http://cdnjs.cloudflare.com/ajax/libs/select2/3.2/select2.min", "/js/libs/select2.min"],
    // select2: ["/js/libs/select2.min"],

    // shopex: '/js/script',
    // review: 'views/review',
    shopex_view: 'views/shopex_view',
    models: 'models',
    
    templates: '../templates',
    styles: '../styles',
  },

  shim: {
    // backbone: {
    //     deps: ['jquery', 'underscore'],
    //     exports: 'Backbone'
    // },
    // underscore: {
    //     exports: '_'
    // },

    'Backbone': ['Underscore', 'jQuery'],
    // 'ZorSayFront': ['Backbone'],
    // 'termifier': ['jQuery'],
    // 'jQuery_ui': ['jQuery'],
    // 'hallo': ['jQuery', 'jQuery_ui', 'rangy_core'],
    'bootstrap': ['jQuery'],
    // 'jQuery_color': ['jQuery'],
    // 'select2': ['jQuery'],
    // 'xml': ['codemirror'],
    // 'formatting': ['codemirror', 'xml'],
    
    'summernote': ['bootstrap', 'codemirror'],
    // 'summernote':  {
    //     deps: ['bootstrap', 'codemirror'],
    //     exports: "Summernote",
    // },

    'shopex_view': ['Backbone', 'summernote'],
    // 'review': ['summernote', 'Backbone', 'hallo'],
    // 'review': {
    //     deps: ['summernote', 'Backbone'],
    //     exports: "review",  
    // },
  }
});
// console.log("Test output 0");
// require(['SocialNet'], function(SocialNet) {
//   SocialNet.initialize();
// });

// require(['ZorSayFront', 'termifier', 'hallo'], function(ZorSayFront) {
// require(['ZorSayFront', 'jQuery'], function(ZorSayFront, $) {  

// require(['ZorSayFront'], function(ZorSayFront) {  
//   console.log("Test output");
//   // console.log("$: " + typeof($));
//   ZorSayFront.initialize();
// });

require(['shopex_view'], function(shopex_view) {  
  console.log("Test output");
  console.log(Backbone);
  // console.log(summernote);
  // console.log(review);

  sv = new shopex_view();
  // rev.render();

  // console.log("$: " + typeof($));
  // console.log(review.initialize);
});


// requirejs.config({
//     baseUrl: 'js/lib',
//     paths: {
//         app: '../app'
//     },
//     shim: {
//         backbone: {
//             deps: ['jquery', 'underscore'],
//             exports: 'Backbone'
//         },
//         underscore: {
//             exports: '_'
//         }
//     }
// });
