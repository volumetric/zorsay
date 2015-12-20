module.exports = function(app){

    app.get('/users?', function(req, res){
        if(req.session.loggedIn && req.session.admin) {
            console.log("ADMIN PAGE ACCESSED")
            // res.send("here is your all users page");
        } else {
            res.status(404).render("zs_404_page_not_found");
            return;
        }

        res.redirect(302, '/users/recent')
    });

    app.get('/users?/:order(recent|top)/:lastId?/:limit?/:type?', function(req, res){

        if(req.session.loggedIn && req.session.admin) {
            console.log("ADMIN PAGE ACCESSED")
            // res.send("here is your all users page");
        } else {
            res.status(404).render("zs_404_page_not_found");
            return;
        }

        if (req.params.lastId && !isNaN(req.params.lastId))
          lastId = req.params.lastId;
        else
          lastId = 10000000000;

        if (req.params.limit && !isNaN(req.params.limit))
          limit = req.params.limit;
        else
          limit = 20;

        var return_type = req.params.type ? req.params.type : "fullhtml" ;
        var list_order = req.params.order ? req.params.order : "recent";

        var all_user_data = {};
        all_user_data.list_order = list_order;
        all_user_data.loggedIn = req.session.loggedIn;
        all_user_data.navbar_data = {}
        all_user_data.navbar_data.user_info = {}
        var accountId = null;

        if (req.session.loggedIn){
          accountId = req.session.user_info._id;
          all_user_data.navbar_data.user_info = req.session.user_info;
        }

        if (list_order == "recent") {
          var queryFunction = app.models.Account.getAgentsPopulatedById
          // var queryFunction = app.models.Account.getAgentsPopulatedByActivity
        } else if (list_order == "top") {
          // var queryFunction = app.models.Account.getAgentsPopulatedByVotes
          var queryFunction = app.models.Account.getAgentsPopulatedById
        } else {
          var queryFunction = app.models.Account.getAgentsPopulatedById
        }

        queryFunction(lastId, limit, 
          {},
          function(err, user_docs){

          if (err || !user_docs) {
            console.log(err)
            console.log("nothing came")
            res.status(404).render("zs_404_content_not_found.ejs");
            return;
          }

          if (user_docs.length == 0) {
            console.log("length zero")
            res.status(404).render("zs_404_no_more.ejs");
            return; 
          }

          all_user_data.user_main_column_data = {}
          all_user_data.user_main_column_data.user_list_data = user_docs

            if (!return_type){
              res.render('zs_all_user_page', {
                all_user_data: all_user_data,
              });
            } else if (return_type == "json") {
              res.json({
                user_list_data: user_docs
              })
            // } else if (return_type == "fulljson") {
            //   res.json({
            //     all_user_data: all_user_data
            //   })
            } else if(return_type == "html") { 
              res.render('zs_user_short_list', {
                user_list_data: user_docs,
                user_info: req.session.user_info,
                loggedIn: req.session.loggedIn,
              });
            } else if(return_type == "fullhtml") { //Default
              res.render('zs_all_user_page', {
                all_user_data: all_user_data,
              });
            }
        });

    })

    // get public profile page for any user
    app.get('/user/:id/:urlname?/:type?', function(req, res) {
    
        // if (!req.session.loggedIn){
        //   res.redirect('/login');
        //   return;
        // }

        var return_type = req.params.type;
        var urlname = req.params.urlname;
        var userId = req.params.id;

        if(!userId || isNaN(userId)){
          res.send(404);
          return;
        }

        user_public_profile_page_data = {}
        user_public_profile_page_data.loggedIn = req.session.loggedIn;
        user_public_profile_page_data.navbar_data = {}
        user_public_profile_page_data.navbar_data.user_info = {}
        user_public_profile_page_data.main_data = {}
        user_public_profile_page_data.main_data.user_account = {}
        
        if (req.session.loggedIn){
            user_public_profile_page_data.navbar_data = { 
                user_info: req.session.user_info
            };
        }


        app.models.Account.findById(userId, function(err, user) {
            // console.log("inside findById callback")
            if (err || !user) {
                // console.log(err);
                // console.log(user);
                // console.log("user with given _id not found:", userId);
                res.send(404);
                return;
            } else if (urlname != user.url_name) {
                // console.log("========================");
                // console.log(urlname)
                // console.log("-----------------------");
                // console.log(user.url_name)
                // console.log("========================");

                redirect_url = user.permalink ? user.permalink : "/user/"+user._id+"/"+user.url_name;
                
                // console.log("Redirection with 301 to:", redirect_url);
                res.redirect(301, redirect_url);
                return;
            } else {
                user_public_profile_page_data.main_data.user_account = user;
            }

            res.render('zs_user_public_profile_page', { 
                navbar_data: user_public_profile_page_data.navbar_data, 
                main_data: user_public_profile_page_data.main_data,
            });
      
            // if (return_type && return_type == "json") {
            //     res.json({
            //         user_public_profile_page_data: user_public_profile_page_data
            //     })
            // } else {
            //     res.render('zs_user_public_profile_page', { 
            //         navbar_data: user_public_profile_page_data.navbar_data, 
            //         main_data: user_public_profile_page_data.main_data,
            //     });
            // }
        });


        // navbar_data = { user_info: req.session.user_info };
        // main_data = { user_account: req.session.user_account };

        // res.render('zs_user_profile_page', { 
        //   navbar_data: navbar_data, 
        //   main_data: main_data,
        // });

        // res.send("public user profile page to come here");
        // res.json(req.session.user_account);
    });

      // get public profile page specific inner elements
      app.get('/userinfo/:id/:val', function(req, res){
        console.log("inside /userinfo/:id/:val")

        var userId = req.params.id;
        var userVal = req.params.val;

        // res.send("user "+userId+" "+userVal);
        // res.send("<b>Nothing Available</b>");
        res.send("<b>Coming Soon</b>");
        
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