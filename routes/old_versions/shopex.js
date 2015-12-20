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

  app.get('/shopping-experience/:pub_id', function(req, res) {
    console.log("ssseee")
    console.log(req.params.pub_id);
    // res.send(200);
    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    var shopexPubId = req.params.pub_id;

    app.models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
      if (err || !shopex) {
        // console.log("not in PublicReviews");
        res.send(404);
      } else {
        // console.log("found in PublicReviews...");
        // app.models.Account.findById(publicReview.accountId, function(account) {
          
          console.log("GET request for shopex with pub_id: "+shopexPubId);
          // console.log("Got Shopex: "+ JSON.stringify(shopex));

          // console.log(account.reviews.length);
          // for (var i = 0; i < account.reviews.length; ++i){
            // console.log(account.reviews[i]._id);
            // console.log(reviewId);
            // if (account.reviews[i]._id == reviewId){
              // console.log("found the review...");
              // res.send(account.reviews[i]);
              // app.models.Account.findById(shopex._author, function(account) {

              // }
              res.render('shopex', shopex);
              // return;
            // }
          // }
          // res.send(404);
          // return;
        // });
      }
    });
  });

  // app.get('/shopexx/:pub_id', function(req, res){
  //   findByPubIdAuthorCommentsPopulated1
  // })

  app.get('/shopping-experience/ejs/:pub_id', function(req, res) {

    console.log("inside /shopping-experience/ejs/:pub_id")

    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    var shopexPubId = req.params.pub_id;
    console.log("pub_id:", shopexPubId);

    // if(!hasValue(shopexPubId)){
    if(shopexPubId == undefined){
      res.send(404);
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

    single_shopex_page_data = {}
    single_shopex_page_data.navbar_data = {}
    if (req.session.loggedIn){
      single_shopex_page_data.navbar_data = {user_info: req.session.user_info};
    }

    // app.models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
    app.models.Shopex.findByPubIdAuthorCommentsPopulated(shopexPubId, function(err, shopex) {

      console.log("inside findByPubIdAuthorCommentsPopulated callback")
      if (err || !shopex) {
        console.log("Shopex with given pub_id not found:", shopexPubId);
        console.log(err);
        console.log(shopex);
        res.send(404);
        return;
      } else {

        single_shopex_page_data.single_shopex_data = {}

        // console.log("single_shopex_page_data");
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        console.log({single_shopex_page_data: single_shopex_page_data});

        single_shopex_page_data.single_shopex_data.shopex_data = shopex;
        // single_shopex_page_data.single_shopex_data.user_data = {};
      }

      // console.log(shopex._comments[0]._author);

      console.log(single_shopex_page_data);
      
      res.render('zs_single_shopex_page', {
        single_shopex_page_data: single_shopex_page_data
      });
    });
  });


app.get('/shopping-experience/ejs1/:pub_id', function(req, res) {

    console.log("inside /shopping-experience/ejs1/:pub_id")

    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    var shopexPubId = req.params.pub_id;
    console.log("pub_id:", shopexPubId);

    // if(!hasValue(shopexPubId)){
    if(shopexPubId == undefined){
      res.send(404);
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

    single_shopex_page_data = {}
    single_shopex_page_data.navbar_data = {}
    if (req.session.loggedIn){
      single_shopex_page_data.navbar_data = {user_info: req.session.user_info};
    }

    // app.models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
    app.models.Shopex.findByPubIdAuthorCommentsPopulated(shopexPubId, function(err, shopex) {

      console.log("inside findByPubIdAuthorCommentsPopulated callback")
      if (err || !shopex) {
        console.log("Shopex with given pub_id not found:", shopexPubId);
        res.send(404);
        return;
      } else {

        single_shopex_page_data.single_shopex_data = {}

        // console.log("single_shopex_page_data");
        // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        console.log({single_shopex_page_data: single_shopex_page_data});

        single_shopex_page_data.single_shopex_data.shopex_data = shopex;
        // single_shopex_page_data.single_shopex_data.user_data = {};
      }

      // console.log(shopex._comments[0]._author);

      console.log(single_shopex_page_data);
      
      res.render('zs_single_shopex_page', {
        single_shopex_page_data: single_shopex_page_data
      });
    });
  });

  app.get('/shopping-experience/all/:limit/:skip', function(req, res){
    console.log("inside /shopping-experience/all/:limit/:skip")

    limit = req.params.limit;
    skip = req.params.skip;
    console.log("limit:", limit);
    console.log("skip:", skip);

    app.models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){
      if (err || !shopex_docs) {
        console.log("$$$ Sending 404 $$$")
        res.send(404);
      } else {
        console.log("$$$ Sending shopexes $$$")
        res.send(shopex_docs);
      }
    });
  });

  app.get('/shopping-experience/all', function(req, res){
    console.log("inside /shopping-experience/all")

    app.models.Shopex.getPostsByTime(function(err, shopex_docs){
      if (err || !shopex_docs) {
        console.log("$$$ Sending 404 $$$")
        res.send(404);
      } else {
        console.log("$$$ Sending shopexes $$$")
        res.send(shopex_docs);
      }
    });
  });

  app.get('/shopping-experience/val/:limit?/:skip?', function(req, res){
    console.log("inside /shopping-experience/val/:limit/:skip")

    limit = req.params.limit;
    skip = req.params.skip;
    console.log("limit:", limit);
    console.log("skip:", skip);

    app.models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
      if (err || !shopex_docs) {
        console.log("$$$ Sending 404 $$$")
        res.send(404);
      } else {
        console.log("$$$ Sending shopexes $$$")
        res.send(shopex_docs);
      }
    });
  });

  app.get('/shopping-experience/val/ejs/:limit?/:skip?', function(req, res){
    
    console.log("inside /shopping-experience/val/ejs/:limit/:skip")

    limit = req.params.limit;
    skip = req.params.skip;
    console.log("limit:", limit);
    console.log("skip:", skip);

    all_shopex_data = {}
    all_shopex_data.navbar_data = {}
    if (req.session.loggedIn){
      all_shopex_data.navbar_data = {user_info: req.session.user_info};
    }

    // app.models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
    app.models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){

      all_shopex_data.shopex_main_column_data = {}
      all_shopex_data.shopex_main_column_data.shopex_list_data = []

      console.log("all_shopex_data");
      console.log({all_shopex_data: all_shopex_data});

      // all_shopex_data
      //   navbar_data
      //     user_info_data
      //   top_header_data
      //   shopex_main_column_data
      //     shopex_list_data = [shopex_data]
      //   right_sidebar_data
      //   end_footer_data

      if (err || !shopex_docs) {
        console.log("$$$ Got no shopex Sending empty shopex list $$$")
      } else {
        console.log("$$$ Got shopexes Sending shopex list $$$")
        all_shopex_data.shopex_main_column_data.shopex_list_data = shopex_docs
      }

      res.render('zs_all_shopex_page', {all_shopex_data: all_shopex_data} )

    });
  });


  app.post('/shopping-experience/:pub_id/upvote', function(req, res){
    console.log("inside /shopping-experience/:pub_id/upvote")
    pubid = req.params.pub_id;

    app.models.Shopex.upvote(pubid, function(err, shopex_doc){
      if (err || !shopex_doc) {
        res.send(404);
      } else {
        res.send(200);
      }
    })
  })

  app.post('/shopping-experience/:pub_id/upvalue', function(req, res){
    console.log("inside /shopping-experience/:pub_id/upvalue")
    pubid = req.params.pub_id;

    app.models.Shopex.upvalue(pubid, 1, function(err, shopex_doc){
      if (err || !shopex_doc) {
        res.send(404);
      } else {
        res.send(200);
      }
    })
  })



  var getShopexObj = function(req, anon) {
    var shopex = {};

    // reviewText:   req.param('reviewText'),
    if (req.param('reviewText') != undefined) shopex.review_text = req.param('reviewText');
    
    // _author:      req.session.accountId,

    // vendor:       req.param('vendor'),
    if (req.param('vendor') != undefined) shopex.vendor = req.param('vendor');

    // _seller:      req.param('seller_pub_id'),

    // pscategory:   req.param('pscategory'),
    if (req.param('pscategory') != undefined) shopex.pscategory = req.param('pscategory');

    // _pro_cat:     req.param('pro_cat_pub_id'),    // #Check would have to convert the stringified array to js array object
    // _pro:         req.param('pro_pub_id'),        // #Check would have to convert the stringified array to js array object

    // _ser_cat:     req.param('ser_cat_pub_id'),    // #Check would have to convert the stringified array to js array object
    // _ser:         req.param('ser_pub_id'),        // #Check would have to convert the stringified array to js array object
    
    // anonymous:    req.param('anonymous'),
    // anon:         anon == "on",
    if (anon != undefined) shopex.anon = anon == "on";
    
    if (req.param('otd_rating') != undefined) shopex.otd_rating = parseInt(req.param('otd_rating'));
    if (req.param('pad_rating') != undefined) shopex.pad_rating = parseInt(req.param('pad_rating'));
    if (req.param('pri_rating') != undefined) shopex.pri_rating = parseInt(req.param('pri_rating'));
    if (req.param('pro_rating') != undefined) shopex.pro_rating = parseInt(req.param('pro_rating'));
    if (req.param('eos_rating') != undefined) shopex.eos_rating = parseInt(req.param('eos_rating'));
    if (req.param('csu_rating') != undefined) shopex.csu_rating = parseInt(req.param('csu_rating'));
    if (req.param('rrp_rating') != undefined) shopex.rrp_rating = parseInt(req.param('rrp_rating'));
    if (req.param('all_rating') != undefined) shopex.all_rating = req.param('all_rating');

    // otd_rating:   parseInt(req.param('otd_rating')),
    // pad_rating:   parseInt(req.param('pad_rating')),
    // pri_rating:   parseInt(req.param('pri_rating')),
    // pro_rating:   parseInt(req.param('pro_rating')),
    // eos_rating:   parseInt(req.param('eos_rating')),
    // rrp_rating:   parseInt(req.param('rrp_rating')),
    // csu_rating:   parseInt(req.param('csu_rating')),
    // all_rating:   req.param('all_rating'),

    if (req.param('otd_comment') != undefined) shopex.otd_comment = req.param('otd_comment');
    if (req.param('pad_comment') != undefined) shopex.pad_comment = req.param('pad_comment');
    if (req.param('pri_comment') != undefined) shopex.pri_comment = req.param('pri_comment');
    if (req.param('pro_comment') != undefined) shopex.pro_comment = req.param('pro_comment');
    if (req.param('eos_comment') != undefined) shopex.eos_comment = req.param('eos_comment');
    if (req.param('csu_comment') != undefined) shopex.csu_comment = req.param('csu_comment');
    if (req.param('rrp_comment') != undefined) shopex.rrp_comment = req.param('rrp_comment');

    // otd_comment:  req.param('otd_comment'),
    // pad_comment:  req.param('pad_comment'),
    // pri_comment:  req.param('pri_comment'),
    // pro_comment:  req.param('pro_comment'),
    // eos_comment:  req.param('eos_comment'),
    // csu_comment:  req.param('csu_comment'),
    // rrp_comment:  req.param('rrp_comment'),

    return shopex;
  }

  app.post('/shopping-experience/:pub_id', function(req, res) {
    console.log("inside /shopping-experience/:pub_id");
    var accountId = req.session.accountId;
    var shopexPubId = req.params.pub_id;

    console.log("shopexPubId: ", shopexPubId);
    // #TODO implement this function: getShopexObj()
    
    var shopexObj = getShopexObj(req, req.param.anonymous);
    // shopexObj._author = req.session.accountId;

    // #TODO implement this function: editPermission()
    // editPermission(accountId, "shopex", shopexPubId, function(err, permission){

    app.models.Shopex.getAuthorId(shopexPubId, function(err, authorId){
      if (err || !authorId || authorId != accountId) {
        console.log("Permission Denied To Edit")
        res.send(400);
        return;
      } else {
        console.log("Permission Accessed To Edit")
        app.models.Shopex.updatePost(shopexPubId, shopexObj, "edit_summary", function(err, updated_shopex){
          console.log("inside callback of updatePost()")
          if (err || !updated_shopex){
            console.log(err);
            res.send(500);
            return;
          }
          console.log("Shopex Updated:", updated_shopex.pub_id);
          res.send(200);
        });
        console.log("After calling updatePost")

        // send OK right away, dont need to wait for actual db save to return.
        // res.send(200);
      }
    });
  });

  app.post('/shopping-experience', function(req, res) {
    // var accountId = req.params.id == 'me'
    //                    ? req.session.accountId
    //                    : req.params.id;
    var accountId = req.session.accountId;
    console.log("=====Account ID======>   "+accountId)
    var anon = req.param('anonymous');

    if (accountId == undefined || accountId == null) {
      accountId = null;
      var anon = "on";
    }

    shopex = getShopexObj(req, anon);
    shopex._author = req.session.accountId;

    console.log(JSON.stringify(shopex));

    app.models.Shopex.createPost(shopex, function(err, saved_shopex){
      // got the shopex object, redirect the user to the shopex.pub_id based url for the post, available now 
    })

    res.send(200);
  });

} // end module.exports