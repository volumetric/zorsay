module.exports = function(app){

  request = require("request");

  // submiting email is the on landing page to get notification of the launch
  // app.post('/landing', function (req, res) {
  //   console.log('email posted');
  //   var email = req.param('email', null);
    
  //   var ip = req.headers['X-Forwarded-For']; // gives the correct result if proxy is used.
  //   if (!ip)
  //     var ip = req.connection.remoteAddress;  // if 'X-Forwarded-For' request header is not there.

  //   if (null == email || email.length < 1 || validateEmail(email) == false) {
  //     res.send(400);
  //     return;
  //   }

  //   app.models.LaunchListAccount.launchListAccountSubmit(email, ip, function(err){
  //     if (err){
  //       // console.log("Something is not right " + err);
  //       if (err.code){
  //         res.send(err.code);
  //       }
  //       else{
  //         // #TODO plun in a notification system to ping developers about the problem. 
  //         res.send(500);
  //       }
  //     } else {
  //       console.log('Email is registered for Launch List.');
  //       res.send(200);
  //     }
  //   });

  // });

  var link_account_check = function(user_doc, user_access_token, userdata_obj, callback) {
    console.log(user_doc);
    if(user_doc.social_network_data) {
      console.log("social_network_data field exists")
      if (user_doc.social_network_data.facebook.id != userdata_obj.id) {
        user_doc.social_network_data.facebook.id = userdata_obj.id;
        user_doc.social_network_data.facebook.token = user_access_token;
        user_doc.social_network_data.facebook.data = JSON.stringify(userdata_obj);
        user_doc.save(callback);
      } else {
        callback(null, user_doc);
      }
    } else {
      console.log("social_network_data field DO NOT exists")
      user_doc.social_network_data = {};
      user_doc.social_network_data.facebook = {};
      user_doc.social_network_data.twitter = {};
      user_doc.social_network_data.google = {};

      user_doc.social_network_data.facebook.id = userdata_obj.id;
      user_doc.social_network_data.facebook.token = user_access_token;
      user_doc.social_network_data.facebook.data = JSON.stringify(userdata_obj);
      user_doc.save(callback);
    }
  }

  
  app.post('/socialsignup/:network(facebook|twitter|google)', function(req, res){
    console.log("Got a request for socialsignup with:");
    var network = req.params.network ? req.params.network : null;

    if (!network) {
      res.send(404);
      return;
    }
    console.log(network);

    userdata = req.param('userdata');
    // console.log(userdata.authResponse.authResponse.accessToken);

    if (userdata.authResponse.status != "connected") {
      res.send(401);
      return;
    }

    var fbUserAccessToken = userdata.authResponse.authResponse.accessToken;
    console.log(fbUserAccessToken);

    var form_data = { 
      'access_token': fbUserAccessToken,  
      // 'batch': '[{"method":"GET", "relative_url":"me"}]',
      'batch': '[{"method":"GET", "relative_url":"me"}, {"method":"GET", "relative_url":"me/picture?width=500&height=500"}, {"method":"GET", "relative_url":"me/picture?width=50&height=50"}]',
    }

    console.log("===============USER ACCESS TOKEN===============");

    request.post('https://graph.facebook.com', {form:form_data}, function(err, httpResponse, body){ 
      if (err) {
        console.log(err);
        console.log(httpResponse);
        res.send(401);
        return;
      }
      console.log(body);
      console.log("------------------------");

      try {
        var body_obj = JSON.parse(body);
      } catch(err) {
        console.log(err);
        res.send(401);
        return;
      }

      if (body_obj.error) {
        console.log(body_obj);
        res.send(401);
        return;
      }

      if (body_obj){
        userdata = body_obj[0].body;

        // console.log(userdata);
        // console.log(userpic_500);
        // console.log(userpic_50);

        // console.log("1");
        try {
          // console.log("2");

          // console.log(userdata);
          // console.log(body_obj[1].headers);
          // console.log(body_obj[2].headers);

          var userdata_obj = JSON.parse(userdata);
          // var userpic_500_obj = JSON.parse(body_obj[1].headers);
          // var userpic_50_obj = JSON.parse(body_obj[2].headers);
          var userpic_500_obj = body_obj[1].headers;
          var userpic_50_obj = body_obj[2].headers;

          // console.log("3");
          // console.log(userpic_500_obj);
          // console.log(userpic_50_obj);

          for(i in userpic_500_obj){
            if (userpic_500_obj[i].name == "Location") {
              userdata_obj["userpic_500_url"] = userpic_500_obj[i].value;
            }
          }

          for(i in userpic_50_obj){
            if (userpic_50_obj[i].name == "Location") {
              userdata_obj["userpic_50_url"] = userpic_50_obj[i].value;
            }
          }

          console.log(userdata_obj);

          fb_email = userdata_obj.email;
          fb_id = userdata_obj.id;

          app.models.Account.findByEmail(fb_email, function(err, user_doc){
            if (err) {
              res.send(401);
              return;
            }
            if (!user_doc){
              app.models.Account.findByFbId(fb_id, function(err, user_doc){
                if (err) {
                  res.send(401);
                  return;
                }
                if (!user_doc){
                  // #TODO
                  if ((!userdata_obj.email) || (!userdata_obj.first_name) || (!userdata_obj.last_name)) {
                    console.log("*********** FB EMAIL NOT GIVEN ***********")
                    res.send(401);
                    return;
                  }

                  if (!userdata_obj.userpic_500_url) {
                    console.log("*********** FB PIC NOT GIVEN ***********")
                    userdata_obj.userpic_500_url = "/img/newuser.jpg"
                  }

                  if (!userdata_obj.userpic_50_url) {
                    console.log("*********** FB PIC_50 NOT GIVEN ***********")
                    userdata_obj.userpic_50_url = "/img/newuser_50.jpg"
                  }

                  app.models.Account.social_register(network, userdata_obj, function(err, user_doc){
                    link_account_check(user_doc, fbUserAccessToken, userdata_obj, function(err, user_doc){
                      console.log('social signup successful for:', network);
                      var uinfo = create_login_session(req, user_doc);
                      // console.log(uinfo);
                      res.send(uinfo);  
                    });
                  });
                  return;   
                } else {
                  // #TODO
                  link_account_check(user_doc, fbUserAccessToken, userdata_obj, function(err, user_doc){
                    console.log('social login successful with id for:', network);
                    var uinfo = create_login_session(req, user_doc);
                    // console.log(uinfo);
                    res.send(uinfo);  
                  });
                  return;
                }
              });
            } else {
                // #TODO
                link_account_check(user_doc, fbUserAccessToken, userdata_obj, function(err, user_doc){
                  console.log('social login successful with id for:', network);
                  var uinfo = create_login_session(req, user_doc);
                  // console.log(uinfo);
                  res.send(uinfo);  
                });
                return;
            }
          });      

        } catch(err) {
          // console.log("4");
          console.log(err);
          res.send(401);
          return;
        }
      } else {
        res.send(401);
        return;
      }

      // console.log("ssssssssss");
      // res.send(404);
    });
    // res.send(404);
  });

  function create_login_session(req, account) {
      req.session.loggedIn = true;
      req.session.accountId = account._id;
      req.session.user_account = account;
      // req.session.user_info = {};
      
      // console.log("*************************************************");
      // console.log(typeof(account.created_at));
      // console.log(account.created_at.toDateString());
      // console.log(typeof(req.session.user_account.created_at));
      // console.log(req.session.user_account.created_at.toDateString());
      // console.log("*************************************************");

      user_info = {
        email: account.email, 
        profile_image_url: account.profile_image_url, 
        img_icon_url: account.img_icon_url, 
        fullname: account.fullname,
        url_name: account.url_name,
        level: account.level,
        gender: account.gender,
        name: {
          first: account.name.first, 
          last: account.name.last
        }, 
        _id: account._id,
      };

      if (app.AccessControl.isAdmin(user_info)){
        user_info.admin = true;
        req.session.admin = true;
        req.session.admin_id = account._id;
        user_info.admin_id = req.session.admin_id;
      }
      if (app.AccessControl.isStaff(user_info)){
        user_info.staff = true;
        req.session.staff = true;
      }
      if (app.AccessControl.isMod(user_info)){
        user_info.mod = true;
        req.session.mod = true;
      }
      
      req.session.user_info = user_info;
      // res.send({user_info: user_info});
      return {user_info: user_info};
  }


  app.post('/login', function(req, res) {
    console.log('login request');
    var email = req.param('email', null);
    var password = req.param('password', null);

    if ( null == email || email.length < 1
        || null == password || password.length < 1 ) {
      res.send(400);
      return;
    }
    console.log("trying to login");
    app.models.Account.login(email, password, function(err, account) {
      // console.log("in login callback");
      if ( err || !account ) {
        console.log("account not found");
        res.send(401);
        return;
      }
      console.log('login was successful');
      req.session.loggedIn = true;
      req.session.accountId = account._id;
      req.session.user_account = account;
      // req.session.user_info = {};
      
      // console.log("*************************************************");
      // console.log(typeof(account.created_at));
      // console.log(account.created_at.toDateString());
      // console.log(typeof(req.session.user_account.created_at));
      // console.log(req.session.user_account.created_at.toDateString());
      // console.log("*************************************************");

      user_info = {
        email: account.email, 
        profile_image_url: account.profile_image_url, 
        img_icon_url: account.img_icon_url, 
        fullname: account.fullname,
        url_name: account.url_name,
        level: account.level,
        gender: account.gender,
        name: {
          first: account.name.first, 
          last: account.name.last
        }, 
        _id: account._id,
      };

      if (app.AccessControl.isAdmin(user_info)){
        user_info.admin = true;
        req.session.admin = true;
        req.session.admin_id = account._id;
        user_info.admin_id = req.session.admin_id;
      }
      if (app.AccessControl.isStaff(user_info)){
        user_info.staff = true;
        req.session.staff = true;
      }
      if (app.AccessControl.isMod(user_info)){
        user_info.mod = true;
        req.session.mod = true;
      }
      
      req.session.user_info = user_info;

      res.send({user_info: user_info});
      // console.log(req.session);
    });
  });


  app.get('/login', function(req, res) {
    
    if (req.session.loggedIn){
      res.redirect('/profile');
      return;
    }
    res.render('zs_login_page');
  });

  app.get('/signup', function(req, res) {
    
    if (req.session.loggedIn){
      res.redirect('/profile');
      return;
    }
    res.render('zs_signup_page');
  });

  app.post('/logout', function(req, res) {
    console.log('logout request');

    req.session.accountId = null;
    req.session.loggedIn = false;
    req.session.user_info = null;
    req.session.user_account = null;

    req.session.admin = null;
    req.session.admin_id = null;

    req.session.staff = null;
    req.session.mod = null;

    // console.log(req.session);

    res.send(200);
  });

  function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

  function validatePassword(password) { 
    return password.length > 4;
  }

  app.post('/register', function(req, res) {
    console.log('register request');
    var firstName = req.param('firstName', '');
    var lastName = req.param('lastName', '');
    var email = req.param('email', null);
    var password = req.param('password', null);


    app.check_captcha(req, function(err){
      console.log("inside callback for app.check_captcha");
      // console.log("inside callback for check_captcha");
      
      if(err) {
        console.log("captcha not right")
        // captcha not right
        res.status(412).send("Incorrect Captcha. Try Again");
        return;
      } else {
        console.log("captcha correct")

        if ( !validateEmail(email) || !validatePassword(password) ) {
          console.log("invalid email or password");
          res.status(412).send("Invalid email or password");
          return;
        }

        var hostname = req.headers.host;
        var verificationUrl = 'http://' + hostname + '/verify';
        console.log('trying to register');

        app.models.Account.register(email, password, firstName, lastName, verificationUrl, function(err, newdoc){
          // console.log('in register callback');

          if (err || !newdoc){
            console.log('err during register');
            console.log(err);
            // error_code = err.code ? err.code : 500;
            if (err.code)
              res.status(err.code).send(err.message);
            else
              res.send(500).send("Internal Server Error. Please Try Again after some time.")
          } else {
            // res.status(200).render("zs_200_success.ejs");
            var uinfo = create_login_session(req, newdoc);
            res.send(uinfo);
            
            // app.models.Account.sendVerificationMail(newdoc, verificationUrl, subject, message, function(){});

            app.models.Account.generateAndSaveHash(newdoc, function(err, doc){
              if (err || !doc){
                res.status(500).render("zs_500_failed_sending_mail.ejs");
              } else {
                action_url = verificationUrl;
                action_url += '?account=' + doc._id+'&vid='+doc.verification_id_hash;

                var subject = 'Welcome To Zorsay';
                // var message = "Thanks for signing up with <b>Zorsay</b>. <br> Click the link below to verify your email address: <br>";
                // message += action_url;

                var mail_data = {
                  subject: subject, 
                  action_url: action_url,
                  user_info: doc,
                };

                app.render("mail_templates/zs_mail_welcome.ejs", mail_data, function(err, message){
                  if (err || !message){
                    console.log(err);
                  } else {
                    // #TODO put "Zorsay <noreply@zorsay.com>" in config file
                    app.models.Account.zsSendMail("Zorsay <noreply@zorsay.com>", doc.fullname + " <"+doc.email+">", subject, message, function(err){});
                  }
                })
              }

            });
          }

        });
      }

    });
  });

  app.get('/account/authenticated', function(req, res) {
    if ( req.session.loggedIn ) {
      res.send(200);
    } else {
      res.send(401);
    }
  });

  app.get('/account/info', function(req, res) {
    if ( req.session.loggedIn ) {
      res.send(req.session.user_info);
      return;
    } else {
      console.log("/account/info");
      res.send(401);
    }
  });

  // function timestamp_comparator(a, b) {

  // }

  // app.get('/accounts/me/reviews', function(req, res) {
  //   // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
  //   var accountId = req.session.accountId;

  //   app.models.Account.findById(accountId, function(account) {
  //     if (!account) {
  //       res.send(400);
  //     } else {
  //       res.send(account.reviews);
  //       // if (req.params.id == 'me') {
  //       //   // var all_reviews = account.reviews.concat(account.anonReviews);
  //       //   var all_reviews = account.reviews;

  //       //   var all_sorted_reviews = all_reviews;
  //       //   // var all_sorted_reviews = all_reviews.sort(timestamp_comparator);
          
  //       //   res.send(all_sorted_reviews) // if id is "me" show all the reviews, public and anonymous
  //       // } else {
  //       //   res.send(account.reviews); // show only public reviews of the user
  //       // }
  //     }
  //   });
  // });

  // app.get('/reviews/:id', function(req, res) {

  //   console.log(req.params.id);
  //   // res.send(200);
  //   // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
  //   var reviewId = req.params.id;

  //   app.models.PublicReviews.findById(reviewId, function(publicReview) {
  //     if (!publicReview) {
  //       // console.log("not in PublicReviews");
  //       res.send(404);
  //     } else {
  //       // console.log("found in PublicReviews...");
  //       app.models.Account.findById(publicReview.accountId, function(account) {
  //         // console.log("Got accountId...");
  //         console.log(account.reviews.length);
  //         for (var i = 0; i < account.reviews.length; ++i){
  //           // console.log(account.reviews[i]._id);
  //           // console.log(reviewId);
  //           if (account.reviews[i]._id == reviewId){
  //             // console.log("found the review...");
  //             // res.send(account.reviews[i]);
  //             res.render('review', account.reviews[i]);
  //             return;
  //           }
  //         }
  //         res.send(404);
  //         return;
  //       });
  //     }
  //   });
  // });

  // function expandReviews(docs, callback) {
  //   // console.log("expandReviews called");
  //   res = [];
  //   pushed = 0;
  //   // console.log(docs);

  //   for (var i=0; i < docs.length; ++i){
  //     // console.log(pushed);
  //     accountId = docs[i]["accountId"];
  //     reviewId = docs[i]["reviewId"];

  //     (function(reviewId) {
  //       app.models.Account.findById(accountId, function(account) {
  //         if (account) {
  //           // console.log("found account");
  //           for (var r = 0; r < account.reviews.length; ++r) {
  //             // console.log("=="+account.reviews[r]._id+"==");
  //             // console.log("=="+reviewId+"==");
  //             // console.log("");

  //             // console.log("=="+typeof(account.reviews[r]._id)+"==");
  //             // console.log("=="+typeof(reviewId)+"==");
  //             // console.log("");
  //             // console.log("$$$$$"); 
  //             // console.log(r);
  //             // console.log("$$$$$");
  //             if (account.reviews[r]._id.toString() == reviewId.toString()){
  //               // console.log("got the review");
  //               // console.log(account.reviews[r]);
  //               res.push(account.reviews[r]);
  //               ++pushed;
  //               // console.log(pushed);
  //               // console.log(r);
  //               if (pushed == docs.length){
  //                 // console.log(res);
  //                 callback(res);
  //               }
  //               break;
  //             }
  //           }
  //         }
  //       });
  //     })(reviewId);
  //   }
  // }

  // // get all the public reviews posted by people, along with their first name and all anon reviews with name = anon
  // // send back the latest 50 reviews posted on the system
  // app.post('/reviews/all', function(req, res) {
  //   // var accountId = req.session.accountId;

  //   skip_count = parseInt(req.param('skip'));
  //   anchor_count = parseInt(req.param('anchor'));
  //   response = {};
    
  //   if (anchor_count == 0){
  //     app.models.PublicReviews.PublicReviews.count(function(err, currCount){
  //       anchor_count = currCount;
  //       app.models.PublicReviews.getNextPage(skip_count, anchor_count, 10, function(err, results) {
  //         if (err){
  //           res.send(400);
  //         }
  //         // console.log(results);
  //         response.skip = skip_count + results.length;
  //         response.anchor = anchor_count;
  //         expandReviews(results, function(expandedResults){
  //           response.results = expandedResults;
  //           res.send(response);
  //         });
  //       });
  //     });
  //   } else {
  //     app.models.PublicReviews.getNextPage(skip_count, anchor_count, 10, function(err, results) {
  //       if (err){
  //         console.log("[VIN_ERROR]=> Error in getNextPage()")
  //         res.send(200);
  //       }
  //       response.skip = skip_count + results.length;
  //       response.anchor = anchor_count;
  //       expandReviews(results, function(expandedResults){
  //         response.results = expandedResults;
  //         res.send(response);
  //       });
  //     });
  //   }
  // });

  // app.post('/accounts/me/reviews', function(req, res) {
  //   // var accountId = req.params.id == 'me'
  //   //                    ? req.session.accountId
  //   //                    : req.params.id;
  //   var accountId = req.session.accountId;
  //   // console.log("---------------------------");
  //   // console.log(accountId);
  //   // console.log(typeof(accountId));
  //   // console.log("---------------------------");
  //   app.models.Account.findById(accountId, function(account) {
  //     if (!account) {
  //       res.send(400);
  //     } else {
  //       review = {
  //         _id: mongoose.Types.ObjectId(),
  //         reviewText:   req.param('reviewText'),
  //         vendor:       req.param('vendor'),
  //         pscategory:   req.param('pscategory'),
  //         anonymous:    req.param('anonymous'),
  //         otd_rating:   parseInt(req.param('otd_rating')),
  //         pad_rating:   parseInt(req.param('pad_rating')),
  //         pri_rating:   parseInt(req.param('pri_rating')),
  //         pro_rating:   parseInt(req.param('pro_rating')),
  //         eos_rating:   parseInt(req.param('eos_rating')),
  //         rrp_rating:   parseInt(req.param('rrp_rating')),
  //         csu_rating:   parseInt(req.param('csu_rating')),
  //         all_rating:   req.param('all_rating'),
  //         otd_comment:  req.param('otd_comment'),
  //         pad_comment:  req.param('pad_comment'),
  //         pri_comment:  req.param('pri_comment'),
  //         pro_comment:  req.param('pro_comment'),
  //         eos_comment:  req.param('eos_comment'),
  //         rrp_comment:  req.param('rrp_comment'),
  //         csu_comment:  req.param('csu_comment')
  //       };
  //       console.log(JSON.stringify(review));
  //       account.reviews.push(review);
  //       // console.log("@@#########")
  //       // console.log(typeof(account.reviews));
        
  //       // if (req.param('anonymous') === "on")
  //       //   account.anonReviews.push(review);
  //       // else
  //       //   account.reviews.push(review);

  //       // Push the status to all friends
  //       // account.activity.push(status);
  //       account.save(function (err, doc) {
  //         if (err) {
  //           console.log('[VIN_ERROR]=> Error saving account: ' + err);
  //         }
  //           console.log('[VIN_DEBUG]=> Saved review with review id: ' + review._id);
  //           app.models.PublicReviews.addEntry(accountId, review._id, function(err, res){
  //             console.log(res);
  //           });
  //           console.log("=====================================================");
  //           // // console.log(account.reviews.find({_id:review._id}));
  //           console.log(account.reviews.length);
  //           for (var r = 0; r < account.reviews.length; ++r) {
  //             // console.log("#########")
  //             if (account.reviews[r]._id == review._id){
  //               console.log("got the review");
  //               console.log(account.reviews[r]);
  //             }
  //             // console.log("#########")
  //             // break;
  //           }
  //       });
  //       res.send(200);
  //   }
  //   });
  // });

  // app.get('/accounts/me', function(req, res) {
  //   // var accountId = req.params.id == 'me'
  //   //                    ? req.session.accountId
  //   //                    : req.params.id;
  //   var accountId = req.session.accountId;
  //   app.models.Account.findById(accountId, function(account) {
  //     if (account)
  //       res.send(account);
  //     else
  //       res.send(400);
  //   });
  // });


  // app.post('/forgotpassword', function(req, res) {
  //   var hostname = req.headers.host;
  //   var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  //   var email = req.param('email', null);
  //   if (!validateEmail(email)) {
  //     res.send(412).render("zs_412_email_invalid.ejs");
  //     return;
  //   }

  //   app.models.Account.forgotPassword(email, resetPasswordUrl, function(err, doc){
  //     if (err || !doc){
  //       res.status(403).render("zs_403_forbidden.ejs");
  //     } else {
  //       res.status(200).render("zs_200_success.ejs");
  //     }
  //   });
  // });

  app.post('/forgotpassword', function(req, res) {
    var hostname = req.headers.host;
    var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
    var email = req.param('email', null);
    if (!validateEmail(email)) {
      res.send(412).render("zs_412_email_invalid.ejs");
      return;
    }

    app.models.Account.Model.findOne({email:email}, function(err, doc){
      if (err || !doc){
        res.status(403).render("zs_403_forbidden.ejs");
      } else {

        // app.models.Account.sendVerificationMail(doc, resetPasswordUrl, subject, message, function(err, newdoc){
        //   if (err || !newdoc){
        //     res.status(500).render("zs_500_failed_sending_mail.ejs");
        //   } else {
        //     res.status(200).render("zs_200_success_check_mail.ejs");
        //   }
        // });

        app.models.Account.generateAndSaveHash(doc, function(err, doc){
          if (err || !doc){
            res.status(500).render("zs_500_failed_sending_mail.ejs");
          } else {

            var action_url = resetPasswordUrl;
            action_url += '?account=' + doc._id+'&vid='+doc.verification_id_hash;
            
            var subject = 'Zorsay Password Recovery';
            var simple_message = 'A <b>Password Recovery</b> request has been made from your Account. If this was <b>Not</b> you, then please ignore this mail. <br> Otherwise Click the link below to <b>Reset</b> your password:<br> ';
            simple_message += action_url;

            var mail_data = {
              subject: subject, 
              action_url: action_url,
              user_info: doc,
            };

            app.render("mail_templates/zs_mail_recover_password.ejs", mail_data, function(err, message){
              if (err || !message){
                console.log(err);
                res.status(500).render("zs_500_failed_sending_mail.ejs");
              } else {
                // #TODO put "Zorsay <noreply@zorsay.com>" in config file
                app.models.Account.zsSendMail("Zorsay <noreply@zorsay.com>", doc.fullname + " <"+doc.email+">", subject, message, function(err){
                  if (err){
                    console.log(err);
                    res.status(500).render("zs_500_failed_sending_mail.ejs");
                  } else {
                    res.status(200).render("zs_200_success_check_mail.ejs");
                  }
                });
              }              
            })

          }
        });

      }
    });
  });


  app.get('/verify', function(req, res) {
    var accountId = req.param('account', null);
    var vid_hash = req.param('vid', null);
    
    app.models.Account.findAndVerify(accountId, vid_hash, function(err, account) {
      if (err || !account){
        // res.send(400);
        console.log(1);
        console.log(err);
        res.status(400).render('accountActivationFail');
        return;
      } else {
        if (account.verified && account.email_verified){
          res.render('accountActivationSuccess');
          return;
        } else {
          // set verified variable for the account to be true
          account.verified = true;
          account.email_verified = true;
          account.save(function(err, doc){
            if (err || !doc){
              // res.send(400);
              console.log(2);
              console.log(err);
              res.status(400).render('accountActivationFail');
              return;
            } else {
              console.log("account verification completed for: "+doc._id);
              res.render('accountActivationSuccess');
              return;
            }
          });
          // res.render('accountActivationSuccess');  
        }
      }
    });
  });

  app.post('/verifyemail', function(req, res) {
    if ( !req.session.loggedIn ) {
      res.status(401).render("zs_401_not_logged.ejs");
      return;
    }

    app.models.Account.findById(req.session.accountId, function(err, account){
      if (err || !account){
        res.status(403).render('zs_403_forbidden.ejs');
        return;
      }
      if (account.verified || account.email_verified){
        res.status(200).render('zs_200_mail_already_verified.ejs');
        return;
      } else {
        var hostname = req.headers.host;
        var verificationUrl = 'http://' + hostname + '/verify';
        

        // app.models.Account.sendVerificationMail(account, verificationUrl, subject, message, function(err, account) {
        //   if (err || !account){
        //     res.status(500).render('zs_500_failed_sending_mail.ejs'); 
        //   } else {
        //     res.status(200).render('zs_200_success_check_mail.ejs');
        //   }
        // });

        app.models.Account.generateAndSaveHash(account, function(err, doc){
          if (err || !doc){
            res.status(500).render("zs_500_failed_sending_mail.ejs");
          } else {
            action_url = verificationUrl;
            action_url += '?account=' + doc._id+'&vid='+doc.verification_id_hash;

            var subject = "Zorsay Email Verification";
            var simple_message = "This is a <b>Verification mail</b> from your <b>Zorsay</b> Account. <br> Click the link below to verify your email address: <br>";
            simple_message += action_url;

            var mail_data = {
              subject: subject, 
              action_url: action_url,
              user_info: doc,
            };

            app.render("mail_templates/zs_mail_email_verification.ejs", mail_data, function(err, message){
              if (err || !message){
                console.log(err);
                res.status(500).render("zs_500_failed_sending_mail.ejs");
              } else {
                // #TODO put "Zorsay <noreply@zorsay.com>" in config file
                app.models.Account.zsSendMail("Zorsay <noreply@zorsay.com>", doc.fullname + " <"+doc.email+">", subject, message, function(err){
                  if (err){
                    console.log(err);
                    res.status(500).render("zs_500_failed_sending_mail.ejs");
                  } else {
                    res.status(200).render("zs_200_success_check_mail.ejs");
                  }
                });
              }              
            })
          }

        });
      }
    })

  });


  app.get('/resetPassword', function(req, res) {
    var accountId = req.param('account', null);
    var vid_hash = req.param('vid', null);
    
    app.models.Account.checkvidhash(accountId, vid_hash, function(err, account) {
      if (err || !account){
        // #TODO change this to a full page forbidden page
        res.status(403).render('zs_403_forbidden');
        return;
      } else {
        // res.render('resetPassword', {locals:{accountId:accountId}});
        res.render('resetPassword');
      }
    });
  });

  app.post('/resetPassword', function(req, res) {
    var accountId = req.param('accountId', null);
    var password = req.param('password', null);
    var re_password = req.param('re-password', null);
    if ( null != accountId && validatePassword(password) && password == re_password) {
      app.models.Account.changePassword(accountId, password);
    }
    res.render('resetPasswordSuccess');
  });

} // end module.exports