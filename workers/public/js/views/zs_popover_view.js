define(['Backbone', 'bootstrap', 'views/zs_notify_view'], function(B, b, zsNotifyView) {
  console.log("inside zs_popover_view")

  var zsPopoverView = Backbone.View.extend({
    el: 'body',
    events: {
      // #TODO fix this, right now causing some error, or loading whole page inside the popover
      // "mouseover [data-poload]": "onMouseOver",
      
      // "click [data-poload]": "stillWorking",
      // "click [data-poload]": "zsPendingView",

      // "click [data-poload]": "zsUserVoiceTrigger",
      
      // "click [data-poload]": "zsPendingAction",
    },

    initialize: function(args) {
      console.log("zs_popover_view initialized");

      zsNotifyView = new zsNotifyView();
      // zsPendingView = new zsPendingView();

      var originalLeave = $.fn.popover.Constructor.prototype.leave;
      $.fn.popover.Constructor.prototype.leave = function(obj){
        var self = obj instanceof this.constructor ?
          obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type)
        var container, timeout;

        originalLeave.call(this, obj);

        if(obj.currentTarget) {
          container = $(obj.currentTarget).siblings('.popover')
          timeout = self.timeout;
          container.one('mouseenter', function(){
            //We entered the actual popover – call off the dogs
            clearTimeout(timeout);
            //Let's monitor popover content instead
            container.one('mouseleave', function(){
              $.fn.popover.Constructor.prototype.leave.call(self, self);
            });
          })
        }
      };
      
      var showPopover = function () {
          $(this).popover('show');
      };
      var hidePopover = function () {
          $(this).popover('hide');
      };


      // $('[data-poload]').on("mouseover", function(){
      //     console.log("fixed-popover-pos");

      //     // $('.popover').addClass($(this).data("class"));
      //     $('.popover').addClass("fixed-popover-pos");
      // });



      // $('[data-poload]').bind('mouseover', this.onMouseOver);
    },

    // zsUserVoiceTrigger: function(e){
    //   console.log("inside zsUserVoiceTrigger");
      
    //   UserVoice.push(['hide']);
    //   UserVoice.push(['show', { mode: 'smartvote' }]);
    // },

    // zsPendingAction: function(e) {
    //   e.preventDefault();
    //   zsPendingView.zsPendingMessage(e);
    //   this.zsUserVoiceTrigger(e);
    // },


    // stillWorking: function(e) {
    //   e.preventDefault();

    //   zsNotifyView.nv_show(1, "We are still working on this page. <a class='zs_global_notification_close' href='#'> X</a>", 3000);
    // },

    onMouseOver: function(eve) {
        // console.log("data-poload hover");

        var e=$(this);
        // var e=$(eve.target);
        // console.log(eve.target);
        
        e.unbind('mouseover');

        var showPopover = function() {
          $.get(e.data('poload'),function(d) {
              // console.log(d);
              e.popover({
                content: d, 
                html:true, 
                'tab-index':-1, 
                // trigger:'mouseover',
                // trigger:'manual',
                trigger:'hover',
                // trigger:'click',
                delay: {hide: 100, show:500},
                placement: 'bottom',
                container: e,
                // container: 'body',
              }).popover('show')
              // .focus(showPopover)
              // .blur(hidePopover)
              // .mouseover(showPopover)
              // .mouseleave(hidePopover);
          });
        };

        // setTimeout(showPopover, 500);
        setTimeout(showPopover, 1);
    },

    render: function() {
      // console.log("in all_shopex_view render function");
      return this;
    }
  });

  return zsPopoverView;
});