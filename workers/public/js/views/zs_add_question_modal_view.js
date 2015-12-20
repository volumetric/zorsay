define(['Backbone', 'bootstrap', 'summernote', 'select2', 'views/zs_notify_view'], function(B, b, s, s2, zsNotifyView) {
  console.log("inside zsAddQuestionModalView")
  var zsAddQuestionModalView = Backbone.View.extend({
    el: 'body',

    events: {
    },

    initialize: function() {
      // $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    console.log("zsAddQuestionModalView initialized");
    zsNotifyView = new zsNotifyView();


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

    $(".ques-add-more-prod-link").on("click", function(e) {
      pli = $("#ques-prod-link-input").clone();
      $(".ques-prod-link").append(pli);
      return false;
    });

    function submitQuestionData(question_data) {
      zsNotifyView.nv_show(1);
      // console.log("in submitQuestionData with question_data:", question_data);
      console.log(question_data);
      console.log("sending question_data");
      $.ajax({
        type: 'POST',
        url: '/question/',
        data: question_data,
        success: function(data, status, jqxhr) {
          // console.log("new question added successfully");
          // console.log(data);
          // console.log("----------------------");
          // console.log(data._id);
          // window.location.pathname = '/question/'+data._id+'/q';
          window.location.pathname = data.permalink ? data.permalink : '/question/'+data._id+'/'+data.content_title;
        },
        error: function(jqxhr, status) {
          // console.log(jqxhr.responseText);
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      })
    }

    function retrieveQuestionData() {
      question_data = {};

      var question_title = $("#content_title").val();
      if (!question_title) {
        zsNotifyView.nv_show(1, '<div class="zs-danger zs_notify_html_message">Question <b>Title</b> cannot be Empty. Describe your question below that, for better chance of an answer.<a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
        return false; 
      }

      // var t = $("#tag_box").select2("data");
      var t = $("#category_box").select2("data").concat($("#seller_box").select2("data"));

      console.log(t);

      if (t.length < 1){
        zsNotifyView.nv_show(1, '<div class="zs-danger zs_notify_html_message">Enter atleast one <b>Product Category</b> or <b>Seller</b> as a Tag<a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
        return false; 
      }
      
      // tagarr = [];
      seller_id_arr = [];
      pro_cat_id_arr = [];
      ser_cat_id_arr = [];
      // pro_id_arr = [];
      // ser_id_arr = [];

      for (var i = 0; i < t.length; ++i){
        if (t[i].node_type == "_seller" && seller_id_arr.indexOf(t[i]._id) == -1){
          seller_id_arr.push(t[i]._id);
        }
        if (t[i].node_type == "_pro_cat" && pro_cat_id_arr.indexOf(t[i]._id) == -1){
          pro_cat_id_arr.push(t[i]._id);
        }
        if (t[i].node_type == "_ser_cat" && ser_cat_id_arr.indexOf(t[i]._id) == -1){
          ser_cat_id_arr.push(t[i]._id);
        }
        // if (t[i].node_type == "_pro")
        //   pro_id_arr.push(t[i]._id);
        // if (t[i].node_type == "_ser")
        //   ser_id_arr.push(t[i]._id);
      }

      question_data.seller_id = JSON.stringify(seller_id_arr);
      question_data.pro_cat_id = JSON.stringify(pro_cat_id_arr);
      question_data.ser_cat_id = JSON.stringify(ser_cat_id_arr);
      // question_data.pro_id = JSON.stringify(pro_id_arr);
      // question_data.ser_id = JSON.stringify(ser_id_arr);
      

      question_data.content_title = question_title;

      var prods = $(".ques-prod-link-input-class");
      prodarr = [];
      for (var i = 0; i < prods.length; ++i){
        var link = $(prods[i]).val();
        if (link)
         prodarr.push(link);
      }
      question_data.prod_links = JSON.stringify(prodarr);

      question_data.content_text = $("#add_question_modal_content_text_editable").code();

      // $("#add_question_modal_content_text_editable").destroy();
      // question_data.content_text = $("#add_question_modal_content_text_editable").html();
      
      // $("#add_question_modal_content_text_editable").summernote({
      //   height: 180,
      //   focus: true,
      //   toolbar: [
      //     ['style', ['style']],
      //     ['style', ['bold', 'italic', 'underline']],
      //     ['insert', ['picture', 'video', 'link']],
      //   ],
      // });

      // console.log(question_data);
      return question_data;
    }

    // // Array to store the tabs 
    // var tab_pane_arr = [
    // "dummy", 
    // ".tab-pane.step1", 
    // ".tab-pane.step2", 
    // // ".tab-pane.step3"
    // ];

    // var curr_tab_pane = 1;

    // function updateTabPaneInfo() {
    //   $(tab_pane_arr[curr_tab_pane]).addClass("active");
      
    //   pb_val = (curr_tab_pane * 50.00) + "%";
    //   $("#add-question-steps-pb").css("width", pb_val);

    //   if (curr_tab_pane == 1){
    //     $(".nextBtn").removeClass("hidden");
    //     $(".prevBtn").addClass("hidden");
    //     $(".submitBtn").addClass("hidden");
    //   // } else if (curr_tab_pane == 2) {
    //   //   $(".nextBtn").removeClass("hidden");
    //   //   $(".prevBtn").removeClass("hidden");
    //   //   $(".submitBtn").addClass("hidden");
    //   } else {
    //     $(".nextBtn").addClass("hidden");
    //     $(".prevBtn").removeClass("hidden");
    //     $(".submitBtn").removeClass("hidden");
    //   }
    // }

    // $(".nextBtn").on("click", function(){
    //   console.log("nextBtn Clicked");
    //   $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    //   curr_tab_pane += 1;
    //   console.log("current tab pane", curr_tab_pane);
      
    //   updateTabPaneInfo();
    //   // retrieveQuestionData();

    //   return false;
    // });

    // $(".prevBtn").on("click", function(){
    //   console.log("prevBtn Clicked");
    //   $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    //   curr_tab_pane -= 1;
    //   console.log("current tab pane", curr_tab_pane);
      
    //   updateTabPaneInfo();
    //   // retrieveQuestionData();

    //   return false;
    // });

    $(".askQuestionBtn").on("click", function(){
      // console.log("askQuestionBtn Clicked");

      var questionObj = retrieveQuestionData();

      if (questionObj) {
        submitQuestionData(questionObj);  
      } else {
        // #TODO show this message on the screen
        console.log("Question title cannot be empty")
      }
      
      return false;
    });

    // $("#add_question_step_1").click(function(){
    //   $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    //   curr_tab_pane = 1;
    //   updateTabPaneInfo(); 
    //   return false;
    // });
    // $("#add_question_step_2").click(function(){
    //   $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    //   curr_tab_pane = 2;
    //   updateTabPaneInfo(); 
    //   return false;
    // });
    // // $("#add_question_step_3").click(function(){
    // //   $(tab_pane_arr[curr_tab_pane]).removeClass("active");
    // //   curr_tab_pane = 3;
    // //   updateTabPaneInfo(); 
    // //   return false;
    // // });


    // $.fn.modal.Constructor.prototype.enforceFocus = function() {};
    // fix modal force focus
     // $.fn.modal.Constructor.prototype.enforceFocus = function () {
     //    var that = this;
     //    $(document).on('focusin.modal', function (e) {
     //       if ($(e.target).hasClass('select2-input')) {
     //          return true;
     //       }

     //       if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
     //          that.$element.focus();
     //       }
     //    });
     // };


    // var res_selected = false;
    // $("#psc_box").on("change", function(e) {
    //   res_selected = true;
    //   console.log("psc_box changed", res_selected);
    // });

    function associateTagSearchService(id_str, search_type_name, placeholder) {
      $("#"+id_str).select2({
          placeholder: placeholder,
          minimumSelectionSize: 1,
          maximumSelectionSize: 5,
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
                      type: search_type_name,
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
    }

    // associateTagSearchService("tag_box", "all");
    associateTagSearchService("category_box", "category", "Add categories for your question");
    associateTagSearchService("seller_box", "seller", "Add Sellers for your question");

    var sq = this.$("#add_question_modal_content_text_editable")
    // console.log(sq.length)
    if (sq.length) {
      sq.summernote({
      // this.$(".summernote").summernote({
        height: 180,
        focus: true,
        // placeholder: "sssssssss",
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
      console.log("in zsAddQuestionModalView render function");
      return this;
    }

  });

  return zsAddQuestionModalView;
});