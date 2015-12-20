module.exports = function(app){

  app.get('/admin', function(req, res){
    if(req.session.loggedIn && req.session.admin) {
      console.log("[ADMIN] ADMIN PAGE ACCESSED");
    } else {
      res.status(404).render("zs_404_page_not_found");
      return;
    }
    res.send("<html><body><a href='/users'>All Users</a></body></html>")
  })

  app.get('/switch/user/:id', function(req, res){
    if(req.session.loggedIn && req.session.admin) {
      console.log("[ADMIN] ADMIN PAGE ACCESSED")
      console.log("[ADMIN] USER SWITCH ACCESSED")
      // res.send("here is your all users page");
    } else {
      res.status(404).render("zs_404_page_not_found");
      return;
    }

    var userId = req.params.id;
    if(!userId || isNaN(userId)){
      res.send(404);
      return;
    }

    app.models.Account.findById(userId, function(err, account){
      if (err || !account) {
        res.send(401);
        return;   
      }
      if (account.email.substring(0, 13) != 'xxtestemailxx' && account._id != req.session.admin_id) {
        res.send(401);
        return; 
      }

      console.log('[ADMIN] Switch successful');
      // req.session.loggedIn = true;
      req.session.accountId = account._id;
      req.session.user_account = account;

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
        // req.session.admin = true;
      }
      if (app.AccessControl.isStaff(user_info)){
        user_info.staff = true;
        // req.session.staff = true;
      }
      if (app.AccessControl.isMod(user_info)){
        user_info.mod = true;
        // req.session.mod = true;
      }
      user_info.admin_id = req.session.admin_id;

      req.session.user_info = user_info;

      // res.send({user_info: user_info});
      res.redirect("/profile");
      // console.log(req.session);

    });
  });

} // end module.exports