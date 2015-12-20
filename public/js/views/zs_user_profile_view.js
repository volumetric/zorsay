define(['Backbone', 'bootstrap', 'summernote', 's3upload', 'views/zs_notify_view'], function(B, b, s, s3, zsNotifyView) {
  console.log("inside zs_user_profile_view")
  var zsUserProfileView = Backbone.View.extend({
    el: 'body',
    fde: null,

    events: {
      "click .usrinfo-sidebar .list-group-item": "usrinfo_clicked",
      
      "click .verify_email": "zs_verify_email_post",

      "click .user_profile_update_btn": "update_user_info",
      "click .change_password_submit_btn": "submit_change_password",
      "click .show_passwords": "zs_show_passwords",

      "click #user_profile_img_submit": "zs_submit_image",
      "click #user_profile_img_cancel": "zs_revert_image",
      "click #user_profile_img_edit_link": "zs_trigger_file_browser",

      // "change #user_profile_img_edit": "s3_upload",
      "change #user_profile_img_edit": "resize_image",
    },

    initialize: function(args) {
      console.log("zs user profile view initialized");
      zsNotifyView = new zsNotifyView();

      // $('#user_profile_img_edit').on("change", this.resize_image);
      // $('#user_profile_img_edit').on("change", this.s3_upload);

      // this.post_pub_id = args.post_pub_id;
      // $("#user_profile_edit").on("click", function(){
      //   console.log("user_profile_edit clicked");
          
      //   // $("#userProfileEditModal").modal({ backdrop: true});
      //   $("#userProfileEditModal").modal('show');
      // });
    },

    zs_verify_email_post: function() {
      console.log("inside zs_verify_email_post");
      zsNotifyView.nv_show(1);

      $.ajax({
        type: 'POST',
        url: '/verifyemail',
        success: function(data, status, jqxhr) {
          // zsNotifyView.nv_hide(1);
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
        },
        error: function(jqxhr, status) {
          // console.log(status);
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      })
      return false;
    },

    clear_form: function() {
      $(".fullname").val("");
      // $(".first_name").val("");
      // $(".last_name").val("");
      $(".short_bio").val("");
      $(".aboutme").val("");
      $(".areacode").val("");
      $(".age").val("");
      $(".gender").val("");
      
      $(".img_icon_url").val("");
      $(".profile_image_url").val("");
      $(".cover_image_url").val("");
      
      $(".verify_password").val("");
    },

    dataURItoBlob: function(dataURI) {
      // convert base64 to raw binary data held in a string
      // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
      var byteString = atob(dataURI.split(',')[1]);

      // separate out the mime component
      var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

      // write the bytes of the string to an ArrayBuffer
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
      }

      try {
        return new Blob([ab], {type: mimeString});
      } catch(e) {
        var BlobBuilder = window.WebKitBlobBuilder || window.MozBlobBuilder;
        // write the ArrayBuffer to a blob, and you're done
        var bb = new BlobBuilder();
        bb.append(ab);
        return bb.getBlob(mimeString);  
      }
      
    },

    do_image_stuff: function(file, MAX_WIDTH_ARG) {
      // console.log("==> do_image_stuff with MAX_WIDTH:", MAX_WIDTH_ARG);

      var img_local_src = window.URL.createObjectURL(file);
      // console.log("img_local_src", img_local_src);

      // var jqimg = $("#user_profile_img_preview");
      // jqimg.attr("src", img_local_src);

      var aimg = document.createElement("img");
      aimg.src = img_local_src;

      img = aimg;

      // //sleep for image to properly load
      // var start = Date.now();
      // while((Date.now() - start) < 3000){
      //   // Do nothing
      // }
      var this_view = this;

      setTimeout(function(){

        var canvas = $("<canvas>")[0];

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        // #TODO smooth the image after resize
        // var MAX_WIDTH = 50;
        // var MAX_HEIGHT = 50;
        var width = img.width;
        var height = img.height;

        if (!MAX_WIDTH_ARG){
          MAX_WIDTH_ARG = img.width/2;
        }
        var MAX_WIDTH = MAX_WIDTH_ARG <= 50 ? 50 : MAX_WIDTH_ARG;
         
        height *= MAX_WIDTH / width;
        width = MAX_WIDTH; 
        
        canvas.width = width;
        canvas.height = height;
        var ctx = canvas.getContext("2d");
        // ctx.webkitImageSmoothingEnabled = true;
        ctx.imageSmoothingEnabled = true;
        // ctx.mozImageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, width, height);


        // var imgData = ctx.createImageData(width, height);
        // var data = imgData.data;
        // var pixels = ctx.getImageData(0, 0, width, height);
        // for (var i = 0, ii = pixels.data.length; i < ii; i += 4) {
        //     var r = pixels.data[i + 0];
        //     var g = pixels.data[i + 1];
        //     var b = pixels.data[i + 2];
        //     data[i + 0] = (r * .393) + (g *.769) + (b * .189);
        //     data[i + 1] = (r * .349) + (g *.686) + (b * .168)
        //     data[i + 2] = (r * .272) + (g *.534) + (b * .131)
        //     data[i + 3] = 255;
        // }
        // ctx.putImageData(imgData, 0, 0);

        // setTimeout(function(){
        //   var dataurl = canvas.toDataURL(file.type);
        //   console.log(dataurl);
        // }, 2000)

        var dataurl = canvas.toDataURL(file.type);
        // console.log("dataurl", dataurl);

        blob = this_view.dataURItoBlob(dataurl)
        blob.name = file.name;

        // console.log("blob", blob);
        // console.log("blobUrl", window.URL.createObjectURL(blob));

        if (MAX_WIDTH > 50){
          this_view.do_image_stuff(blob, MAX_WIDTH/2);
        } else {
          // var jqimg = $("#user_profile_img_preview");
          // jqimg.attr("src", window.URL.createObjectURL(blob));

          file_dom_element = {}
          file_dom_element.files = [blob];

          this_view.fde = file_dom_element;
          this_view.s3_upload("icon");
        }
      }, 1000)
    },

    // https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
    resize_image: function(e) {
      console.log("--> inside resize_image");
      zsNotifyView.nv_show(1);

      // console.log(e.target);
      // console.log(e.target.files[0]);

      // var file = e.target.files[0];
      var file = $("#user_profile_img_edit")[0].files[0]

      var img_local_src = window.URL.createObjectURL(file);
      // console.log("img_local_src", img_local_src);

      // show the image right away
      var jqimg = $("#user_profile_img_preview");
      jqimg.attr("src", img_local_src);

      // upload the original image here
      this.s3_upload();

      if (!file.type.match(/image.*/)) {
        // this file is not an image.
        zsNotifyView.nv_show(1, '<div class="btn-danger zs_notify_html_message"><b>This file is not an image.</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
        return;
      } else {

        this.do_image_stuff(file);
        // this_view = this;
        // setTimeout(this.do_image_stuff(file), 1000)

        // zsNotifyView.nv_hide(1);    
      }
    },

    s3_upload: function(type){
      console.log("--> inside s3_upload function");
      zsNotifyView.nv_show(1);

      this_view = this;
      // console.log(this_view.fde);
      var s3upload = new S3Upload({
          file_dom_selector: '#user_profile_img_edit',
          file_dom_element: this_view.fde,
          // #TODO put user id as user_1 here, for specific url generation 
          file_opts: '{"id":"Account_0", "type": "'+type+'"}',
          s3_sign_put_url: '/sign_s3',
          onProgress: function(percent, message) {
              // console.log("onProgress");
              $('#user_profile_img_edit_link').hide();
              $('#user_profile_img_status').html(percent + '% ' + message);
          },
          onFinishS3Put: function(public_url) {
              // console.log("onFinishS3Put");
              // $("#user_profile_img_preview").attr("src", public_url);
              // $('#user_profile_img_status').html('Upload completed. Uploaded to: '+ public_url);
              // console.log(public_url);
              
              // $('#user_profile_img_edit').hide();
              

              // $("#user_profile_img_avatar_url").val(public_url);
              // $("#user_profile_img_preview").html('<img src="'+public_url+'" style="width:300px;" />');
              if (!type){
                $("#user_profile_img_preview").attr("src", public_url);
              } else {
                $("#user_icon_img_preview").attr("src", public_url);

                $('#user_profile_img_status').html('');
                $('#user_profile_img_submit').show();
                $('#user_profile_img_cancel').show();
                zsNotifyView.nv_hide(1);
              }
              // zsNotifyView.nv_hide(1);
          },
          onError: function(status, file) {
              $('#user_profile_img_edit_link').show();
              // console.log("onError");
              // console.log(jqxhr.status);
              $('#user_profile_img_status').html('Upload error: ' + status.split("\n")[0]);
              // console.log(status);
              // console.log(file);

              // $('#user_profile_img_status').html(jqxhr.status);
              // $('#user_profile_img_status').html(jqxhr);
              // console.log(status)
              
              // console.log(jqxhr.responseText)
              // zsNotifyView.nv_show(1, status, 5000);
              // zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
              zsNotifyView.nv_show(1, '<div class="btn-danger zs_notify_html_message"><b>Problem with image upload. Try Again. </b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 10000);
          }
      });
    },

    zs_trigger_file_browser: function() {
      $("#user_profile_img_edit").trigger('click');
      return false;
    },

    zs_submit_image: function() {
      console.log("inside zs_submit_image");
      zsNotifyView.nv_show(1);

      new_icon_img_url = $('#user_icon_img_preview').attr("src");
      new_orig_img_url = $('#user_profile_img_preview').attr("src");

      userData = {
        img_icon_url: new_icon_img_url,
        profile_image_url: new_orig_img_url,
      }
      // console.log(userData);

      $.ajax({
        type: 'POST',
        url: '/profile/image',
        data: userData,
        success: function(data, status, jqxhr) {
          $("#user_profile_img_original").attr("src", new_orig_img_url);

          $('#user_profile_img_submit').hide();
          $('#user_profile_img_cancel').hide();
          $('#user_profile_img_edit_link').show();

          // refresh the page from the server, not using cache.
          location.reload(true)
          zsNotifyView.nv_hide(1);
        },
        error: function(jqxhr, status) {
          // console.log(status);
          zsNotifyView.nv_show(1, jqxhr.responseText);
        },
      })

    },

    zs_revert_image: function() {
      console.log("inside zs_revert_image");

      orig_img_url = $('#user_profile_img_original').attr("src");
      $("#user_profile_img_preview").attr("src", orig_img_url);

      $('#user_profile_img_submit').hide();
      $('#user_profile_img_cancel').hide();
      $('#user_profile_img_edit_link').show();
    },

    getUserEditObj: function(target_element) {
      var userinfo_data = {};
      userinfo_data.fullname = $(".fullname").val();
      userinfo_data.gender = $(".gender").val();
      // userinfo_data.name = {};
      // userinfo_data.name.first = $(".first_name").val();
      // userinfo_data.name.last = $(".last_name").val();
      userinfo_data.short_bio = $(".short_bio").val();
      userinfo_data.aboutme = $(".aboutme").val();
      userinfo_data.areacode = $(".areacode").val();
      userinfo_data.age = $(".age").val();

      userinfo_data.img_icon_url = $(".img_icon_url").val();
      userinfo_data.profile_image_url = $(".profile_image_url").val();
      userinfo_data.cover_image_url = $(".cover_image_url").val();

      userinfo_data.verify_password = $(".verify_password").val();
      
      if(JSON.stringify(userinfo_data) == '{}'){
        zsNotifyView.nv_show(1, '<div class="btn-warning zs_notify_html_message"><b>User infomation is empty</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
        return false;
      }
      return userinfo_data;
    },

    zs_show_passwords: function(e){
      // console.log("zs_show_passwords clicked");
      if (e.target.checked){
        $($("#current_pass")[0]).attr("type", "text");
        $($("#new_pass")[0]).attr("type", "text");
        $($("#confirm_new_pass")[0]).attr("type", "text");  
      } else {
        $($("#current_pass")[0]).attr("type", "password");
        $($("#new_pass")[0]).attr("type", "password");
        $($("#confirm_new_pass")[0]).attr("type", "password");  
      }
    },

    getPasswordChangeObj: function() {
      var change_password_data = {};
      change_password_data.current_password = $($("#current_pass")[0]).val();
      change_password_data.new_password = $($("#new_pass")[0]).val();
      change_password_data.confirm_new_password = $($("#confirm_new_pass")[0]).val();

      if(JSON.stringify(change_password_data) == '{}'){
        zsNotifyView.nv_show(1, '<div class="btn-warning zs_notify_html_message"><b>Your Passwords cannot be empty.</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
        return false;
      }
      if((change_password_data.new_password == "") || (change_password_data.new_password != change_password_data.confirm_new_password)){
        zsNotifyView.nv_show(1, '<div class="btn-warning zs_notify_html_message"><b>New Passwords Do not Match.</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
        return false;
      }
      return change_password_data;
    },

    update_user_info: function() {
      // console.log("inside update_user_info");
      zsNotifyView.nv_show(1);

      userinfo_data = this.getUserEditObj()
      // console.log(userinfo_data);

      if(!userinfo_data)
        return;

      var this_view = this;

      $.ajax({
        type: 'POST',
        url: '/profile/info',
        data: userinfo_data,
        success: function(data, status, jqxhr) {
          console.log("Request Successful");
          console.log(data);
          this_view.clear_form();
          // $("#user-profile-message").attr("class", "alert alert-success").html("Successfully updated");
          // $(e.target).attr("data-content", data)
          // $(".usrinfo-main").html(data);
          
          zsNotifyView.nv_hide(1);
          // zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
          window.location.reload();
        },
        error: function(jqxhr, status) {
          // console.log("ERROR Occured");
          // $("#user-profile-message").attr("class", "alert alert-danger").html("Wrong password");
          // console.log(status);
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
        },
      })

      return false;
    },

    submit_change_password: function() {
      zsNotifyView.nv_show(1);

      change_password_data = this.getPasswordChangeObj()
      // console.log(change_password_data);
      if(!change_password_data)
        return false;

      var this_view = this;

      $.ajax({
        type: 'POST',
        url: '/profile/change-password',
        data: change_password_data,
        success: function(data, status, jqxhr) {
          // console.log("Request Successful");
          // console.log(data);
          this_view.clear_form();
          // $("#user-profile-message").attr("class", "alert alert-success").html("Successfully updated");
          // $(e.target).attr("data-content", data)
          // $(".usrinfo-main").html(data);
          
          // zsNotifyView.nv_hide(1);
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
          // window.location.reload();
        },
        error: function(jqxhr, status) {
          // console.log("ERROR Occured");
          // $("#user-profile-message").attr("class", "alert alert-danger").html("Wrong password");
          // console.log(status);
          zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
        },
      })

      return false;
    },

    usrinfo_clicked: function(e) {
      // console.log("inside usrinfo_clicked");

      var all_list_element = $(".usrinfo-sidebar .list-group-item");
      all_list_element.removeClass("active");
      
      var clicked_element = $(e.target)
      clicked_element.addClass("active");

      var clicked_element_value = clicked_element.attr("value");
      // console.log(clicked_element_value)

      var all_display_element = $(".usrinfo-display");
      all_display_element.hide();

      var display_element = $(".usrinfo-display."+clicked_element_value);
      display_element.show();

      if (!display_element.hasClass("zs-populated")) {
        zsNotifyView.nv_show(1);
        $.ajax({
          type: 'GET',
          url: '/profile/'+clicked_element_value,
          // data: {some: "data"},
          success: function(data, status, jqxhr) {
            // console.log(data);
            display_element.html(data);
            display_element.addClass("zs-populated");
            zsNotifyView.nv_hide(1);
          },
          error: function(jqxhr, status) {
            // console.log(jqxhr.status);
            zsNotifyView.nv_show(1, jqxhr.responseText, 5000);
            // zsNotifyView.nv_show(1, '<div class="btn-warning zs_notify_html_message"><b>'+status+' '+jqxhr.status+'</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
          },
        });
      }
      return false;
    },

    render: function() {
      // console.log("in all_question_view render function");
      return this;
    }

  });

  return zsUserProfileView;
});