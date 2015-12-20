require.config({
  paths: {
    jQuery: ["/js/libs/jquery.min"],
    
    Underscore: ["/js/libs/underscore"],
    Backbone: ["/js/libs/backbone"],
    bootstrap: ["/js/libs/bootstrap.min"],

    text: ["/js/libs/text"],
    // css: ["/js/libs/css"],

    // summernote: ["/js/libs/summernote.min"],
    summernote: ["/js/libs/summernote"],
    codemirror: ["/js/libs/codemirror.min"],
    xml: ["/js/libs/xml.min"],
    formatting: ["/js/libs/formatting.min"],

    select2: ["/js/libs/select2.min"],
    bootstrap_slider: ["/js/libs/bootstrap-slider"],
    comment_box: ["/js/comment-box"],

    lodash: ["/js/libs/lodash.min"],
    s3upload: ["/js/libs/s3upload"],

    recaptcha: ["/js/libs/recaptcha_ajax"],
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