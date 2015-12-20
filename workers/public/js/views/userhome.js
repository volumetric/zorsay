define(['ZorSayFrontView', 'text!templates/userhome.html',
        'views/review', 'models/Review', 'hallo', 'shopex', 'bootstrap', 'select2', 'summernote', 'css!styles/font-awesome.css', 'css!styles/jquery-ui-1.10.3.custom.min.css', 'css!styles/select2.css', 'css!styles/summernote.css', 'css!styles/codemirror.min.css', 'css!styles/monokai.min.css'],// 'css!styles/hallo.css'],
function(ZorSayFrontView, userHomeTemplate, ReviewView, Review, Hallo, shopex, bootstrap, select2, summernote) {
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
      // console.log("Test output userhome.js");
      // console.log("$: " + typeof($));
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

        // $('#psc_box').append(psc_node_html);

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
      console.log($(this).val());

      var num_chars = $(this).val().length;

      if (num_chars == 0)
        $(this).parent().next('abbr').html(137);

      $(this).parent().next('abbr').css("display","inline");
    },

    hideCharRemain: function() {
      console.log($(this).val());
      $(this).parent().next('abbr').css("display","none");
    },

    updateCharRemain: function(e) {
      console.log($(this).val());
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
      console.log(JSON.stringify(review));
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
      
      // $("#vendor_box").val('');
      $("#vendor_box").select2("val", "");

      // $("#psc_box").val('');
      $("#psc_box").select2("val", "");

      $("#review_box").val('');
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
      // console.log("inside updateReview")
      // console.log("update");
      // var vendor = $('input[name=vendor]').val();
      var vendor = $('#vendor_box').val();

      // var pscategory = $('input[name=pscategory]').val();
      var pscategory = $('#psc_box').val();

      // var reviewText = $('textarea[name=review_text]').val();
      var reviewText = $('#review_box').val();
      
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

      // console.log(vendor)
      // console.log(pscategory)

      // if ( vendor == null || vendor.length < 1) {
      //   console.log("vendor empty")
      //   // $("#vendor_box").next().text("required");
      //   // $(".vendor_box").next().next().text("required");
      //   // required = true;
      //   // $(".vendor_box .field-required").show()
      //   $(".field-required").css("display","block");
      // } else {
      //   // $("#vendor_box").next().text("");
      //   // $(".vendor_box .field-required").hide()
      //   $(".field-required").css("display","none");
      // }

      // if ( pscategory == null || pscategory.length < 1) {
      //   console.log("psc empty")
      //   // $("#psc_box").next().text("sssssss")
      //   // $("#psc_box").next().text("required");
      //   // $(".psc_box").next().next().text("required");
      //   // required = true;
      //   // $(".psc_box .field-required").show()
      //   $(".field-required").css("display","block");
      // } else {
      //   // $("#psc_box").next().text("");
      //   // $(".psc_box .field-required").hide()
      //   $(".field-required").css("display","none");
      // }

      // if ( reviewText == null || reviewText.length < 1) {
      //   $("#review_box").next().text("required");
      //   required = true;
      // } else {
      //   $("#review_box").next().text("");
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

      // this.$('#psc_box').val('');
      // this.$("div#star_rating_with_comments span").css("padding-right","20px");
      this.$("#cancel_button").click(this.clearStuff);

      $("#review_submit_msg").hide();

      // $("#vendor_box").select2();
      // $("#e1").select2();

      // $("#e1").select2({
      //   data:[
      //     {id:0,text:'enhancement'},
      //     {id:1,text:'bug'},
      //     {id:2,text:'duplicate'},
      //     {id:3,text:'invalid'},
      //     {id:4,text:'wontfix'}
      //     ]
      // });

      $("#vendor_box").select2({
        tags:["100bestbuy.com","33percent.in","48craft.com","6ycollective.com","99labels.com","9rasa.com","aaneri.com","aaramshop.com","acmefitness.in","adexmart.com","afday.com","allschoolstuff.com","amazon.in","amzer.co.in","anytimeretail.com","archiesonline.com","aromashop.in","at-home.co.in","atmydoorsteps.com","autofresh.in","babyoye.com","bagittoday.com","bagskart.com","bajaao.com","balgopal.com","basecamp.in","basicslife.in","bata.in","bazaar24x7.com","beinghumanwatches.com","bestylish.com","bewakoof.com","bigadda.com","bigcmobiles.in","bitfang.com","bluestone.com","bluoshn.com","bookadda.com","brandmile.com","brandsndeals.com","brandsvillage.com","buyatbrands.com","buzzlingbabyshop.com","cablesetc.in","cakesnflowers.com","camera.zoomin.com","candere.com","caratlane.com","carltonlondon.com","casioindiaclub.com","cbazaar.in","chumbak.in","cilory.com","computerwarehousepricelist.com","coolbuy.in","cosmetix.in","craffts.com","craftila.com","craftsvilla.com","cramster.in","cricketweekly.in","cromaretail.com","crossword.in","cytail.com","dailydealbazaar.com","dailyobjects.com","dalrice.com","dcbooks.com","dcube.in","dealextreme.com","dealsandyou.com","dell.co.in","dholdhamaka.com","dialabook.in","discountsvu.com","donebynone.com","dvdstore.erosentertainment.com","ebags.com","ebay.in","edigiworld.com","egully.com","emegamart.com","engrave.in","eshakti.com","excitinglives.com","exclusively.in","ezoneonline.in","fabfurnish.com","fabindia.com","farm2kitchen.com","fashionandyou.com","fashionara.com","fashos.com","fastrack.in","fetise.com","firstcry.com","flipkart.com","flora69.com","floraindia.com","floshowers.com","flowernferns.com","flowersnfruits.com","fnp.com","fopping.com","freecultr.com","funktees.com","game4u.com","garmentmall.com","getbestflowers.com","ghadiwala.com","giftahealth.com","giftbig.com","giftsforever.co.in","gitanjaligifts.com","globusstores.com","gobol.in","goldiesmart.com","goodlife.com","greenandgoodstore.com","greengoldstore.com","gujaratgifts.com","health-shoppe.com","healthkart.com","her-style.in","hidesign.com","homeshop18.com","hoopos.com","hopscotch.in","hushbabies.com","imstylish.in","indiacircus.com","indiaemporium.com","indiafloristonline.com","indiaflowersdelivery.com","indianbooks.co.in","indiangiftsportal.com","indianhanger.com","indiaplaza.com","indiarush.com","indulekha.biz","induna.com","infibeam.com","inkfruit.com","intencity.in","itasveer.com","jabong.com","jadtarjewell.co.in","jewelskart.com","jjmehta.com","jnanamudramontessorimaterials.com","johareez.com","kaunsa.com","kgnannexe.com","kidloo.com","koovs.com","kyazoonga.com","landmarkonthenet.com","lenskart.com","letbabyplay.com","limeroad.com","lootmore.com","maebag.com","magickart.in","mathrubhumi.com","matsyacrafts.com","mebaz.com","medplusbeauty.com","meherflorists.com","mirchimart.com","mirraw.com","mojocircles.com","momandmeshop.in","moserbaerhomevideo.com","mybabycart.com","myntra.com","neerus.com","nethaat.com","nextworld.in","nykaa.com","officeduniya.com","onlineprasad.com","oyegirl.com","ozel.co.in","partybounty.com","pearson.vrvbookshop.com","pepperfry.com","perfume2order.com","permingo.com","phoolwala.com","picsquare.com","planetdsg.com","planmy.travel","playgroundonline.com","plushplaza.com","prestigesmartkitchen.com","prestowonders.com","primeabgb.com","pringoo.com","pumashop.in","purehomedecor.com","purplle.com","rightflorist.in","sahibafabrics.com","sakhifashions.com","saptaswara.in","sareeworld.com","shop.sarijewels.com","shop.vipbags.com","shop4reebok.com","shopatdisney.in","shopatplaces.com","shopclues.com","shopimagine.in","shopnineteen.com","shoppersstop.com","shopping.indiatimes.com","siajewellery.com","smartoye.com","snapdeal.com","snapfish.in","snapgalaxy.com","snapittoday.com","socialheart.in","softtouchlenses.com","spring-blossoms.com","starcj.com","starcj.commallindex.htm","store.prathambooks.org","store.sahithyabharathi.com","strendy.com","studds.com","styletag.com","stylishyou.in","sunglassesindia.com","swamipc.in","tajonline.com","tantrauniverse.com","teamindiashirts.com","teesort.com","theelementsfactory.com","theitbazaar.com","theitdepot.com","theitwares.com","themobilestore.in","theperfumeshop.com","thestiffcollar.com","thevanca.com","thewatchshop.in","thinkessentials.com","tmhshop.com","topskin.co.in","toyworld.in","tradus.com","tshirts.in","ultraindia.com","upscportal.comstore","urbanladder.com","urbantouch.com","uread.com","utsavfashion.in","vakaro.com","vearings.com","villcart.com","violetbag.com","watchkart.com","webmallindia.com","williampenn.net","wowretails.com","www.cilory.com","yebhi.com","yellowfashion.in","yepme.com","yourdesignerwear.com","zansaar.com","zivame.com","zoffio.com","zoomin.com","zopnow.com","zovi.com"],
        // tags: ["aaa","ccc"],
        // tokenSeparators: [",", " "],
        // containerCssClass: "conclass",
        // dropdownCssClass: "dropclass",
        // formatResultCssClass: function(obj){
          // console.log(JSON.stringify(obj))
          // return "formaclass resuclass"
        // },
      });

      // function movieFormatResult(movie) {
      //   var markup = "<table class='movie-result'><tr>";
      //   if (movie.posters !== undefined && movie.posters.thumbnail !== undefined) {
      //       markup += "<td class='movie-image'><img src='" + movie.posters.thumbnail + "'/></td>";
      //   }
      //   markup += "<td class='movie-info'><div class='movie-title'>" + movie.title + "</div>";
      //   if (movie.critics_consensus !== undefined) {
      //       markup += "<div class='movie-synopsis'>" + movie.critics_consensus + "</div>";
      //   }
      //   else if (movie.synopsis !== undefined) {
      //       markup += "<div class='movie-synopsis'>" + movie.synopsis + "</div>";
      //   }
      //   markup += "</td></tr></table>"
      //   return markup;
      // }

      // function movieFormatSelection(movie) {
      //     return movie.title;
      // }

      // $("#vendor_box").select2({
      //       placeholder: "Search for a movie",
      //       // minimumInputLength: 3,
      //       ajax: {
      //           url: "http://api.rottentomatoes.com/api/public/v1.0/movies.json",
      //           dataType: 'jsonp',
      //           quietMillis: 100,
      //           data: function (term, page) { // page is the one-based page number tracked by Select2
      //               return {
      //                   q: term, //search term
      //                   page_limit: 10, // page size
      //                   page: page, // page number
      //                   apikey: "ju6z9mjyajq2djue3gbvv26t" // please do not use so this example keeps working
      //               };
      //           },
      //           results: function (data, page) {
      //               var more = (page * 10) < data.total; // whether or not there are more results available
 
      //               // notice we return the value of more so Select2 knows if more results can be loaded
      //               return {results: data.movies, more: more};
      //           }
      //       },
      //       // formatResult: movieFormatResult, // omitted for brevity, see the source of this page
      //       // formatSelection: movieFormatSelection, // omitted for brevity, see the source of this page
      //       // dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
      //   });

      $("#vendor_box").on("change", function(e) {
        
        // e.val = ''
        // e.val('')
        // console.log(e.added.text);
        
        // $(this).select2("val", '');

        if (e.added)
          $(this).select2("data", [{id: e.added.text, text: e.added.text}]);
        
        // $(this).select2({
        //   tags: [e.added.text]
        // });

        // $(this).select2("val", "e.added.text");

        // $(this).val("qaw")
        // $(this).val('')
        // $(e).val(e.added['text'])

        // console.log(JSON.stringify({
        //   val:e.val, 
        //   added:e.added, 
        //   removed:e.removed
        // }));

      });

      $("#psc_box").select2({
        tags:["3d glasses","accessories","adaptors and cables","adsl microfilters","adventure equipments","aerials","air conditioning units","air purifiers","amplifiers","analogue cameras","answering machines","art","arts","audio accessories","baby bottles and feeding equipment","baby care","baby monitors","baby product and kids","baby products","baby walkers","back packs","bags","barcode scanners","bathroom fittings","batteries","battery chargers","bbq accessories","bbqs","bean bags","beauty","bed linen","bedding","bharatnatayam related products","bicycles","bike accesories","binoculars","bins","blinds","blu ray players","board games and puzzles","books","branded","bread makers","breathalysers","broadband adapters","buggies","cable tidies","cables","cables and accessories","cakes","cakes and flowers","camcorder accessories","camcorders","camera and accessories","camera and camcorder batteries","camera cases","camera docks","camera films","cameras","camping and travel","car accesories","car accessories","car care","car seats","car stereos","car vision","card readers","cassette players","cctv","cd and dvd storage","cd changers","cd players","cd roms","cd rs","cd rws","cds","children books","childrens bicycles","choclates","chocolate fountains","christmas","classification","cleaners","cleaning accessories","clocks","cloth driers","clothes airers","clothing and apparels","coffee machines","computer cases","computer components","computer desks","computer headsets","computer mice","computer peripherals","computer towers","computers and peripherals","confectionery","contact grills","cooker hood","cookers","cookware","cool t-shirts","corsets","cosmetics","cots","cotton fabric","courier bags","cpus","crafts","cricket t-shirts","custom accessories","custom merchandise","cycling accessories","dab receivers","data storage","dating","deals","deep fat fryers","dehumidifiers","designer clothes","desktop computers","dictaphones","digital camera accessories","digital cameras","digital photo frames","digital tv recorders","dishwasher","dongles","driving accessories","dvd accessories","dvd drives","dvd players","dvd rams","dvd recorders","dvd rewriter drives","dvd rs","dvd rws","dvds hd dvds and blu ray discs","e book reader and e reader","electric blankets","electric can openers","electric heating","electric knives","electric toothbrushes","electronics","ereader accessories","ethernet adapters","exercise equipment","external flash units","external hard drives","eyewear and lenses","fan merchandise","fans","fashion","fashion accessories","fashion and jewellery","fashion and lifestyle","fax machines","financial products","fingerprint readers","fitness equipment","fm transmitters","food and beverages","food and groceries","food processors","frames and lens","freezers","fridge freezers","fridges","gadget accessories","gadgets","games","games and consoles","games console accessories","games consoles","gaming/multimedia cd/dvd","garden equipment","garden furniture","garden ornaments","general","general (daily deals)","gift vouchers","gifts","gifts and accessories","gifts and flowers","glasses","gps navigation","graphics cards","groceries/vegetables and fruits","grocery","gunglasses","hair clippers","hair dryers","hair stylers","hand blenders","handicrafts and artwork","hard drives","hdmi leads","headphones and earphones","headsets","health","health and personal care","hi fis","high chairs","hob","home and kitchenware","home appliances","home cinema systems","home décor","home furnishings","home miscellaneous","home security products","hookah and innsence","hospitality and tourism","hot tubs","household storage","household varities","ice cream makers","ink cartridges","innerwear and lingerie","ipad docks","ipod accessories","ipod docks and mp3 speakers","iron accessories","ironing boards","islamic wear","jewelery","jewellery","jewellery and accessories","joysticks","juicers","kettles","keyboards","kids toys","kitchen accessories","kitchen appliances","kitchen sinks","kitchen taps","kitchen utensils","kitchenware","labellers","labels","ladders","landline phones","laptop accessories","laptop bags","laptop skins","laptops","leather accesories","leather accessories","leather products","lens cases","lens hoods","lenses","lightbulbs","lighting","lingerie","lingerie and innerwear","luggage","main focus","malayalam books and movies","matrimony","mds","media centres","medical devices and equipments","memory cards","mens innerware","mens innerwear","microphones","microscope","microwave","mini fridge and drinks cooler","mini ovens","minidisc players","mobile","mobile accessories","mobile phone accessories","mobile phones","mobile phones and tabs","mobiles","mobiles and accessories","mobiles and electronics","modems","monitor arms","monitors","montessori items","mops","motherboards","motherhood","motorcycle travel gear","movies","movies and music","mp3 accessories","mp3/mp4 player","multi disc drives","musical instrument accessories","musical instruments","musical intruments","network cameras","network cards","network storage","network switches","ngo handicrafts","niche","novelty fashion and accessories","novelty gadgets","office furniture","office supplies","one stop shop","online education","online grocery","organic food","oven","paddling pools","party supplies","pda accessories","pdas","pens","perfume","perfumes","personal care","personal stereos","pets","photo albums","photo frames","photo paper","photo print","photography","photography accessories","photography filters","photos and custom accessories","pool tables","portable dvd players","portable tvs","posters","power supplies","power tools","prams","print solutions","printer accessories","printer docks","printer paper","printers","projection accessories","projector lamps","projectors","radiators","radios","receivers","refurbished products","remote controls","routers","safes","sandwich toasters","sarees","sarees and salwar","saris","sat nav accessories","sat navs","scales","scanners","scart lead","school and education","school stationary","scientific calculators","scooters","servers","set top boxes","sewing machines","shaving trimming epilation","sheds","shoes","shoes and accessories","shredders","sim card","skateboards","sleeping bags","slide viewers","slow cooker","smoke machines","software","sound cards","speakers","sports and health equipment","sports and outdoors","sports equipment","sports merchandise","sports nutrition","stationery","steam cleaners","steam cookers","steam iron","store merchandise","streaming movies","studio kits","studio reflectors","t-shirts","tablet pc accessories","tablet pcs","tapes","taxi service","telecom plans","telescopes","television cards","temple offerings","tents","ticket booking","toasters","toiletries","toner","tools","torches","toys","trampolines","travel and ticket booking","travel books","trekking and adventure equipment","tripods","trouser presses","tumble dryers","turntables and mixing decks","tv","tv stands and wall mounts","usb hub","usb leads","usb memory storage","vacuum cleaner accessories","vacuum cleaners","video editing cards","video games","video recorders","video tapes","voip devices","walkie talkies","warranty and services","washer dryers","washing machines","watches","watches children","watches men","watches women","waterfilters","webcams","wedding","wireless cards","wireless media streamers","wireless tv links"],
        // tokenSeparators: [",", " "]
      });

      // $("#e1").select2({
      //   query: function(query){
      //     var data = {results: []}
      //     query.callback();
      //   }
      // });

      // $('.editable').hallo({
      //   plugins: {
      //     'halloformat': {},
      //     'halloheadings': {},
      //     'hallolists': {},
      //     'halloreundo': {},
      //     'halloindicator': {},
      //     'hallojustify': {},
      //     'hallolink': {},
      //   },
      //   toolbar: 'halloToolbarFixed'
      // });
      
      $('.dropdown-toggle').dropdown();

      $("#psc_box").focus();
      // $('#vendor_box li.selec2-search-choice').css('background', '#f4f4f4');
    }
  });

  return userHomeView;
});
