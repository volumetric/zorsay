define(['Backbone'], function(b) {
  console.log("inside zs_notify_view")

  var zsNotifyView = Backbone.View.extend({
    el: 'body',

    sto: null,

    events: {
      "click .zs_global_notification_close": "nv_close"
    },

    initialize: function(args) {
      console.log("zs notify view initialized");
      
      this.zsgnl = $("#zs_global_notification_left");
      this.zsgnl.showing = false;

      this.zsgnr = $("#zs_global_notification_right");
      this.zsgnr.showing = false;
    },

    nv_close: function(e) {
      $(e.target).closest(".zs_div").hide();
      return false;
    },

    // lor: left or right [1: left, 2: right ]
    // ih:  innerHtml (html string) [Default Loading... as inner html]
    // ac:  addClass (add these classes for styling) [Default: nothing]
    // cl:  close button (true or false) [default: false]
    // ad:  autdismissal time (in ms) [default: no dismissal]

    // nv_show: function(lor, inner_html, add_class, close, auto_dismiss) {
    nv_show: function(lor, inner_html, auto_dismiss) {
      ne = (lor == 1) ? this.zsgnl : this.zsgnr;

      // if inner_html is not passed in the argument or is empty then show the default message as Loading...
      if (!inner_html){
        // inner_html = '<div class="zs-defnotf zs_notify_html_message"><b>Loading   </b><img src="/images/17.gif"></div>';
        inner_html = '<div class="zs-defnotf zs_notify_html_message"><b>Loading   </b><img src="data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gYGBgAAAC4uLoKCgmBgYLq6uiIiIkpKSoqKimRkZL6+viYmJgQEBE5OTubm5tjY2PT09Dg4ONzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCwAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA"></div>';
        ne.html(inner_html);
        ne.show();
      } else {
        ne.html(inner_html);
        // ne.show();
        ne.slideUp();
        ne.slideDown();
      }

      ne.showing = true;

      if (auto_dismiss && !isNaN(auto_dismiss)) {
        this_nvo = this;
        // clear the previosu timeout 
        if (this.sto) clearTimeout(this.sto);
        this.sto = setTimeout(function() { 
          this_nvo.nv_hide(lor) 
        }, auto_dismiss);
      }
    },

    nv_hide: function(lor, inner_html) {
      ne = (lor == 1) ? this.zsgnl : this.zsgnr;

      // if inner_html is passed in the argument then set it
      if (inner_html != undefined)  
        ne.html(inner_html);

      // ne.hide();
      ne.fadeOut();
      ne.showing = false;

      // console.log(this.sto);
      // if (this.sto) clearTimeout(this.sto);
    },

    nv_toggle: function(lor, inner_html, auto_dismiss) {
      ne = (lor == 1) ? this.zsgnl : this.zsgnr;

      if (ne.showing)
        this.nv_hide(lor, inner_html);
      else
        this.nv_show(lor, inner_html, auto_dismiss);
    },

    render: function() {
      console.log("in render function for zs notify view");
      return this;
    }
  });

  return zsNotifyView;
});
