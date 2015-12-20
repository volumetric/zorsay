(function($){

  $.fn.termifier = function(attr_name, options) {
    var settings = $.extend({
      origin: {top:0,left:0},
      addClass: null,
    },options||{});
    this.mouseover(function(event){
      $(this).addClass('hovered');
      //$(this).css({backgroundColor: '#FAFA12'});
      $('div.termifier').remove();
      var attr_val = $(this).attr(attr_name) ? $(this).attr(attr_name) : "No Mention";
      // console.log(attr_val);
      $('<div>')
        .addClass('termifier' +
          (settings.addClass ? (' ') + settings.addClass : ''))
        .css({
          'word-wrap': 'break-word',
          position: 'absolute',
          opacity: 0.8,
          top: event.pageY - settings.origin.top + 20,
          left: event.pageX - settings.origin.left + 20,
          display: 'block'
        })
        .click(function(event){
          $(this).fadeOut('slow');
        })
        .appendTo('body')
        .append(
	  $('<span width="auto">'+attr_val+'</span>')
        );
    });

    this.mouseout(function(event){
      //$(this).css({backgroundColor: '#FFFFFF'});
      $(this).removeClass('hovered');
      $('div.termifier').remove();
    });
    this.addClass('termified');
    return this;
  };

})(jQuery);
