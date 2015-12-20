define(['bootstrap'], function() {
  console.log("inside zs_popover_view")

  var zsPopoverView = Backbone.View.extend({
    el: 'body',
    events: {},

    initialize: function(args) {
      console.log("zs_popover_view initialized")

      var showPopover = function () {
          $(this).popover('show');
      };
      var hidePopover = function () {
          $(this).popover('hide');
      };

      $('[data-poload]').bind('mouseover',function() {
          // console.log("data-poload hover");
          var e=$(this);
          e.unbind('mouseover');
          $.get(e.data('poload'),function(d) {
              // console.log(d);
              e.popover({
                content: d, 
                html:true, 
                'tab-index':-1, 
                // trigger:'mouseover',
                // trigger:'manual',
                trigger:'hover',
                delay: {hide: 250, show:80},
                placement: 'bottom',
                container: e,
              }).popover('show')
              // .focus(showPopover)
              // .blur(hidePopover)
              // .mouseover(showPopover)
              // .mouseleave(hidePopover);
          });
      });
    },

    render: function() {
      // console.log("in all_shopex_view render function");
      return this;
    }
  });

  return zsPopoverView;
});