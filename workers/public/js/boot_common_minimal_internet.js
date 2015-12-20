require.config({
  paths: {
    jQuery: ["http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min", "/js/libs/jquery.min"],
    // jQuery: ["/js/libs/jquery.min"],
    
    Underscore: ["http://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min", "/js/libs/underscore"],
    // Underscore: ["/js/libs/underscore"],
 
    Backbone: ["http://cdnjs.cloudflare.com/ajax/libs/backbone.js/1.0.0/backbone-min", "/js/libs/backbone"],
    // Backbone: "/js/libs/backbone",

    bootstrap: ["http://netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min", "http://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.3/js/bootstrap.min", "/js/libs/bootstrap.min"],
    // bootstrap: ["/js/libs/bootstrap.min"],

    text: ["http://cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text", "/js/libs/text"],
    // css: ["http://cdnjs.cloudflare.com/ajax/libs/require-css/0.1.1/css", "/js/libs/css"],

    // summernote: ["/js/libs/summernote.min"],
    summernote: ["/js/libs/summernote"],
    codemirror: ["http://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/codemirror.min", "/js/libs/codemirror.min"],
    //codemirror: ["/js/libs/codemirror.min"],
    xml: ["http://cdnjs.cloudflare.com/ajax/libs/codemirror/3.20.0/mode/xml/xml.min", "/js/libs/xml.min"],
    formatting: ["http://cdnjs.cloudflare.com/ajax/libs/codemirror/2.36.0/formatting.min", "/js/libs/formatting.min"],

    // select2: ["http://cdnjs.cloudflare.com/ajax/libs/select2/3.2/select2.min", "/js/libs/select2.min"],
    select2: ["/js/libs/select2.min"],
    // select2: ["/js/libs/select2_1"],
    bootstrap_slider: ["/js/libs/bootstrap-slider"],
    comment_box: ["/js/comment-box"],

    lodash: ["http://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min", "/js/libs/lodash.min"],
    s3upload: ["/js/libs/s3upload"],

    recaptcha: ["/js/libs/recaptcha_ajax", "http://www.google.com/recaptcha/api/js/recaptcha_ajax"],

    snake: ["/js/libs/snake"],

    models: 'models',
    templates: '../templates',
    styles: '../styles',
  },

  shim: {
    'select2': ['jQuery'],
    'comment-box': ['jQuery'],
    'recaptcha': ['jQuery'],
    'snake': ['jQuery'],

    'bootstrap': ['jQuery'],
    'bootstrap_slider': ['bootstrap'],
    
    'Backbone': ['Underscore', 'jQuery'],

    'lodash': ['jQuery'],
    's3upload': ['jQuery', 'lodash'],
    'summernote': ['bootstrap', 'codemirror', 's3upload'],
  }
});