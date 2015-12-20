module.exports = function(app){

  // get own private profile page
  app.get('/profile', function(req, res) {
    
    if (!req.session.loggedIn){
      res.redirect('/login');
      return;
    }

    navbar_data = { user_info: req.session.user_info };
    main_data = { user_account: req.session.user_account };
    // sidebar_data = {};

    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    // console.log(typeof(req.session.user_account.created_at));
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
    // console.log(typeof(main_data.user_account.created_at));
    // console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

    res.render('zs_user_profile_page', { 
      navbar_data: navbar_data, 
      main_data: main_data,
    });

    // res.json(req.session.user_account);
  });


  // get own private profile page specific inner elements
  app.get('/profile/:val', function(req, res){
    console.log("inside /profile/:val")

    if(!req.session.loggedIn){
        res.send(400);
        return;
    }

    // console.log(req.params.val)
    // console.log(req.session.user_account);

    if (req.params.val == "about"){
        res.render("zs_ajax_html_userinfo_about.ejs", {
            user_account: req.session.user_account
        });
    } else if (req.params.val == "edit") {
        res.render("zs_ajax_html_userinfo_edit.ejs", {
            user_account: req.session.user_account
        });
    } else if (req.params.val == "change-password") {
        res.render("zs_ajax_html_change_password.ejs", {
            user_account: req.session.user_account
        });
    } else {
        // res.send(404);
        // res.send("<b>Nothing Available</b>");
        res.send("<b>Coming Soon</b>");

    }

  });

  var getPasswordObj = function(req) {

    if (req.param('new_password'))
      var new_password = req.param('new_password');

    if (req.param('confirm_new_password'))
      var confirm_new_password = req.param('confirm_new_password');


    if (new_password != confirm_new_password)
      return false;

    return new_password;
  }

  var getAccountObj = function(req, edit) {
    var account = {};

    // if (req.param('email'))
    //   account.email = req.param('email');
    
    if (req.param('fullname'))
      account.fullname = req.param('fullname');
    
    if (req.param('fullname')){
      account.name = {};
      account.name.first = account.fullname.split(' ')[0];
      account.name.last = account.fullname.split(' ').slice(1).join(' ');
    }

    if (req.param('short_bio'))
      account.short_bio = req.param('short_bio');

    if (req.param('aboutme'))
      account.aboutme = req.param('aboutme');

    if (req.param('profile_image_url'))
      account.profile_image_url = req.param('profile_image_url');


    if (req.param('img_icon_url')){
      account.img_icon_url = req.param('img_icon_url');
    } else if (req.param('profile_image_url')) {
      account.img_icon_url = req.param('profile_image_url');      
    }
  

    if (req.param('cover_image_url'))
      account.cover_image_url = req.param('cover_image_url');

    if (req.param('areacode')){
      if (!isNaN(req.param('areacode')))
        account.areacode = req.param('areacode');
      else
        account.location = req.param('areacode');
    }    

    if (req.param('age') && !isNaN(req.param('age')))
      account.age = req.param('age');

    if (req.param('gender'))
      account.gender = req.param('gender');

    if (JSON.stringify(account) == '{}')
        return false;
    return account;
  }

  // /profile/change-password
  app.post('/profile/change-password', function(req, res){
    console.log("inside post /profile/change-password")

    if(!req.session.loggedIn){
        res.status(401).render("zs_401_not_logged.ejs");
        return;
    }

    new_password = getPasswordObj(req);
    if (!new_password){
      // res.send(412); // precondition failed
      res.status(412).render("zs_412_password_invalid.ejs");
      return;
    }
    console.log(new_password);

    if (req.param('current_password')){
      var current_password = req.param('current_password');
    } else {
      res.status(401).render("zs_401_wrong_password.ejs");
      return;
    }

    // var diff_fields = ["password"];

    app.models.Account.editAgentPassword(req.session.user_info._id, req.session.user_info._id, new_password, current_password, function(err, updated_account){

        if(err || !updated_account){
            console.log("error changing agent password")
            console.log(err);
            res.status(412).render("zs_401_wrong_password.ejs");
            // res.status(403).render("zs_403_forbidden.ejs");
        } else {
            console.log("agent password changed")
            res.status(200).render("zs_200_success.ejs");
        }
    });
  });

  // update stuff for own profile
  app.post('/profile/:op(info|image)', function(req, res){
    console.log("inside post /profile/:op(info|image)")

    var op = req.params.op ? req.params.op : "info";

    if(!req.session.loggedIn){
        res.send(401);
        return;
    }

    userObj = getAccountObj(req, true);
    if (!userObj){
      // res.send(412); // precondition failed
      res.status(412).render("zs_412_userinfo_invalid.ejs");
      return;
    }
    console.log(userObj);

    if (op == "info"){
      if (req.param('verify_password')){
        var verify_password = req.param('verify_password');
      } else {
        res.status(401).render("zs_401_wrong_password.ejs");
        return;
      }
      var diff_fields = ["fullname","name","gender","short_bio","location","areacode","aboutme","img_icon_url","profile_image_url","cover_image_url","age"];
    } else {
      var verify_password = null;
      var diff_fields = ["img_icon_url","profile_image_url","cover_image_url"];
    }

    
    app.models.Account.editAgent(req.session.user_info._id, req.session.user_info._id, userObj, verify_password, diff_fields, function(err, updated_account){

        if(err || !updated_account){
            console.log("error saving agent")
            console.log(err);
            // res.send(412);
            res.status(412).render("zs_401_wrong_password.ejs");
            // res.status(403).render("zs_403_forbidden.ejs");
        } else {
            console.log("agent saved")
            // account is saved

            req.session.user_info = {
                _id: updated_account._id,

                email: updated_account.email, 
                name: {
                  first: updated_account.name.first, 
                  last: updated_account.name.last,
                }, 
                fullname: updated_account.fullname,
                url_name: updated_account.url_name,

                gender: updated_account.gender,
                level: updated_account.level,

                img_icon_url: updated_account.img_icon_url, 
                profile_image_url: updated_account.profile_image_url, 
                cover_image_url: updated_account.cover_image_url,
            };

            req.session.user_account = updated_account;

            // res.redirect("/profile");
            // res.json(updated_account);
            
            // res.send(200);
            res.status(200).render("zs_200_success.ejs");
        }
    });


    // console.log(req.params.val)
    // console.log(req.session.user_account);

    // if (req.params.val == "about"){
    //     res.render("zs_ajax_html_userinfo_about.ejs", {
    //         user_account: req.session.user_account
    //     });
    // } else if (req.params.val == "edit") {
    //     res.render("zs_ajax_html_userinfo_edit.ejs", {
    //         user_account: req.session.user_account
    //     });
    // } else {
    //     res.send(404);
    // }

  });

} // end module.exports