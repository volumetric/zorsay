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

      "change #user_profile_img_edit": "resize_image",
      // "change #user_profile_img_edit": "s3_upload",
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

    // https://hacks.mozilla.org/2011/01/how-to-develop-a-html5-image-uploader/
    resize_image: function(e) {
      console.log("inside resize_image");
      zsNotifyView.nv_show(1);

      console.log(e.target);
      console.log(e.target.files[0]);

      // var file = e.target.files[0];
      var file = $("#user_profile_img_edit")[0].files[0]

      if (!file.type.match(/image.*/)) {
        // this file is not an image.
        zsNotifyView.nv_show(1, '<div class="btn-danger zs_notify_html_message"><b>This file is not an image.</b><a class="fa fa-times pull-right zs_global_notification_close" style="text-decoration: none"></a></div>', 5000);
        return;
      } else {

        function dataURItoBlob(dataURI) {
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
          
        }

        var img_local_src = window.URL.createObjectURL(file);
        console.log(img_local_src);

        var jqimg = $("#user_profile_img_preview");
        jqimg.attr("src", img_local_src);

        var aimg = document.createElement("img");
        aimg.src = img_local_src;

        this_view = this;
        setTimeout(function () {
          // img = jqimg[0];
          img = aimg;

          var canvas = $("<canvas>")[0];
          // var canvas = $("#image_preprocess_canvas")[0];

          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);

          // #TODO smooth the image after resize
          // console.log("200-----")
          var MAX_WIDTH = 200;
          var MAX_HEIGHT = 200;
          var width = img.width;
          var height = img.height;
           
          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }
          canvas.width = width;
          canvas.height = height;
          var ctx = canvas.getContext("2d");
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
          // var dataurl = canvas.toDataURL(file.type);
          // jqimg.attr("src", dataurl);
          // console.log(dataurl);

          // setTimeout(function(){
          //   console.log("resized image: ");
          //   var dataurl = canvas.toDataURL(file.type);
          //   console.log(dataurl);
          //   // jqimg.attr("src", dataurl);
          // }, 2000)

          var imgData = ctx.createImageData(width, height);
          var data = imgData.data;

          var pixels = ctx.getImageData(0, 0, width, height);
          for (var i = 0, ii = width; i < ii; i += 1) {
            for (var j = 0, jj = height; j < jj; j += 1) {
              
              var r = 0, g = 0, b = 0, a = 0;
              
              // var idx = ((j-1) * width * 4) + ((i-1) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              // var idx = ((j-1) * width * 4) + ((i) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              // var idx = ((j-1) * width * 4) + ((i+1) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              // var idx = ((j) * width * 4) + ((i-1) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              var idx = ((i) * height) + ((j));
              r = pixels.data[idx*4 + 0];
              g = pixels.data[idx*4 + 1];
              b = pixels.data[idx*4 + 2];
              a = pixels.data[idx*4 + 3];

              // var idx = ((j) * width * 4) + ((i+1) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              // var idx = ((j+1) * width * 4) + ((i-1) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              // var idx = ((j+1) * width * 4) + ((i) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              // var idx = ((j+1) * width * 4) + ((i+1) * 4);
              // r += pixels.data[idx + 0];
              // g += pixels.data[idx + 1];
              // b += pixels.data[idx + 2];

              // var r = pixels.data[idx + 0];
              // var g = pixels.data[idx + 1];
              // var b = pixels.data[idx + 2];

              // var idx = ((j) * width * 4) + ((i) * 4);
              data[idx + 0] = r;
              data[idx + 1] = g;
              data[idx + 2] = b;
              data[idx + 3] = a;
            }
          }

          // ctx.putImageData(pixels, 0, 0);
          ctx.putImageData(imgData, 0, 0);
          console.log(pixels);
          console.log(imgData);
          
          setTimeout(function(){
            console.log("resized and smoothened image: ");
            var dataurl = canvas.toDataURL(file.type);
            console.log(dataurl);
            jqimg.attr("src", dataurl);
          }, 2000)

          var dataurl = canvas.toDataURL(file.type);
          // var dataurl = canvas.toDataURL("image/png");
          console.log(dataurl);

          blob = dataURItoBlob(dataurl)
          random_name = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
              var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
              return v.toString(16);
          });

          blob.name = random_name+"."+file.type.split("/")[1];
          // blob.lastModifiedDate = new Date();
          // blob.webkitRelativePath = "";
          // blob.__proto__ = File;
          
          console.log(blob);

          // var fd = new FormData(document.forms[0]);
          // fd.append("myFile", blob);
          // console.log(fd);

          file_dom_element = {}
          file_dom_element.files = [blob];
          // file_dom_element.files = [fd];
          this_view.fde = file_dom_element;
          // window.open(canvas.toDataURL());

          // console.log(this_view.fde);
          // this_view.s3_upload();

        }, 1000)

        zsNotifyView.nv_hide(1);        
      }
    },

    s3_upload: function(){
      console.log("inside s3_upload function");
      zsNotifyView.nv_show(1);

      this_view = this;
      console.log(this_view.fde);
      var s3upload = new S3Upload({
          file_dom_selector: '#user_profile_img_edit',
          file_dom_element: this_view.fde,
          // #TODO put user id as user_1 here, for specific url generation 
          file_opts: "parent_post_id",
          s3_sign_put_url: '/sign_s3',
          onProgress: function(percent, message) {
              console.log("onProgress");
              $('#user_profile_img_edit_link').hide();
              $('#user_profile_img_status').html(percent + '% ' + message);
          },
          onFinishS3Put: function(public_url) {
              console.log("onFinishS3Put");
              // $("#user_profile_img_preview").attr("src", public_url);
              // $('#user_profile_img_status').html('Upload completed. Uploaded to: '+ public_url);
              console.log(public_url);
              $('#user_profile_img_status').html('');
              // $('#user_profile_img_edit').hide();
              $('#user_profile_img_submit').show();
              $('#user_profile_img_cancel').show();

              // $("#user_profile_img_avatar_url").val(public_url);
              // $("#user_profile_img_preview").html('<img src="'+public_url+'" style="width:300px;" />');
              $("#user_profile_img_preview").attr("src", public_url);
              zsNotifyView.nv_hide(1);
          },
          onError: function(status, jqxhr) {
              $('#user_profile_img_edit_link').show();
              // console.log("onError");
              // console.log(jqxhr.status);
              $('#user_profile_img_status').html('Upload error: ' + status);
              // console.log(status)
              // console.log(jqxhr)
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

      new_img_url = $('#user_profile_img_preview').attr("src");

      userData = {
        img_icon_url: new_img_url,
        profile_image_url: new_img_url,
      }
      console.log(userData);

      $.ajax({
        type: 'POST',
        url: '/profile/image',
        data: userData,
        success: function(data, status, jqxhr) {
          $("#user_profile_img_original").attr("src", new_img_url);

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