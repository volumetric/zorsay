module.exports = function(app){

  // app.get('/shopping-experience/add', function(req, res) {

  //   console.log("inside /shopping-experience/add")

  //   add_shopex_page_data = {}
  //   add_shopex_page_data.navbar_data = {}
  //   if (req.session.loggedIn){
  //     add_shopex_page_data.navbar_data = {user_info: req.session.user_info};
  //   }

  //   res.render('zs_add_shopex_page', {
  //     add_shopex_page_data: add_shopex_page_data
  //   });

  // });


  // app.get('/shopexx/:id', function(req, res){
  //   findByPubIdAuthorCommentsPopulated1
  // })

  app.get('/shopping-experiences?', function(req, res){
    res.redirect(302, '/shopping-experiences/recent')
  });

  // app.get('/shopping-experience/val/ejs/:limit?/:skip?', function(req, res){
  app.get('/shopping-experiences?/:order(recent|topvoted)/:lastId?/:limit?/:type?', function(req, res){
    
    console.log("inside /shopping-experience/:order(recent|topvoted)/:lastId?/:limit?/:type?");

    // console.log("order:", req.params.order);
    // console.log("limit:", req.params.limit);
    // console.log("lastId:", req.params.lastId);
    // console.log("type:", req.params.type);

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

    // console.log("order:", list_order);
    // console.log("limit:", limit);
    // console.log("lastId:", lastId);
    // console.log("type:", return_type);

    var all_shopex_data = {};
    all_shopex_data.list_order = list_order;
    all_shopex_data.loggedIn = req.session.loggedIn;
    all_shopex_data.navbar_data = {}
    all_shopex_data.navbar_data.user_info = {}
    var accountId = null;

    if (req.session.loggedIn){
      accountId = req.session.user_info._id;
      all_shopex_data.navbar_data.user_info = req.session.user_info;
    }

    // app.models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
    // app.models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){

    if (list_order == "recent") {
      // var queryFunction = app.models.Shopex.getPostsPopulatedById
      var queryFunction = app.models.Shopex.getPostsPopulatedByActivity
    } else if (list_order == "topvoted") {
      var queryFunction = app.models.Shopex.getPostsPopulatedByVotes
    } else {
      var queryFunction = app.models.Shopex.getPostsPopulatedById
    }

    queryFunction(lastId, limit, 
      {
      "_author": "name fullname level img_icon_url url_name",
      // "_seller": "name _author _shopexes", 
      "_seller": "name url_name", 
      "_pro_cat": "name url_name", 
      "_ser_cat": "name url_name", 
      // #TODO add this by making collection for "Product" and "Service" in the db
      // "_pro": "name",
      // "_ser": "name", 
      // "_comments": "content_text _author _parent_name _parent_id",
      "_comments": "content_text _author created_at updated_at",
      },
      function(err, shopex_docs){

      if (err || !shopex_docs) {
        res.status(404).render("zs_404_content_not_found.ejs");
        return;
      }

      if (shopex_docs.length == 0) {
        res.status(404).render("zs_404_no_more.ejs");
        return; 
      }

      all_shopex_data.shopex_main_column_data = {}
      all_shopex_data.shopex_main_column_data.shopex_list_data = shopex_docs

      // console.log("all_shopex_data");
      // console.log({all_shopex_data: all_shopex_data});

      // all_shopex_data
      //   navbar_data
      //     user_info_data
      //   top_header_data
      //   shopex_main_column_data
      //     shopex_list_data = [shopex_data]
      //   right_sidebar_data
      //   end_footer_data

      app.models.Utils.getAllPostsSidebarData(function(err, side_bar_data){
        if (!return_type){
          res.render('zs_all_shopex_page', {
            all_shopex_data: all_shopex_data,
            side_bar_data: side_bar_data,
          });
        } else if (return_type == "json") {
          res.json({
            shopex_list_data: shopex_docs
          })
        } else if (return_type == "fulljson") {
          res.json({
            all_shopex_data: all_shopex_data
          })
        } else if(return_type == "html") { 
          res.render('zs_shopex_short_list', {
            shopex_list_data: shopex_docs,
            user_info: req.session.user_info,
            loggedIn: req.session.loggedIn,
          });
        } else if(return_type == "fullhtml") { //Default
          res.render('zs_all_shopex_page', {
            all_shopex_data: all_shopex_data,
            side_bar_data: side_bar_data,
          });
        }
      });

    });
  });


  app.get('/:shopex(shopping-experience|shopex)/:id/:content(comments|body)/:type?', function(req, res) {
    // console.log("inside /shopping-experience/:id/comments/:type?")

    var return_type = req.params.type ? req.params.type : "";
    var return_type_trail = return_type ? "/"+return_type : "";

    var content_type = req.params.content;

    var shopexId = req.params.id;

    if(!shopexId || isNaN(shopexId)){
      // res.send(404);
      res.status(404).render("zs_404_content_not_found.ejs");
      return;
    }

    comment_container_data = {}
    comment_container_data.loggedIn = req.session.loggedIn;
    comment_container_data.navbar_data = {}
    if (req.session.loggedIn){
      comment_container_data.user_info = req.session.user_info;
    }

    if (content_type == "body") {

      app.models.Shopex.getPostPopulatedNested(shopexId, {}, function(err, shopex) {
        if (err || !shopex) {
          res.status(404).render("zs_404_content_not_found.ejs");
          return;
        }
        var single_shopex_data = {}
        single_shopex_data.shopex_data = shopex;

        if (return_type && return_type == "json") {
          res.json({
            single_shopex_data: single_shopex_data,
          });
        } else if (return_type && return_type == "html") {
          res.render('zs_shopex_short_expanded', {
            single_shopex_data: single_shopex_data,
          });
        }
      });

    } else {
      app.models.Shopex.getPostCommentsPopulatedNested(shopexId, function(err, shopex) {
        if (err || !shopex || !shopex._comments) {
          console.log("no comments for shopex with given _id:", shopexId);
          // res.send(404);
          res.status(404).render("zs_404_content_not_found.ejs");
          return;
        }else {
          comment_container_data.comments = shopex._comments;
        }

        if (return_type && return_type == "json") {
          res.json({
            comment_container_data: comment_container_data
          })
        } else {
          res.render('zs_ajax_html_post_comment_list', {
            comment_container_data: comment_container_data
          });
        }
      });  
    }

    
  });

  // app.get('/shopping-experience/:id/:type?', function(req, res) {
  app.get('/shopping-experience/:id*', function(req, res) {

    // console.log("inside /shopping-experience/:id/:type?")
    console.log("inside /shopping-experience/:id*")


    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    var return_type = req.params.type ? req.params.type : "";
    var return_type_trail = return_type ? "/"+return_type : "";

    var shopexId = req.params.id;
    // console.log("_id:", shopexId);

    // var port = process.env.PORT || 8080;
    // var port = 80;
    // var port_str = (port==80) ? "" : ":"+port;
    var page_link = req.protocol+"://"+req.host//+port_str;

    var shopex_title = "";

    // if(!hasValue(shopexId)){
    if(!shopexId || isNaN(shopexId)){
      // res.send(404);
      res.status(404).render("zs_404_content_not_found.ejs");
      return;
    }
    
    // single_shopex_page_data
    //   navbar_data
    //     user_info_data
    //   top_header_data
    //   shopex_main_column_data
    //     shopex_data = shopex
    //   right_sidebar_data
    //   end_footer_data

    var single_shopex_page_data = {}
    single_shopex_page_data.loggedIn = req.session.loggedIn;
    single_shopex_page_data.navbar_data = {}
    var accountId = null;

    if (req.session.loggedIn){
      accountId = req.session.user_info._id
      single_shopex_page_data.navbar_data = {user_info: req.session.user_info};
    }

    var latestPermalink = function(sx){
      var u = "/shopping-experience/"+sx._id;
      u += sx._seller ? "/" + sx._seller.url_name : "";

      for(var i = 0; i < sx._pro_cat.length; ++i) {
      // for (i in sx._pro_cat){
        u += sx._pro_cat[i] ? "/" + sx._pro_cat[i].url_name : "";
      }

      for(var i = 0; i < sx._ser_cat.length; ++i) {
      // for (i in sx._ser_cat){
        u += sx._ser_cat[i] ? "/" + sx._ser_cat[i].url_name : "";
      }
      return u;
    }


    // app.models.Shopex.getPostPopulated(shopexId, 

    app.models.Shopex.getPostPopulatedNested(shopexId, 
    // app.models.Shopex.viewPost(shopexId, 
      {
      "_author": "name fullname level img_icon_url url_name",
      // "_seller": "name _author _shopexes", 
      "_seller": "name url_name", 
      "_pro_cat": "name url_name", 
      "_ser_cat": "name url_name", 
      // "_pro": "name", 
      // "_ser": "name", 
      // "_comments": "content_text _author _parent_name _parent_id",
      "_comments": "content_text _author created_at updated_at",
      },
      // }, accountId,
      function(err, shopex) {

      // console.log("inside findById callback")
      if (err || !shopex) {
        // console.log(err);
        // console.log(shopex);
        // console.log("Shopex with given id not found:", shopexId);
        // res.send(404);
        res.status(404).render("zs_404_content_not_found.ejs");
        return;
      } else if (shopex.permalink != latestPermalink(shopex)){
        // console.log("vvv")
        // console.log(shopex.permalink)
        // console.log(latestPermalink(shopex))
        // console.log("vvv")
        app.models.Shopex.resave(shopexId, function(err, saved_shopex){
          // console.log("fff")
          if (!err && saved_shopex)
            res.redirect(301, saved_shopex.permalink + return_type_trail);
          else
            res.redirect(301, latestPermalink(shopex) + return_type_trail);   
        })
        // console.log("ppp");
        // res.redirect(301, latestPermalink(shopex) + return_type_trail);  
        return;
      } else if (req.url != shopex.permalink + return_type_trail) {
        // console.log("ggg")
        res.redirect(301, shopex.permalink + return_type_trail);  
        return;
      }
      // console.log("shopex.permalink:", shopex.permalink)

      var sd = shopex;
      if (sd.content_title) {
        shopex_title = sd.content_title;
      } else {
        shopex_title = "Online Shopping for ";

        for(var i = 0; i < sd._pro_cat.length; ++i) {
        // for (i in sd._pro_cat){
          shopex_title += sd._pro_cat[i].url_name;
          shopex_title += (i < sd._pro_cat.length - 1) ? ', ' : '';
        }
        
        for(var i = 0; i < sd._ser_cat.length; ++i) {
        // for (i in sd._ser_cat){
          content_title += procat_docs.length > 0 ? ", " : "";
          shopex_title += sd._ser_cat[i].url_name;
          shopex_title += (i < sd._ser_cat.length - 1) ? ', ' : '';
        }

        shopex_title += " from ";
        shopex_title += sd._seller.url_name;
      }


      single_shopex_page_data.single_shopex_data = {}
      single_shopex_page_data.single_shopex_data.shopex_data = shopex;

      page_link += single_shopex_page_data.single_shopex_data.shopex_data.permalink;

      // console.log(shopex._comments[0]._author);
      // console.log(single_shopex_page_data);

      // res.json({
      //   single_shopex_page_data: single_shopex_page_data
      // })

      app.models.Utils.getSinglePostSidebarData(function(err, side_bar_data){

        if (return_type && return_type == "json") {
          res.json({
            single_shopex_page_data: single_shopex_page_data,
            side_bar_data: side_bar_data,
          })
        } else {
          res.render('zs_single_shopex_page', {
            single_shopex_page_data: single_shopex_page_data,
            side_bar_data: side_bar_data,
            page_info : {
              page_title: shopex_title,
              page_link: page_link,
              post_type: "Shopping Experience"      
            },
          });
        }

      });

      // if (accountId && shopex.meta_info.viewers.indexOf(accountId) == -1) {
      //     console.log("VIEWED BY:", accountId);
      //     shopex.meta_info.viewers.push(accountId);
      //     // console.log(shopex);
      //     shopex.save(null);
      // }

    });
  });


  // app.get('/shopping-experience/all/:limit/:skip', function(req, res){
  //   console.log("inside /shopping-experience/all/:limit/:skip")

  //   limit = req.params.limit;
  //   skip = req.params.skip;
  //   console.log("limit:", limit);
  //   console.log("skip:", skip);

  //   app.models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){
  //     if (err || !shopex_docs) {
  //       console.log("$$$ Sending 404 $$$")
  //       res.send(404);
  //     } else {
  //       console.log("$$$ Sending shopexes $$$")
  //       res.send(shopex_docs);
  //     }
  //   });
  // });

  // app.get('/shopping-experience/all', function(req, res){
  //   console.log("inside /shopping-experience/all")

  //   app.models.Shopex.getPostsByTime(function(err, shopex_docs){
  //     if (err || !shopex_docs) {
  //       console.log("$$$ Sending 404 $$$")
  //       res.send(404);
  //     } else {
  //       console.log("$$$ Sending shopexes $$$")
  //       res.send(shopex_docs);
  //     }
  //   });
  // });

  // app.get('/shopping-experience/val/:limit?/:skip?', function(req, res){
  //   console.log("inside /shopping-experience/val/:limit/:skip")

  //   limit = req.params.limit;
  //   skip = req.params.skip;
  //   console.log("limit:", limit);
  //   console.log("skip:", skip);

  //   app.models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
  //     if (err || !shopex_docs) {
  //       console.log("$$$ Sending 404 $$$")
  //       res.send(404);
  //     } else {
  //       console.log("$$$ Sending shopexes $$$")
  //       res.send(shopex_docs);
  //     }
  //   });
  // });


  // app.post('/shopping-experience/:id/upvote', function(req, res){
  //   console.log("inside /shopping-experience/:id/upvote")
    
  //   if (!req.session.loggedIn) {
  //     res.send(401);
  //     return;
  //   } else {
  //     var accountId = req.session.user_info._id;
  //   }

  //   var shopexId = req.params.id;

  //   app.models.Shopex.upvote(shopexId, accountId, function(err, shopex_doc){
  //     if (err || !shopex_doc) {
  //       res.send(404);
  //     } else {
  //       res.send(200);
  //     }
  //   })
  // });

  app.post('/:shopex(shopping-experience|shopex)/:id/meta/:op', function(req, res){
    console.log("inside /:shopex(shopping-experience|shopex)/:id/meta/:op");

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_op.ejs");
      return;
    } else {
      var accountId = req.session.user_info._id;
    }

    shopexId = req.params.id;
    var op = req.params.op;

    if (op == "view") {
      app.models.Shopex.view(shopexId, accountId, function(err, shopex_doc){
        if (err || !shopex_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "upvote") {
      app.models.Shopex.upvote(shopexId, accountId, function(err, shopex_doc){
        if (err || !shopex_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "makeanon") {
      app.models.Shopex.makeAnon(shopexId, accountId, function(err, shopex_doc){
        if (err || !shopex_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "removeanon") {
      app.models.Shopex.removeAnon(shopexId, accountId, function(err, shopex_doc){
        if (err || !shopex_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "favourite") {
      app.models.Shopex.favourite(shopexId, accountId, function(err, shopex_doc){
        if (err || !shopex_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    // } else if (op == "follow") {
    //   app.models.Shopex.follow(shopexId, accountId, function(err, shopex_doc){
    //     if (err || !shopex_doc) {
    //       res.send(404);
    //     } else {
    //       res.send(200);
    //     }
    //   });
    } else if (op == "report") {
      var report_data = req.param('report_data');
      report_data.account = accountId;

      app.models.Shopex.report(shopexId, report_data, function(err, shopex_doc){
        if (err || !shopex_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "share") {
      var share_data = req.param('share_data');
      share_data.account = accountId;
      
      app.models.Shopex.share(shopexId, share_data, function(err, shopex_doc){
        if (err || !shopex_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else {
      // res.send(403);
      res.status(403).render("zs_403_forbidden.ejs");
    }
  });

  var calculate_all_rating = function(arg) {
    var res = 0
    if (arg.length < 1)
      return res;

    for(var i = 0; i < arg.length; ++i) {
      res += arg[i]
    }
    return res/arg.length;
  }

  var getShopexObj = function(req, edit) {
    var shopex = {};

    if (!edit) { // if the shopex is being added
      if (req.param('seller_id')){
        shopex._seller = req.param('seller_id');
      } else {
        return false;
      }
    }

    if (req.param('content_text'))
      shopex.content_text = req.param('content_text');
    
    if (req.param('anon'))
      shopex.anon = JSON.parse(req.param('anon'));

    if (req.param('pro_cat_id')){
      // console.log('pro_cat_id', req.param('pro_cat_id'));
      shopex._pro_cat = JSON.parse(req.param('pro_cat_id'));
    }

    if (req.param('ser_cat_id'))
      shopex._ser_cat = JSON.parse(req.param('ser_cat_id'));
    
    if (req.param('pro_id'))
      shopex._pro = JSON.parse(req.param('pro_id'));

    if (req.param('ser_id'))
      shopex._ser = JSON.parse(req.param('ser_id'));

    // if (req.param('location'))
    //   shopex.location = req.param('location');

    if (req.param('areacode')) {
      if (!isNaN(req.param('areacode')))
        shopex.areacode = req.param('areacode');
      else
        shopex.location = req.param('areacode');
    }

    if (req.param('prod_links'))
      shopex.prod_links = req.param('prod_links');

    if (req.param('source'))
      shopex.source = req.param('source');


    var ratings = [];

    if (req.param('otd_rating')) {
      shopex.otd_rating = JSON.parse(req.param('otd_rating'));
      if (shopex.otd_rating != 0) ratings.push(shopex.otd_rating)
    }
    if (req.param('pad_rating')) {
      shopex.pad_rating = JSON.parse(req.param('pad_rating'));
      if (shopex.pad_rating != 0) ratings.push(shopex.pad_rating)
    }
    if (req.param('pri_rating')) {
      shopex.pri_rating = JSON.parse(req.param('pri_rating'));
      if (shopex.pri_rating != 0) ratings.push(shopex.pri_rating)
    }
    if (req.param('pro_rating')) {
      shopex.pro_rating = JSON.parse(req.param('pro_rating'));
      if (shopex.pro_rating != 0) ratings.push(shopex.pro_rating)
    }
    if (req.param('eos_rating')) {
      shopex.eos_rating = JSON.parse(req.param('eos_rating'));
      if (shopex.eos_rating != 0) ratings.push(shopex.eos_rating)
    }
    if (req.param('csu_rating')) {
      shopex.csu_rating = JSON.parse(req.param('csu_rating'));
      if (shopex.csu_rating != 0) ratings.push(shopex.csu_rating)
    }
    if (req.param('rrp_rating')) {
      shopex.rrp_rating = JSON.parse(req.param('rrp_rating'));
      if (shopex.rrp_rating != 0) ratings.push(shopex.rrp_rating)
    }
     
    shopex.all_rating = calculate_all_rating(ratings);

    if (req.param('otd_comment')) shopex.otd_comment = req.param('otd_comment');
    if (req.param('pad_comment')) shopex.pad_comment = req.param('pad_comment');
    if (req.param('pri_comment')) shopex.pri_comment = req.param('pri_comment');
    if (req.param('pro_comment')) shopex.pro_comment = req.param('pro_comment');
    if (req.param('eos_comment')) shopex.eos_comment = req.param('eos_comment');
    if (req.param('csu_comment')) shopex.csu_comment = req.param('csu_comment');
    if (req.param('rrp_comment')) shopex.rrp_comment = req.param('rrp_comment');

    return shopex;
  }

  app.delete('/:shopex(shopping-experience|shopex)/:id', function(req, res) {
    console.log("inside delete /shopping-experience/:id");

    if (!req.session.loggedIn) {
      res.status(401).render("zs_401_shopex_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;
    var shopexId = req.params.id;

    app.models.Shopex.deletePost(shopexId, accountId, function(err){
      console.log("inside callback of deletePost()")
      if (err){
        console.log(err);
        // res.status(500).render("zs_5xx_error.ejs");
        res.status(403).render("zs_403_shopex_delete.ejs");
        return;
      }
      res.send(200);
    });

  });

  app.post('/shopping-experience/:id', function(req, res) {
    console.log("inside /shopping-experience/:id");

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_shopex_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;

    var shopexId = req.params.id;
    var shopex = getShopexObj(req, true);
    if (!shopex){
      // res.send(412);
      res.status(412).render("zs_412_shopex_invalid.ejs");
      return;
    }
    var edit_summary = req.param('edit_summary');
    console.log("Edit shopexId: ", shopexId);
    console.log(JSON.stringify(shopex));

    var diff_fields = ["content_text","anon","location","otd_rating","pad_rating","pri_rating","pro_rating","eos_rating","rrp_rating","csu_rating","all_rating","otd_comment","pad_comment","pri_comment","pro_comment","eos_comment","rrp_comment","csu_comment"];

    // #TODO implement this function: editPermission()
    // editPermission(accountId, "shopex", shopexId, function(err, permission){

    app.models.Shopex.updatePost(shopexId, accountId, shopex, edit_summary, diff_fields,  function(err, updated_shopex){
      // console.log("inside callback of updatePost()")
      if (err || !updated_shopex){
        console.log(err);
        // res.status(500).render("zs_5xx_error.ejs");
        res.status(403).render("zs_403_forbidden.ejs");
        return;
      }
      // console.log("Shopex Updated:", updated_shopex._id);
      res.send(200);
    });

    // app.models.Shopex.getAuthorId(shopexId, function(err, authorId){
    //   if (err || !authorId || authorId != accountId) {
    //     console.log("Permission Denied To Edit")
    //     res.send(400);
    //     return;
    //   } else {
    //     console.log("Permission Accessed To Edit")
    //     app.models.Shopex.updatePost(shopexId, shopexObj, "edit_summary", diff_fields,  function(err, updated_shopex){
    //       console.log("inside callback of updatePost()")
    //       if (err || !updated_shopex){
    //         console.log(err);
    //         res.send(500);
    //         return;
    //       }
    //       console.log("Shopex Updated:", updated_shopex._id);
    //       res.send(200);
    //     });
    //     console.log("After calling updatePost")

    //     // send OK right away, dont need to wait for actual db save to return.
    //     // res.send(200);
    //   }
    // });
  });

  // #TODO make it "/shopping-experience/add"
  app.post('/shopping-experience', function(req, res) {

    shopex = getShopexObj(req);
    if (!shopex){
      // precondition failed
      // res.send(412);
      res.status(412).render("zs_412_shopex_invalid.ejs");
      return;
    }

    if (req.session.loggedIn) {
      shopex._author = req.session.user_info._id;
    } else {
      // DO NOT need to log in for posting a shopex
      shopex._author = null;
    }
    
    console.log(shopex);
    // console.log(JSON.stringify(shopex));

    app.models.Shopex.createPost(shopex, function(err, saved_shopex){
      if(err || !saved_shopex){
        console.log(err);
        // res.send(412);
        res.status(412).render("zs_412_shopex_invalid.ejs");
      } else {
        // shopex is saved

        // if (saved_shopex.permalink)
        //   res.redirect(saved_shopex.permalink);
        res.json(saved_shopex);
        // res.json(saved_shopex.permalink);
        // res.send(200);
      }
    })
    // res.send(200);
  });

} // end module.exports