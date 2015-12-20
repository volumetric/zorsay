define(['ZorSayFrontView', 'bootstrap', 'text!templates/all_reviews.html',
        'views/review', 'models/Review'],
function(ZorSayFrontView, bootstrap, allReviewsTemplate, ReviewView, Review) {
  var allReviewsView = ZorSayFrontView.extend({
    el: $('#content'),

    skip: 0,
    anchor: 0,

    model: {
      user_info: {},
      toJSON: function(){
        return this.user_info;
      }
    },


    events: {
      // "submit form": "updateReview",
      // "hover .star": "onRatingHover",
      // "click .star": "onRatingClick"
      // "scroll window": "onScrollDo"
    },

    initialize: function() {

        // vent.on('user:info', function(user_info) {
        //   console.log(user_info);
        //   this.model.user_info = user_info;
        // });

        var that = this;
        $(window).scroll(function(){
          if($(window).scrollTop() + $(window).height() == $(document).height() && window.location.hash == '#reviews/all') {
            that.onScrollDo(that);
          }
        });

        this.onScrollDo();
//      console.log("init");
      // this.$(".star").hover(this.onRatingHover);
      // this.$(".star").live('mouseover',this.onRatingOver);
      // this.$(".star").live('mouseout',this.onRatingOut);
      // this.$(".star").live('click',this.onRatingClick);

      // <input type="text" placeholder="comment" name="csu_comment" maxlength="137" style="width:250px;"/>

      
      // this.$('textarea[name=pscategory]').live('keydown', this.pscategoryInputUI);
      // this.$('textarea[name=pscategory]').live('keyup', this.pscategoryInputNet);

      // this.$('input[eclass=rating_comment]').live('focus', this.showCharRemain);
      // this.$('input[eclass=rating_comment]').live('blur', this.hideCharRemain);
      // this.$('input[eclass=rating_comment]').live('keyup', this.updateCharRemain);

      // this.$(".star").hover(function(){console.log("aaaaaaaaaaaa")}, function(){console.log("ssssssssssssssss")});
      // this.$(".star").css("color","black");

      // alert("blank!!!");
      // this.$("#gtgt").text("Found the DOM");

      // $(this.el).find('.star').on('hover',this.onRatingHover, this.onRatingHover);
//      console.log("init_after_live_event_bindings_to_some_DOM_elements");

      // this.collection.on('add', this.onReviewAdded, this);
      // this.collection.on('reset', this.onReviewCollectionReset, this);
      // console.log("1");
    },

    // onScrollbottom: function() {
    //   // this.onScrollDo();
    //   var that = this;
    //   if($(window).scrollTop() + $(window).height() == $(document).height()) {
    //     this.onScrollDo(that);
    //   }
    // },

    onScrollDo: function(){
      // console.log("onScrollDo called");
      var that = this;
      if (that.skip != 0 && that.skip == that.anchor) {
        return;
      }
      $.ajax({
          type: "POST",
          // url: 'http://conterapp.appspot.com/postag',
          url: '/reviews/all',
          // contentType: 'application/x-www-form-urlencoded; ISO-8859-1,utf-8;q=0.7,*;q=0.3',
          // header: {
          //   'Accept-Charset' :'ISO-8859-1,utf-8;q=0.7,*;q=0.3'
          //   'Accept-Encoding':'gzip,deflate,sdch'
          //   'Accept-Language':'en-US,en;q=0.8'
          // },
          data: {
            skip: that.skip,
            anchor: that.anchor
            },
          success: function(data) {
              // console.log(typeof(data.results));
              // console.log(data.results);

              // sometimes multiple requests are sent and if a response has already come then ignore other responses
              if(data.skip > that.skip) {

                that.skip = data.skip;
                that.anchor = data.anchor;

                console.log("skip: "+that.skip);
                console.log("anchor: "+that.anchor);
                // var results_array = $.map(data.results, function(value, index) {
                //   return value;
                // });

                // var results_array = [];
                // for (var i = 0; i < data.results.length; i++) {
                //     results_array.push(data.results[i].name);
                // }

                // console.log(results_array);

                // var rcollection = new Backbone.Collection(data.results, { model: Review });
                // rcollection.set(results_array);

                // reviewCollection.url = '/reviews/all';
                // this.changeView(new AllReviewsView({
                  // collection: reviewCollection
                // }));
                // cannot fetch this its post request with skip and anchor parameters
                // reviewCollection.fetch();

                $.each(data.results, function (index, model) {
                  // console.log(model);
                  that.onReviewAdded(model);
                });
              }

              // $("#error").fadeOut();
              // console.log("got data back");
              // var regex = /\[?\(\s*\'([^\']+)\'\s*\,\s*\'([^\']+)\'\s*\)[\,\]]\s*/gm;
              // var regex = /\[?\(.*?\'([^\']+)\'\s*\,\s*\'([^\']+)\'\s*\)[\,\]]\s*/gm;
              // var ready_data = data.replace(regex, '<abbr pos="$2"> $1 </abbr>');
              // var ready_data = data.replace(regex, '<abbr pos="'+pos_upenn_tagset[regex.$2]+'"> $1 </abbr>');

              // var ready_data = data.replace(regex, function($0, $1, $2){
              //   return '<abbr pos="' + $2 + ': ' + pos_upenn_tagset[$2] + '"> '+ $1 +' </abbr>';
              // });

              // var ready_data = data.replace(regex, '<abbr pos="$2"> $1 </abbr>')
                  // ######################################################
                  // got some data in the following form:
                  // <abbr pos="DT"> The </abbr><abbr pos="ADJ"> first </abbr><abbr pos="ADJ"> major </abbr>
                  // replace all the "DT"s and "ADJ"s with: "determiner e.g.. the" and "adjective e.g.. big"
                  // then wrap this in a paragraph <p> and set it as html() of "div#pageContent"
                  // ######################################################
                  // var ready_data = data;

            //       var result_html = "<p>"+ready_data+"</p>"
            //       $("div#pageContent").html(result_html);
            //       termify();

            //       if (form.wiki_url)
            //   $('#content_url > h3').html('<a style="color:#19558d; font-weight: bold;" href="'+form.wiki_url+'" target="_blank">'+form.wiki_title+'</a>');
            // else
            //   $('#content_url > h3').html('');

            //   form.text_input.value = "";
            //   // $("#input_text_pos_btn").val('Process');
            //   $("#input_text_pos_btn").val('Process').attr('disabled',false);

              // $("#loading_gif").hide();
            }
      });
    },

    onReviewAdded: function(review) {
      // console.log("added");
      // if (!review.pscategory)
      //   review.pscategory = "n/a";
      var reviewHtml = (new ReviewView({ 
        model: {
          review: review,
          toJSON: function(){
            return this.review;
          }
        }
      })).render().el;
      // console.log("4");
      $(reviewHtml).appendTo('.review_list').hide().fadeIn('slow');
      // console.log("3");
    },

    // onReviewCollectionReset: function(collection) {
    //   // console.log("reset");
    //   var that = this;
    //   collection.each(function (model) {
    //     that.onReviewAdded(model);
    //   });
    //   // console.log("2");
    // },

    // pscategoryInputNet: function(e) {
    //   // console.log(e.which);
    //   // var c = String.fromCharCode(e.which);
    //   // console.log(c);

    //   // connect this fucker to websokets (use socket.io to cover fallback cases)

    //   if (e.which == 32) {

    //     // make it a psc_node element and POST it (use socket.io to cover fallback cases)  
    //     var d = $(this).val();

    //     // e.preventDefault();
    //     // console.log($(this).val());
    //     // var d = $(this).val();
    //     // $(this).val(d+" ");
    //   }
    // },

    // pscategoryInputUI: function(e) {
    //   console.log(e.which);
    //   // var c = String.fromCharCode(e.which);
    //   // console.log(c);

    //   if (e.which == 32) {
    //     // make a span element        
    //     var psc_node = $(this).val();
    //     $(this).val('');
    //     var remove_node_html = $('span .remove-node ').text('x');
    //     var psc_node_html = $('span .psc-node').html(remove_node_html);

    //     // $('span .psc-node').html($('span .remove-node ').text('x'));

    //     // console.log(psc_node_html);
    //     console.log($(this));
    //     // $(this).val('');

    //     console.log('psc_node_html_1');
    //     // $(this).next().html("<p>psc_node_html</p>");
    //     // $(this).next().html(psc_node_html);

    //     // $(this).next('div .psc_nodes').html($("p").css("display","inline-block").html(psc_node));
    //     // $(this).next('div .psc_nodes').append($("p").html(psc_node));

    //     // $(this).next('div .psc_nodes').append($("<p>"+psc_node+"</p>"+"<div><p>x</p></div>").css("display","inline-block").css("margin","3px").css("padding","4px").css("background-color","pink"));

    //     $(this).next('div .psc_nodes').append($("<div><abbr>"+psc_node+"</abbr>"+"<abbr href='#' class='remove_pscnode'> x</abbr></div>").css({
    //       "display":"inline-block",
    //       "margin":"3px",
    //       "padding":"4px",
    //       "color":"white",
    //       "background-color":"#428bca"
    //     }));

    //     $('a .remove_pscnode').on("mouseover",function(){console.log("remove_pscnode")});

    //     // $(this).next('div .psc_nodes').append($("<div class='pscn'><abbr>"+psc_node+"</abbr></div>").css({
    //     //   "display":"inline-block",
    //     //   "margin":"3px",
    //     //   "padding":"4px",
    //     //   "background-color":"pink"
    //     // }));

    //     // $(this).next('div .psc_nodes').append($("<abbr>x</abbr></div>").css({
    //     //   "display":"inline-block",
    //     //   "margin":"3px",
    //     //   "padding":"4px",
    //     //   "background-color":"pink"
    //     // }));


    //     // $(this).html($("p").css("display","inline-block").html(psc_node));
    //     // $(this).next().html($("div span").html(psc_node));

    //     // $('.psc_box').append(psc_node_html);

    //     // $("div .psc_nodes").text('fgggg');
    //     // $("div .psc_nodes").html($("div span .psc_node").text(psc_node));
        
    //     // $(this).html($('span .psc-node').html($('span .remove-node ').text('x')));
    //     console.log('psc_node_html_2');

    //     // e.preventDefault();
    //     // console.log($(this).val());
    //     // var d = $(this).val();
    //     // $(this).val(d+" ");
    //   }
    // },

//     showCharRemain: function() {
//       $(this).next('abbr').css("display","inline");
//     },

//     hideCharRemain: function() {
//       $(this).next('abbr').css("display","none");
//     },

//     updateCharRemain: function() {
//       // console.log('key up mannn');
//       var remain = $(this).attr('maxlength') - $(this).val().length;
// //      console.log(remain);
//       $(this).next('abbr').text(remain);
//     },




    // onRatingOver: function(e) {
    //   // console.log("rating over");
    //   // console.log(this.$(".star"));
    //   // console.log(this);
    //   // var stars = 
    //   // var a = $(this).prev();
    //   // while(a) {
    //   //   a.css("color","black");
    //   //   a = a.prev();
    //   // }

    //   $(this).siblings('a').css("color","");
    //   $(this).css("color","");

    //   $(this).prevAll('a').css("color","black");
    //   $(this).css("color","black");

    //   // $(this).siblings('a').removeClass("rated");
    //   // $(this).removeClass("rated");

    //   // $(this).prevAll('a').addClass("rated");
    //   // $(this).addClass("rated");

    // },

    // onRatingOut: function(e) {
    //   // console.log("rating out");
    //   // console.log(this.$(".star"));
    //   // console.log(this);
      
    //   $(this).siblings('a').css("color","");
    //   $(this).css("color","");

    //   $(this).siblings('.rated').css("color","black");
    //   if ($(this).hasClass("rated"))
    //     $(this).css("color","black");
      
    //   // $(this).siblings('a').removeClass("rated");
    //   // $(this).removeClass("rated");

    //   // // $(this).siblings('.rated').css("color","black");
    //   // // if ($(this).hasClass("rated"))
    //   // //   $(this).css("color","black");

    // },

//     onRatingClick: function(e) {
// //      console.log("clicked...rating");
      
//       $(this).siblings('a').removeClass("rated");
//       $(this).removeClass("rated");

//       $(this).prevAll('a').addClass("rated");
//       $(this).addClass("rated");

// //      console.log($(this).attr('rating'));
//       $(this).parent().attr('class',$(this).attr('rating'));
//       $(this).siblings('input[rating]').attr('rating',$(this).attr('rating'));
//       // $(this)..addClass("ddd");

//       return false;
//     },

    // clearStuff: function() {
    //   this.$(".vendor_box").val('');
    //   this.$(".psc_box").val('');
    //   this.$(".review_box").val('');
    //   this.$(".rating_comment").val('');

    //   this.$('input[type=hidden]').attr('rating','0');
      
    //   this.$(".star").removeClass('rated');
    //   this.$(".star").siblings('a').css("color","");
    //   this.$(".star").css("color","");

    // },

//     updateReview: function() {
//       // console.log("update");
//       var vendor = $('input[name=vendor]').val();
//       var pscategory = $('input[name=pscategory]').val();
//       var reviewText = $('textarea[name=review_text]').val();
      
//       var otd_rating = $('input[name=otd_rating]').attr('rating');
//       var otd_comment = $('input[name=otd_comment]').val();

//       var pad_rating = $('input[name=pad_rating]').attr('rating');
//       var pad_comment = $('input[name=pad_comment]').val();

//       var pri_rating = $('input[name=pri_rating]').attr('rating');
//       var pri_comment = $('input[name=pri_comment]').val();

//       var pro_rating = $('input[name=pro_rating]').attr('rating');
//       var pro_comment = $('input[name=pro_comment]').val();

//       var eos_rating = $('input[name=eos_rating]').attr('rating');
//       var eos_comment = $('input[name=eos_comment]').val();

//       var rrp_rating = $('input[name=rrp_rating]').attr('rating');
//       var rrp_comment = $('input[name=rrp_comment]').val();

//       var csu_rating = $('input[name=csu_rating]').attr('rating');
//       var csu_comment = $('input[name=csu_comment]').val();

// // otd_rating:otd_rating,
// // pad_rating:pad_rating,
// // pri_rating:pri_rating,
// // pro_rating:pro_rating,
// // eos_rating:eos_rating,
// // rrp_rating:rrp_rating,
// // csu_rating:csu_rating,
// // otd_comment:otd_comment,
// // pad_comment:pad_comment,
// // pri_comment:pri_comment,
// // pro_comment:pro_comment,
// // eos_comment:eos_comment,
// // rrp_comment:rrp_comment,
// // csu_comment:csu_comment

//       // var anonymous = $('#anonReviewCheckbox').attr('checked') ? 1 : 0;
//       var anonymous = $("#anonReviewCheckbox").is(":checked") ? "on" : "off";

//       var required = false;

//       if ( vendor == null || vendor.length < 1) {
//         $(".vendor_box").next().text("required");
//         required = true;
//       } else {
//         $(".vendor_box").next().text("");
//       }

//       if ( pscategory == null || pscategory.length < 1) {
//         $(".psc_box").next().text("required");
//         required = true;
//       } else {
//         $(".psc_box").next().text("");
//       }

//       if ( reviewText == null || reviewText.length < 1) {
//         $(".review_box").next().text("required");
//         required = true;
//       } else {
//         $(".review_box").next().text("");
//       }

//       if (required == true)
//         return false;

//       var that = this;
//       var reviewCollection = this.collection;
//       $.post('/accounts/me/reviews', {
//         reviewText: reviewText,
//         vendor: vendor,
//         pscategory: pscategory,
//         anonymous:anonymous,
//         otd_rating:otd_rating,
//         pad_rating:pad_rating,
//         pri_rating:pri_rating,
//         pro_rating:pro_rating,
//         eos_rating:eos_rating,
//         rrp_rating:rrp_rating,
//         csu_rating:csu_rating,
//         otd_comment:otd_comment,
//         pad_comment:pad_comment,
//         pri_comment:pri_comment,
//         pro_comment:pro_comment,
//         eos_comment:eos_comment,
//         rrp_comment:rrp_comment,
//         csu_comment:csu_comment        
//       }, function(data) {
//         // console.log("about to add the review to collection on frontend side.");
//         reviewCollection.add(new Review({
//           reviewText: reviewText,
//           vendor: vendor,
//           pscategory: pscategory,
//           anonymous:anonymous,
//           otd_rating:otd_rating,
//           pad_rating:pad_rating,
//           pri_rating:pri_rating,
//           pro_rating:pro_rating,
//           eos_rating:eos_rating,
//           rrp_rating:rrp_rating,
//           csu_rating:csu_rating,
//           otd_comment:otd_comment,
//           pad_comment:pad_comment,
//           pri_comment:pri_comment,
//           pro_comment:pro_comment,
//           eos_comment:eos_comment,
//           rrp_comment:rrp_comment,
//           csu_comment:csu_comment
//         }));

//         that.clearStuff();
//         $("#review_submit_msg").fadeOut();
//         $("#review_submit_msg").html('Thanks for sharing.');
//         $("#review_submit_msg").fadeIn();

//       });
//       return false;
//     },

    render: function() {
      $(this.el).html(_.template(allReviewsTemplate, this.model.toJSON()));
      // this.$el.html(allReviewsTemplate);
      $('.dropdown-toggle').dropdown();
      // this.$(".star").attr("tabindex","-1");
      // this.$(".star").css("text-decoration","none").css("outline","none");
      // this.$(".class_remain").css("color","red");
      // this.$("input[eclass=rating_comment]").attr("maxlength","137");
      // this.$("input[eclass=rating_comment]").css("width","300px");
      // this.$("input[eclass=rating_comment]").addClass("rating_comment");

      // this.$('input[name=pscategory]').val('');
      // this.$("div#star_rating_with_comments span").css("padding-right","20px");
    }
  });

  return allReviewsView;
});
