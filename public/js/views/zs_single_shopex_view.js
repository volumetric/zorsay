define(['Backbone', 'bootstrap', 'summernote', 'views/zs_notify_view', 'views/zs_access_control_view'], function(B, b, s, zsNotifyView, zsAccessControlView) {
  console.log("inside zs_single_shopex_view")
  var zsSingleShopexView = Backbone.View.extend({
    el: 'body',

    events: {
      "click .shopex_edit a": "shopex_edit",
      "click .shopex_save a": "shopex_save",

      "click .shopex-div .zs_shopex_thankyou": "zs_shopex_thankyou",
      // "click .shopex-div .zs_comment_count": "toggle_comments",
      // "click .shopex-comment-btn": "shopex_comment",

      // "click .spx-comment": "comment_click",
    },

    initialize: function(args) {
      console.log("zs single shopex view initialized")
      zsNotifyView = new zsNotifyView();
      zsAccessControlView = new zsAccessControlView();

      this.post_pub_id = args.post_pub_id;

      // console.log(this.post_pub_id);

      // $('.slider').slider();
      // $('.slider').slider().hideTooltip();

      // $(document).on( 'click', '.shopex_edit', this.shopex_edit );
      // $(document).on( 'click', '.shopex_save', this.shopex_save );


      // this.$(".spx-comment").on('click', function(){
      //   console.log($(this).attr('data-content'));
      // });

      $(".spx-comment").popover({
        trigger: 'hover',
        // selector: '.criteria_content',
        html: true,
      });

      this.$(".spx-comment").on('click', this.comment_click);
      $(".spx-comment").attr("stick", '0');

      // var showPopover = function () {
      //     $(this).popover('show');
      // };
      // var hidePopover = function () {
      //     $(this).popover('hide');
      // };

      // // console.log("data-poload hover binding");
      // $('[data-poload]').bind('mouseover',function() {
      //     // console.log("data-poload hover");
      //     var e=$(this);
      //     e.unbind('mouseover');
      //     $.get(e.data('poload'),function(d) {
      //         // console.log(d);
      //         e.popover({
      //           content: d, 
      //           html:true, 
      //           'tab-index':-1, 
      //           // trigger:'mouseover',
      //           // trigger:'manual',
      //           trigger:'hover',
      //           delay: {hide: 250, show:80},
      //           placement: 'bottom',
      //           container: e,
      //         }).popover('show')
      //         // .focus(showPopover)
      //         // .blur(hidePopover)
      //         // .mouseover(showPopover)
      //         // .mouseleave(hidePopover);
      //     });
      // });

      // $('[data-poload]').popover({
      //   html: true,
      //   // trigger: 'hover',
      //   content: function(){
      //       e = $(this);
      //       var div_id =  "div-id-" + $.now();
      //       return details_in_popup(e.data('poload'), div_id)
      //   }
      // });


      // var details_in_popup = function (link, div_id){
      //   console.log("details_in_popup");
      //   $.ajax({
      //       url: link,
      //       success: function(response){
      //           $('#'+div_id).html(response)}});
      //   return '<div id="'+ div_id +'">Loading...</div>'
      // };

    },

    // shopex_comment: function() {
    //   parent_str = this.$(".post-div").attr("id");

    //   comment_obj = {
    //     commentText: this.$(".add-comment .comment-content").val(),
    //     parent_name: parent_str.split('_')[0],
    //     parent_pub_id: parent_str.split('_')[1],
    //     anon: "off",
    //   }

    //   console.log(parent_str);
    //   console.log(comment_obj);

    //   $.post('/comment', comment_obj, function(data){
    //     // this.$(".shopex_save").removeClass("shopex_save").addClass("shopex_edit");
    //     // this.$(".shopex_edit a").html("Edit");
    //   });

    // },

    comment_click: function() {
      // this.$(".spx-comment").popover('hide');
      console.log("comment_click");
      
      // #WORKING
      // console.log($(this).attr('data-content'));

      // var img = '<img src="https://si0.twimg.com/a/1339639284/images/three_circles/twitter-bird-white-on-blue.png" />';

      // var d = $(this).attr('data-content');
      // console.log(d)

      // $(this).popover({
      //   content : d,
      //   html: true,
      // }).popover('hide');

      // $(d).css("display", "none");

      // $(this).popover({
      //   // trigger: 'click',
      //   // selector: '.criteria_content',
      //   html: true,
      // });

      // var d = $(this).attr('data-content');
      // $(d).css("display", "none");
      // $("body").append($(d));

      // dd = $("div").html(d)
      // console.log($(d));

      // $(d).css({
      //   position: "absolute",
      //   display: "block"
      // })

      // $("body").append($(d));

      // console.log(this);
      // if ($(this).attr("stick") == "0")
      //   $(this).attr("stick") = "1"
      // else
      //   $(this).attr("stick") = "0"
      // $(this).popover('toggle');
    },

    shopex_edit: function() {
      // console.log("inside shopex_edit");
      // zsNotifyView.nv_show(1);

      if (zsAccessControlView.isAdmin() || zsAccessControlView.isStaff()) {
        this.$(".shopex_text_editable").summernote({
          // height: 300,
          focus: true,
          toolbar: [
            ['style', ['style']], // no style button
            ['style', ['bold', 'italic', 'underline']],
            ['para', ['ul', 'ol']],
            ['insert', ['picture', 'video', 'link']], // no insert buttons
            // ['fontsize', ['fontsize']],
            // ['color', ['color']],
            // ['height', ['height']],
            // ['table', ['table']], // no table button
            // ['help', ['help']] //no help button
            ['misc', ['codeview', 'fullscreen']],
          ],
        });
      } else {
        this.$(".shopex_text_editable").summernote({
          // height: 300,
          focus: true,
          toolbar: [
            ['style', ['style']], // no style button
            ['style', ['bold', 'italic', 'underline']],
            ['para', ['ul', 'ol']],
            ['insert', ['picture', 'video', 'link']], // no insert buttons
            // ['fontsize', ['fontsize']],
            // ['color', ['color']],
            // ['height', ['height']],
            // ['table', ['table']], // no table button
            // ['help', ['help']] //no help button
          ],
        });
      }

      this.$(".shopex_edit").removeClass("shopex_edit").addClass("shopex_save");
      this.$(".shopex_save a").html("Save");



      // this.$(".comment_summernote").hallo({editable: true});
      // this.$(".shopex_comment").attr("contenteditable", true);
      
      var sds = this.$(".spx-comment").attr("data-content");
      // this.$(".spx-comment").attr("data-content") = sds.replace("contenteditable='false'", "contenteditable='true'");

      // that = this;
      // this.$(".comment_summernote").on("click", function(){
      //   // that.$(".comment_summernote").destroy();
      //   // that.$(".comment_summernote").hallo({editable: false});

      //   $(this).hallo();
      //   // $(this).summernote({
      //   // // this.$(".summernote").summernote({
      //   //   focus: true,
      //   //   toolbar: [],
      //   // });
      // });
      
      // $('.note-toolbar .note-fontsize, .note-toolbar .note-color, .note-toolbar .note-para .dropdown-menu li:first, .note-toolbar .note-line-height').remove();


    },

    getShopexEditObj: function() {

      us = {};
      us.content_text = this.$(".shopex_text_editable").code();

      us.otd_rating = this.$("#zs_otd .user-criteria-rating").attr("zsrvalue");
      us.pad_rating = this.$("#zs_pad .user-criteria-rating").attr("zsrvalue");
      us.pro_rating = this.$("#zs_pro .user-criteria-rating").attr("zsrvalue");
      us.pri_rating = this.$("#zs_pri .user-criteria-rating").attr("zsrvalue");
      us.eos_rating = this.$("#zs_eos .user-criteria-rating").attr("zsrvalue");
      us.csu_rating = this.$("#zs_csu .user-criteria-rating").attr("zsrvalue");
      us.rrp_rating = this.$("#zs_rrp .user-criteria-rating").attr("zsrvalue");
      us.all_rating = this.$("#zs_all .user-criteria-rating").attr("zsrvalue");
  
      us.otd_comment = this.$("#zs_otd .user-criteria-comment").attr("zscvalue");
      us.pad_comment = this.$("#zs_pad .user-criteria-comment").attr("zscvalue");
      us.pri_comment = this.$("#zs_pri .user-criteria-comment").attr("zscvalue");
      us.pro_comment = this.$("#zs_pro .user-criteria-comment").attr("zscvalue");
      us.eos_comment = this.$("#zs_eos .user-criteria-comment").attr("zscvalue");
      us.csu_comment = this.$("#zs_csu .user-criteria-comment").attr("zscvalue");
      us.rrp_comment = this.$("#zs_rrp .user-criteria-comment").attr("zscvalue");

      // #TODO include edit_summary field here
      return us;
    },

    shopex_save: function() { 
      // console.log("in shopex_save");
      zsNotifyView.nv_show(1);

      // this.$("#reviewText_editable").destroy();
      // this.$(".shopex_text_editable").destroy();
      // console.log(this.$(".shopex_text_editable").html());

      // this.$(".comment_summernote").hallo({editable: false});      
      // this.$(".shopex_comment_editable").attr("contenteditable", false);

      updated_shopex = this.getShopexEditObj();
      // console.log(updated_shopex);


      // that = this;
      // $.post('/shopping-experience/pub_id/', updated_shopex, function(data){


      // $.post('/shopping-experience/'+this.post_pub_id, updated_shopex, function(data){
      //   console.log("shopex edited successfully");
      //   // that.$(".shopex_save").removeClass("shopex_save").addClass("shopex_edit");
      //   // that.$(".shopex_edit a").html("Edit");
      //   zsNotifyView.nv_hide(1);
      // });

      // this.$(".shopex_save").removeClass("shopex_save").addClass("shopex_edit");
      // this.$(".shopex_edit a").html("Edit");


      that = this;
      $.ajax({
        type: 'POST',
        url: '/shopping-experience/'+that.post_pub_id,
        data: updated_shopex,
        success: function(data, status, jqxhr) {
          // console.log("shopex edited successfully")
          
          that.$(".shopex_save").removeClass("shopex_save").addClass("shopex_edit");
          that.$(".shopex_edit a").html("Edit");

          that.$(".shopex_text_editable").destroy();
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.status, status);
          // #TODO display the html message sent by the server
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      });

      // $.ajax('/shopping-experience/pub_id/', updated_shopex, function(data){});

      // this.$("#comment_editable_otd .user-criteria-comment").html();
      // this.$("#comment_editable_otd .user-criteria-rating").html();

      // console.log(this.$("#comment_editable_otd .user-criteria-comment").html());
      // console.log(this.$("#comment_editable_otd .user-criteria-rating").html());



      // console.log(this.$("#reviewText_editable").html().trim());

      // this.$("#reviewText_editable").html().trim()
      
    },

    zs_shopex_thankyou: function(e) {
      console.log("Inside zs_shopex_thankyou");
      zsNotifyView.nv_show(1);

      shopex_id = $(".post-div").attr("id").split("_")[1];

      $.ajax({
        type: 'POST',
        url: '/shopping-experience/'+shopex_id+'/meta/upvote',
        success: function(data, status, jqxhr) {
          // console.log(data);
          // console.log(status);

          var st_element = $('.zs_shopex_thankyou');
          var st_val_element = $('.zs_shopex_thankyou i');
          
          // var parent_div = $(e.target).closest(".post-div");

          // var st_element = $(parent_div.find('.zs_shopex_thankyou'));
          // var st_val_element = $(parent_div.find('.zs_shopex_thankyou i'));


          var st = st_val_element.text();

          if (st_element.hasClass("active")){
            st = parseInt(st) - 1;
          } else {
            st = parseInt(st) + 1;
          }

          st_element.toggleClass("thanked").toggleClass("active");
          // console.log(st);
          st_val_element.text(st);

          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(status);
          // #TODO display the html message sent by the server
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      })
      return false;
    },

    // toggle_comments: function(e) {
    //   // console.log("toggle_comments wrap");
    //   // this.$("#comment-container").toggle();

    //   $(e.target).closest(".post-div").find(".comment-container-wrap").toggle();
    //   return false;
    // },

    render: function() {
      // console.log("in all_shopex_view render function");
      return this;
    }

  });

  return zsSingleShopexView;
});