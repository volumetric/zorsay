define(['Backbone', 'bootstrap', 'summernote', 'select2', 'bootstrap_slider', 'comment-box', 'views/zs_notify_view'], function(B, b, s, s2, bs, cb, zsNotifyView) {
  console.log("inside zsAddShopexModalView")
  var zsAddShopexModalView = Backbone.View.extend({
    el: 'body',

    events: {
    },

    initialize: function() {
      console.log("zsAddShopexModalView initialized with add shopex modal");
      zsNotifyView = new zsNotifyView();

      $.fn.modal.Constructor.prototype.enforceFocus = function() {};

      $('.slider').slider({
        min: 0,
        max: 5,
        step: 1,
        tooltip: 'hide',
        // formater: function(e) {
        //   return e+".0";
        // }
      }).on('slide', function(e){
        // console.log("e.value:", e.value);
        element = $(e.target).closest(".panel-body");
        slider_val = e.value > 0 ? e.value+".0" : "N/A";
        element.find("h1").html(slider_val);
        element.find("h1").attr("value", e.value);
      });



    function procatFormatResult(procat) {
        var markup = "<table class='procat-result'><tr>";
        if (procat.image !== undefined && procat.image.thumbnail !== undefined) {
            markup += "<td class='procat-image'><img src='" + procat.image.thumbnail + "'/></td>";
        }
        markup += "<td class='procat-info'><div class='procat-name'>" + procat.name + "</div>";
        if (procat.critics_consensus !== undefined) {
            markup += "<div class='procat-synopsis'>" + procat.critics_consensus + "</div>";
        }
        else if (procat._id !== undefined) {
            markup += "<div class='procat-synopsis'>" + procat._id + "</div>";
        }
        markup += "</td></tr></table>"
        return markup;
    }

    function procatFormatSelection(procat) {
        return procat.name;
    }

    var month_data=[
    {id:1,tag:'Jan'},
    {id:2,tag:'Feb'},
    {id:3,tag:'Mar'},
    {id:4,tag:'Apr'},
    {id:5,tag:'May'},
    {id:6,tag:'June'},
    {id:7,tag:'July'},
    {id:8,tag:'Aug'},
    {id:9,tag:'Sep'},
    {id:10,tag:'Oct'},
    {id:11,tag:'Nov'},
    {id:12,tag:'Dec'},
    ];

    var year_data=[
    {id:2014,tag:2014},
    {id:2013,tag:2013},
    {id:2012,tag:2012},
    {id:2011,tag:2011},
    {id:2010,tag:2010},
    {id:2009,tag:2009},
    {id:2008,tag:2008},
    {id:2007,tag:2007},
    {id:2006,tag:2006},
    {id:2005,tag:2005},
    {id:2004,tag:2004},
    {id:2003,tag:2003},
    {id:2002,tag:2002},
    {id:2001,tag:2001},
    {id:2000,tag:2000},
    {id:1999,tag:1999},
    ];

    function format(item) { return item.tag; };
 
    $("#month_box").select2({
        data:{ results: month_data, text: 'tag' },
        formatSelection: format,
        formatResult: format,
    });

    $("#year_box").select2({
        data:{ results: year_data, text: 'tag' },
        formatSelection: format,
        formatResult: format,
    });

    $(".add-more.add-more-prod-link").on("click", function(e) {
      pli = $("#prod-link-input").clone().val("");
      $(".prod-link").append(pli);
      return false;
    });


    $(".counted1").charCounter(320,{container: "#counter1"});
    $(".counted2").charCounter(320,{container: "#counter2"});
    $(".counted3").charCounter(320,{container: "#counter3"});
    $(".counted4").charCounter(320,{container: "#counter4"});
    $(".counted5").charCounter(320,{container: "#counter5"});
    $(".counted6").charCounter(320,{container: "#counter6"});
    // $(".counted7").charCounter(320,{container: "#counter7"});


    function submitShopexData(shopex_data) {
      zsNotifyView.nv_show(1);
      // console.log("in submitShopexData with shopex_data:", shopex_data);
      console.log(shopex_data);
      console.log("sending shopex_data");
      $.ajax({
        type: 'POST',
        url: '/shopping-experience/',
        data: shopex_data,
        success: function(data, status, jqxhr) {
          // console.log("new shopex added successfully");
          // console.log(data);
          // console.log("----------------------");
          // console.log(data._id);
          window.location.pathname = data.permalink ? data.permalink : '/shopping-experience/'+data._id;
        },
        error: function(jqxhr, status) {
          // console.log("ERROR Adding Shopex:", status);
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      })
    }

    function retrieveShopexData(step) {
      shopex_data = {};
      // shopex_data.anonymous = $("#anon").val();

      seller_id_arr = [];
      pro_cat_id_arr = [];
      ser_cat_id_arr = [];

      var ps = $("#psc_box").select2("data");
      psarr = [];
      for (var i = 0; i < ps.length; ++i){
        psarr.push(ps[i]._id);
        if (ps[i].node_type == "_pro_cat" && pro_cat_id_arr.indexOf(ps[i]._id) == -1){
          pro_cat_id_arr.push(ps[i]._id);
        }
        if (ps[i].node_type == "_ser_cat" && ser_cat_id_arr.indexOf(ps[i]._id) == -1){
          ser_cat_id_arr.push(ps[i]._id);
        }
      }
      
      var s = $("#vendor_box").select2("data");
      sarr = [];
      for (var i = 0; i < s.length; ++i){
        sarr.push(s[i]._id);
        seller_id_arr.push(s[i]._id);
      }

      if (step == 1) {
        if (psarr.length < 1){
          zsNotifyView.nv_show(1, '<div class="zs-danger zs_notify_html_message">Enter atleast one <b>Product Category</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
          return false; 
        }

        if (sarr.length < 1){
          zsNotifyView.nv_show(1, '<div class="zs-danger zs_notify_html_message">Enter the <b>Seller</b> name<a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
          return false; 
        }
      }


      // #TODO#DONE change pscategory to pro_cat_id
      // #TODO#DONE change vendor to seller_id

      // shopex_data.pro_cat_id = JSON.stringify(psarr);
      // shopex_data.seller_id = JSON.stringify(sarr[0]);

      shopex_data.pro_cat_id = JSON.stringify(pro_cat_id_arr);
      shopex_data.ser_cat_id = JSON.stringify(ser_cat_id_arr);
      shopex_data.seller_id = JSON.stringify(seller_id_arr[0]);
      
      shopex_data.month = $("#month_box").val();
      shopex_data.year = $("#year_box").val();

      var prods = $(".prod-link-input-class");
      prodarr = [];
      for (var i = 0; i < prods.length; ++i){
        var link = $(prods[i]).val();
        if (link)
         prodarr.push(link);
      }
      shopex_data.prod_links = JSON.stringify(prodarr);

      shopex_data.areacode = $("#areacode").val();

      // #TODO#DONE change review_text to content_text
      shopex_data.content_text = $("#add_shopex_modal_content_text_editable").code();

      // shopex_data.otd_rating = $("#otd_rating").attr("value");
      shopex_data.pad_rating = $("#pad_rating").attr("value");
      shopex_data.pri_rating = $("#pri_rating").attr("value");
      shopex_data.pro_rating = $("#pro_rating").attr("value");
      shopex_data.eos_rating = $("#eos_rating").attr("value");
      shopex_data.csu_rating = $("#csu_rating").attr("value");
      shopex_data.rrp_rating = $("#rrp_rating").attr("value");
      // shopex_data.csu_rating = $("#csu_rating").text();

      if (step == 2) {
        if ((shopex_data.eos_rating == 0) || (shopex_data.pro_rating == 0) || (shopex_data.pri_rating == 0) || (shopex_data.csu_rating == 0) || (shopex_data.pad_rating == 0)) {
          zsNotifyView.nv_show(1, '<div class="zs-danger zs_notify_html_message"> <b>Ratings</b> are required, <b>Comments</b> are optional<a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
          return false;
        }
      }

      
      // shopex_data.otd_comment = $("#otd_comment").val();
      shopex_data.pad_comment = $("#pad_comment").val();
      shopex_data.pri_comment = $("#pri_comment").val();
      shopex_data.pro_comment = $("#pro_comment").val();
      shopex_data.eos_comment = $("#eos_comment").val();
      shopex_data.csu_comment = $("#csu_comment").val();
      shopex_data.rrp_comment = $("#rrp_comment").val();
      var soms = 12;

      return shopex_data;
    }

    // Array to store the tabs 
    // var tab_pane_arr = [
    // "dummy", 
    // ".tab-pane.add-shopex-modal.step1", 
    // ".tab-pane.add-shopex-modal.step2", 
    // // ".tab-pane.step3.add-shopex-modal"
    // ];

    var curr_tab_pane = 1;

    function updateTabPaneInfo() {
      $(".step-head").removeClass("active");
      $(".tab-pane.add-shopex-modal").removeClass("active");

      $(".step-head.step"+curr_tab_pane).addClass("active");
      $(".tab-pane.add-shopex-modal.step"+curr_tab_pane).addClass("active");
      
      pb_val = (curr_tab_pane * 50.00) + "%";
      $("#add-shopex-steps-pb").css("width", pb_val);

      if (curr_tab_pane == 1){
        $(".nextBtn.add-shopex").removeClass("hidden");
        $(".prevBtn.add-shopex").addClass("hidden");
        $(".submitBtn.add-shopex").addClass("hidden");
      } else {
        $(".nextBtn.add-shopex").addClass("hidden");
        $(".prevBtn.add-shopex").removeClass("hidden");
        $(".submitBtn.add-shopex").removeClass("hidden");
      }
    }

    $(".nextBtn.add-shopex").on("click", function(){
      // console.log("nextBtn Clicked");
      // $(tab_pane_arr[curr_tab_pane]).removeClass("active");
      
      var shopexObj = retrieveShopexData(curr_tab_pane);
      if (shopexObj){
        curr_tab_pane += 1;
        updateTabPaneInfo();
      }

      return false;
    });

    $(".prevBtn.add-shopex").on("click", function(){
      // console.log("prevBtn Clicked");
      // $(tab_pane_arr[curr_tab_pane]).removeClass("active");
      curr_tab_pane -= 1;
      updateTabPaneInfo();

      return false;
    });

    $(".submitBtn.add-shopex").on("click", function(){
      // console.log("submitBtn Clicked");
      var shopexObj = retrieveShopexData(curr_tab_pane);
      
      if (shopexObj){
        submitShopexData(shopexObj);
      }

      return false;
    });

    // $("#add_shopex_step_1").click(function(){
    //   // $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    //   curr_tab_pane = 1;
    //   updateTabPaneInfo(); 
    //   return false;
    // });

    // $("#add_shopex_step_2").click(function(){
    //   // $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    //   curr_tab_pane = 2;
    //   updateTabPaneInfo(); 
    //   return false;
    // });

    // $("#add_shopex_step_3").click(function(){
    //   $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    //   curr_tab_pane = 3;
    //   updateTabPaneInfo(); 
    //   return false;
    // });


    // $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    // fix modal force focus
     $.fn.modal.Constructor.prototype.enforceFocus = function () {
        var that = this;
        $(document).on('focusin.modal', function (e) {
           if ($(e.target).hasClass('select2-input')) {
              return true;
           }

           if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
              that.$element.focus();
           }
        });
     };

    // $("#psc_box").on("change", function(e) {
    //   if ($(this).select2("data").length >= 3){

    //     var three_tags = $(this).select2("data").slice(0, 3);
    //     $(this).select2("data", three_tags);
    //   }
    // });

    $("#psc_box").select2({
        // placeholder: "Online store name (e.g: amazon.in, flipkart.com)",
        // tokenSeparators: [",", " "],
        maximumSelectionSize: 3,
        minimumInputLength: 1,
        multiple: true,
        // closeOnSelect: false,
        id: function(data){return {id: data._id};},
        ajax: {
            url: "/tags",
            // http://127.0.0.1:8080/tags?callback=jQuery19103411654969677329_1395660172209&page_limit=10&page=1&type=seller&q=mob
            dataType: 'jsonp',
            quietMillis: 100,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                // if (res_selected){
                //   page = 1;
                //   res_selected = false;
                // }
                // console.log("page:", page);
                return {
                    q: term, //search term
                    page_limit: 10, // page size
                    page: page, // page number
                    // type: "product_cat",
                    type: "category",
                    // apikey: "ju6z9mjyajq2djue3gbvv26t" // please do not use so this example keeps working
                };
            },
            results: function (data, page) {
                var more = (page * 10) < data.total; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return {results: data.results, more: more};
            }
        },
        formatResult: procatFormatResult, // omitted for brevity, see the source of this page
        formatSelection: procatFormatSelection, // omitted for brevity, see the source of this page
        dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
    });


    // $("#vendor_box").on("change", function(e) {
    //   if (e.added)
    //     $(this).select2("data", [e.added]);
    // });

    $("#vendor_box").select2({
        // placeholder: "Online store name (e.g: amazon.in, flipkart.com)",
        // tokenSeparators: [",", " "],
        maximumSelectionSize: 1,
        minimumInputLength: 1,
        multiple: true,
        id: function(data){return {id: data._id};},
        ajax: {
            url: "/tags",
            // http://127.0.0.1:8080/tags?callback=jQuery19103411654969677329_1395660172209&page_limit=10&page=1&type=seller&q=mob
            dataType: 'jsonp',
            quietMillis: 100,
            data: function (term, page) { // page is the one-based page number tracked by Select2
                return {
                    q: term, //search term
                    page_limit: 10, // page size
                    page: page, // page number
                    type: "seller",
                    // apikey: "ju6z9mjyajq2djue3gbvv26t" // please do not use so this example keeps working
                };
            },
            results: function (data, page) {
                var more = (page * 10) < data.total; // whether or not there are more results available

                // notice we return the value of more so Select2 knows if more results can be loaded
                return {results: data.results, more: more};
            }
        },
        formatResult: procatFormatResult, // omitted for brevity, see the source of this page
        formatSelection: procatFormatSelection, // omitted for brevity, see the source of this page
        dropdownCssClass: "bigdrop" // apply css that makes the dropdown taller
    });

    var sw = this.$("#add_shopex_modal_content_text_editable");
    // console.log(sw.length)
    if (sw.length) {
      sw.summernote({
      // this.$(".summernote").summernote({
        height: 180,
        focus: true,
        toolbar: [
          ['style', ['style']], // no style button
          ['style', ['bold', 'italic', 'underline']],
          // ['fontsize', ['fontsize']],
          // ['color', ['color']],
          ['para', ['ul', 'ol']],
          // ['height', ['height']],
          ['insert', ['picture', 'video', 'link']], // no insert buttons
          // ['table', ['table']], // no table button
          // ['help', ['help']] //no help button
        ],
      });
    }

    },

    render: function() {
      console.log("in zsAddShopexModalView render function");
      return this;
    }

  });

  return zsAddShopexModalView;
});