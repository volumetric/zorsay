define(['ZorSayFrontView', 'text!templates/userhome.html',
        'views/review', 'models/Review', 'hallo', 'shopex', 'bootstrap', 'css!styles/font-awesome.css', 'css!styles/jquery-ui-1.10.3.custom.min.css'],// 'css!styles/hallo.css'],
function(ZorSayFrontView, userHomeTemplate, ReviewView, Review, Hallo, shopex, bootstrap) {
  var userHomeView = ZorSayFrontView.extend({
    el: $('#content'),

    events: {
      "submit form": "updateReview",
      // "hover .star": "onRatingHover",
      // "click .star": "onRatingClick"
    },

    model: {
      user_info: {},
      toJSON: function(){
        return this.user_info;
      }
    },

    initialize: function() {
      console.log("Test output userhome.js");
      console.log("$: " + typeof($));
      // that = this;

      // vent.on('user:info', function(user_info) {
      //   console.log(user_info);
      //   that.model.user_info = user_info;
      // });

      // console.log("userhome.js shopex before");
      // this.$("*").shopex();
      // console.log("userhome.js shopex after");

//      console.log("init");
      // this.$(".star").hover(this.onRatingHover);
      // this.$(".star").live('mouseover',this.onRatingOver);
      // this.$(".star").live('mouseout',this.onRatingOut);
      // this.$(".star").live('click',this.onRatingClick);


      // <input type="text" placeholder="comment" name="csu_comment" maxlength="137" style="width:250px;"/>

      
      // this.$('textarea[name=pscategory]').live('keydown', this.pscategoryInputUI);
      // this.$('textarea[name=pscategory]').live('keyup', this.pscategoryInputNet);

      // ########################################################################
      // show the remaining number of chars in the comment text box
      // this.$('.rating_comment').live('focus', this.showCharRemain);
      // this.$('.rating_comment').live('blur', this.hideCharRemain);
      // this.$('.rating_comment').live('keyup', this.updateCharRemain);

      $(document).on( 'focus', '.rating_comment', this.showCharRemain );
      $(document).on( 'blur', '.rating_comment', this.hideCharRemain );
      $(document).on( 'keyup', '.rating_comment', this.updateCharRemain );

      // this.$('.rating_comment').on('focus', this.showCharRemain);
      // this.$('.rating_comment').on('blur', this.hideCharRemain);
      // this.$('.rating_comment').on('keyup', this.updateCharRemain);
      // ########################################################################

      // this.$(".star").hover(function(){console.log("aaaaaaaaaaaa")}, function(){console.log("ssssssssssssssss")});
      // this.$(".star").css("color","black");

      // alert("blank!!!");
      // this.$("#gtgt").text("Found the DOM");

      // $(this.el).find('.star').on('hover',this.onRatingHover, this.onRatingHover);
//      console.log("init_after_live_event_bindings_to_some_DOM_elements");

      this.collection.on('add', this.onReviewAdded, this);
      this.collection.on('reset', this.onReviewCollectionReset, this);
      // console.log("1");
    },

    pscategoryInputNet: function(e) {
      // console.log(e.which);
      // var c = String.fromCharCode(e.which);
      // console.log(c);

      // connect this fucker to websokets (use socket.io to cover fallback cases)

      if (e.which == 32) {

        // make it a psc_node element and POST it (use socket.io to cover fallback cases)  
        var d = $(this).val();

        // e.preventDefault();
        // console.log($(this).val());
        // var d = $(this).val();
        // $(this).val(d+" ");
      }
    },

    pscategoryInputUI: function(e) {
      console.log(e.which);
      // var c = String.fromCharCode(e.which);
      // console.log(c);

      if (e.which == 32) {
        // make a span element        
        var psc_node = $(this).val();
        $(this).val('');
        var remove_node_html = $('span .remove-node ').text('x');
        var psc_node_html = $('span .psc-node').html(remove_node_html);

        // $('span .psc-node').html($('span .remove-node ').text('x'));

        // console.log(psc_node_html);
        console.log($(this));
        // $(this).val('');

        console.log('psc_node_html_1');
        // $(this).next().html("<p>psc_node_html</p>");
        // $(this).next().html(psc_node_html);

        // $(this).next('div .psc_nodes').html($("p").css("display","inline-block").html(psc_node));
        // $(this).next('div .psc_nodes').append($("p").html(psc_node));

        // $(this).next('div .psc_nodes').append($("<p>"+psc_node+"</p>"+"<div><p>x</p></div>").css("display","inline-block").css("margin","3px").css("padding","4px").css("background-color","pink"));

        $(this).next('div .psc_nodes').append($("<div><abbr>"+psc_node+"</abbr>"+"<abbr href='#' class='remove_pscnode'> x</abbr></div>").css({
          "display":"inline-block",
          "margin":"3px",
          "padding":"4px",
          "color":"white",
          "background-color":"#428bca"
        }));

        $('a .remove_pscnode').on("mouseover",function(){console.log("remove_pscnode")});

        // $(this).next('div .psc_nodes').append($("<div class='pscn'><abbr>"+psc_node+"</abbr></div>").css({
        //   "display":"inline-block",
        //   "margin":"3px",
        //   "padding":"4px",
        //   "background-color":"pink"
        // }));

        // $(this).next('div .psc_nodes').append($("<abbr>x</abbr></div>").css({
        //   "display":"inline-block",
        //   "margin":"3px",
        //   "padding":"4px",
        //   "background-color":"pink"
        // }));


        // $(this).html($("p").css("display","inline-block").html(psc_node));
        // $(this).next().html($("div span").html(psc_node));

        // $('.psc_box').append(psc_node_html);

        // $("div .psc_nodes").text('fgggg');
        // $("div .psc_nodes").html($("div span .psc_node").text(psc_node));
        
        // $(this).html($('span .psc-node').html($('span .remove-node ').text('x')));
        console.log('psc_node_html_2');

        // e.preventDefault();
        // console.log($(this).val());
        // var d = $(this).val();
        // $(this).val(d+" ");
      }
    },

    showCharRemain: function() {
      var num_chars = $(this).val().length;

      if (num_chars == 0)
        $(this).parent().next('abbr').html(137);

      $(this).parent().next('abbr').css("display","inline");
    },

    hideCharRemain: function() {
      $(this).parent().next('abbr').css("display","none");
    },

    updateCharRemain: function(e) {
      // console.log('key up mannn');
      var num_chars = $(this).val().length;
      
      if (num_chars == 0) {
        $(this).parent().next('abbr').html(137);
      } else if (num_chars < 9) {
        var more = 9 - num_chars;
        $(this).parent().next('abbr').html('<b>' + more + '</b> to go');
      } else {
        var remain = $(this).attr('maxlength') - num_chars;
        $(this).parent().next('abbr').html('<b>' + remain + '</b> left');
      }
//      console.log(remain);
      
    },

    onReviewCollectionReset: function(collection) {
      // console.log("reset");
      var that = this;
      collection.each(function (model) {
        that.onReviewAdded(model);
      });
      // console.log("2");
    },

    onReviewAdded: function(review) {
      // console.log("added");
      // if (!review.pscategory)
      //   review.pscategory = "n/a";
      var reviewHtml = (new ReviewView({ model: review })).render().el;
      // console.log("4");
      $(reviewHtml).prependTo('.review_list').hide().fadeIn('slow');
      // console.log("3");
    },

    onRatingOver: function(e) {
      // console.log("rating over");
      // console.log(this.$(".star"));
      // console.log(this);
      // var stars = 
      // var a = $(this).prev();
      // while(a) {
      //   a.css("color","black");
      //   a = a.prev();
      // }

      $(this).siblings('a').css("color","");
      $(this).css("color","");

      $(this).prevAll('a').css("color","black");
      $(this).css("color","black");

      // $(this).siblings('a').removeClass("rated");
      // $(this).removeClass("rated");

      // $(this).prevAll('a').addClass("rated");
      // $(this).addClass("rated");

    },

    onRatingOut: function(e) {
      // console.log("rating out");
      // console.log(this.$(".star"));
      // console.log(this);
      
      $(this).siblings('a').css("color","");
      $(this).css("color","");

      $(this).siblings('.rated').css("color","black");
      if ($(this).hasClass("rated"))
        $(this).css("color","black");
      
      // $(this).siblings('a').removeClass("rated");
      // $(this).removeClass("rated");

      // // $(this).siblings('.rated').css("color","black");
      // // if ($(this).hasClass("rated"))
      // //   $(this).css("color","black");

    },

    onRatingClick: function(e) {
//      console.log("clicked...rating");
      
      $(this).siblings('a').removeClass("rated");
      $(this).removeClass("rated");

      $(this).prevAll('a').addClass("rated");
      $(this).addClass("rated");

//      console.log($(this).attr('rating'));
      $(this).parent().attr('class',$(this).attr('rating'));
      $(this).siblings('input[rating]').attr('rating',$(this).attr('rating'));
      // $(this)..addClass("ddd");

      return false;
    },

    clearStuff: function() {
      $(".vendor_box").val('');
      $(".psc_box").val('');
      $(".review_box").val('');
      $(".rating_comment").val('');

      
      // #TODO
      //call some function in script.js (shopex) to clear the ratings      
      animationTime = 200;
      $("dd[id^=rating] li a").stop().animate({ backgroundColor : "#333" } , animationTime);
      $('dd[id^=rating]').attr('rating', 0);

      $('div[id^=ratinginfo]').html('');
      $('.calc_rating').html('');


      // this.$(".star").removeClass('rated');
      // this.$(".star").siblings('a').css("color","");
      // this.$(".star").css("color","");

    },

    updateReview: function() {
      // console.log("update");
      var vendor = $('input[name=vendor]').val();
      var pscategory = $('input[name=pscategory]').val();
      var reviewText = $('textarea[name=review_text]').val();
      
      var otd_rating = $('dd#rating1').attr('rating');
      var otd_comment = $('textarea[name=otd_comment]').val();

      var pad_rating = $('dd#rating2').attr('rating');
      var pad_comment = $('textarea[name=pad_comment]').val();

      var pri_rating = $('dd#rating3').attr('rating');
      var pri_comment = $('textarea[name=pri_comment]').val();

      var pro_rating = $('dd#rating4').attr('rating');
      var pro_comment = $('textarea[name=pro_comment]').val();

      var eos_rating = $('dd#rating5').attr('rating');
      var eos_comment = $('textarea[name=eos_comment]').val();
      
      var csu_rating = $('dd#rating6').attr('rating');
      var csu_comment = $('textarea[name=csu_comment]').val();

      var rrp_rating = $('dd#rating7').attr('rating');
      var rrp_comment = $('textarea[name=rrp_comment]').val();

      var all_rating = $('dd#rating8').attr('rating');
      


// otd_rating:otd_rating,
// pad_rating:pad_rating,
// pri_rating:pri_rating,
// pro_rating:pro_rating,
// eos_rating:eos_rating,
// rrp_rating:rrp_rating,
// csu_rating:csu_rating,
// otd_comment:otd_comment,
// pad_comment:pad_comment,
// pri_comment:pri_comment,
// pro_comment:pro_comment,
// eos_comment:eos_comment,
// rrp_comment:rrp_comment,
// csu_comment:csu_comment

      // var anonymous = $('#anonReviewCheckbox').attr('checked') ? 1 : 0;
      var anonymous = $("#anonReviewCheckbox").is(":checked") ? "on" : "off";

      // var required = false;

      // if ( vendor == null || vendor.length < 1) {
      //   $(".vendor_box").next().text("required");
      //   required = true;
      // } else {
      //   $(".vendor_box").next().text("");
      // }

      // if ( pscategory == null || pscategory.length < 1) {
      //   $(".psc_box").next().text("required");
      //   required = true;
      // } else {
      //   $(".psc_box").next().text("");
      // }

      // if ( reviewText == null || reviewText.length < 1) {
      //   $(".review_box").next().text("required");
      //   required = true;
      // } else {
      //   $(".review_box").next().text("");
      // }

      // if (required == true)
      //   return false;

      var that = this;
      var reviewCollection = this.collection;
      $.post('/accounts/me/reviews', {
        reviewText: reviewText,
        vendor: vendor,
        pscategory: pscategory,
        anonymous:anonymous,
        otd_rating:otd_rating,
        pad_rating:pad_rating,
        pri_rating:pri_rating,
        pro_rating:pro_rating,
        eos_rating:eos_rating,
        rrp_rating:rrp_rating,
        csu_rating:csu_rating,
        all_rating:all_rating,
        otd_comment:otd_comment,
        pad_comment:pad_comment,
        pri_comment:pri_comment,
        pro_comment:pro_comment,
        eos_comment:eos_comment,
        rrp_comment:rrp_comment,
        csu_comment:csu_comment,
      }, function(data) {
        // console.log("about to add the review to collection on frontend side.");
        reviewCollection.add(new Review({
          reviewText: reviewText,
          vendor: vendor,
          pscategory: pscategory,
          anonymous:anonymous,
          otd_rating:otd_rating,
          pad_rating:pad_rating,
          pri_rating:pri_rating,
          pro_rating:pro_rating,
          eos_rating:eos_rating,
          rrp_rating:rrp_rating,
          csu_rating:csu_rating,
          all_rating:all_rating,
          otd_comment:otd_comment,
          pad_comment:pad_comment,
          pri_comment:pri_comment,
          pro_comment:pro_comment,
          eos_comment:eos_comment,
          rrp_comment:rrp_comment,
          csu_comment:csu_comment,
        }));

        that.clearStuff();
        $("#review_submit_msg").fadeOut();
        $("#review_submit_msg").html('Success, Thanks for sharing.');
        $("#review_submit_msg").fadeIn();

      });
      return false;
    },

    render: function() {
      // console.log(this.model.toJSON());
      // $(this.el).html(_.template(reviewTemplate, this.model.toJSON()));
      // $(this.el).html(_.template(userHomeTemplate, this.model.toJSON()));

      // this.$el.html(_.template(userHomeTemplate, this.model.toJSON()));
      this.$el.html(_.template(userHomeTemplate, this.model.toJSON()));
      // this.$el.html(userHomeTemplate);

      this.$("dd[id^=rating] li a").attr("tabindex","-1");
      this.$("dd[id^=rating] li a").css("text-decoration","none").css("outline","none");
      this.$('*').shopex();
      // this.$(".char_remain").css("color","red");
      this.$(".rating_comment").attr("maxlength","137");
      // this.$(".rating_comment").css("width","300px");
      // this.$(".rating_comment").addClass("rating_comment");

      this.$('input[name=pscategory]').val('');
      // this.$("div#star_rating_with_comments span").css("padding-right","20px");
      this.$("#cancel_button").click(this.clearStuff);

      $("#review_submit_msg").hide();

      $('.editable').hallo({
        plugins: {
          'halloformat': {},
          'halloheadings': {},
          'hallolists': {},
          'halloreundo': {},
          'halloindicator': {},
          'hallojustify': {},
          'hallolink': {},
        },
        toolbar: 'halloToolbarFixed'
      });
      
      $('.dropdown-toggle').dropdown();
    }
  });

  return userHomeView;
});
