module.exports = function(app){

  app.get('/seller/shopex_count/:limit?/:skip?', function(req, res){
    console.log("inside /seller/shopex_count/:limit?/:skip?")

    limit = req.params.limit == undefined ? 10 : req.params.limit ;
    skip = req.params.skip == undefined ? 0 : req.params.skip;
    console.log("limit:", limit);
    console.log("skip:", skip);

    

    app.models.Seller.getByShopexCountSkipLimit(skip, limit, function(err, seller_docs){
      if (err || !seller_docs) {
        console.log("$$$ Sending 404 $$$")
        res.send(404);
      } else {
        console.log("$$$ Sending sellers $$$")
        res.send(seller_docs);
      }
    });
  });

  app.get('/seller/po/:id', function(req, res){
    // console.log("inside /seller/po/:id")

    sellerId = req.params.id

    // console.log("sellerId:", sellerId);
    if (!sellerId || isNaN(sellerId)){
      res.send(404);
      return;
    }

    // app.models.Seller.getSellerPopoverInfo(sellerId, function(err, seller_doc){
    app.models.Seller.findById(sellerId, function(err, seller_doc){
      if (err || !seller_doc) {
        res.send(404);
        return;
      } else {
        // res.render('zs_seller_popover', seller_doc);
        res.render('zs_seller_popover_new', {seller_data: seller_doc});
      }
    });
  });

    // '/seller/:id/:url_name/:sub(shopping-experiences?|questions?|answers?)?'
  app.get('/seller/:id/:url_name/:sub(json|info|shopping-experiences?|questions?|answers?)?', function(req, res){
    console.log("inside /seller/:id/:url_name/:sub(json|info)?")
    // "/seller/54/Flipkart.com/"

    sellerId = req.params.id;
    sellerUrlName = req.params.url_name;
    sellerSub = req.params.sub ? req.params.sub : "info";

    // console.log("sellerId:", sellerId);
    if (!sellerId || isNaN(sellerId)){
      res.send(404);
      return;
    }

    var page_link = req.host;

    app.models.Seller.findById(sellerId, function(err, seller_doc){
      if (err || !seller_doc) {
        res.status(404).render("zs_404_page_not_found.ejs");
        return;
      } else if (seller_doc.url_name && (sellerUrlName != seller_doc.url_name)) {

        plink = seller_doc.permalink ? seller_doc.permalink : "/seller/"+seller_doc._id+"/"+seller_doc.url_name;
        
        console.log("301 redirect from: "+req.url+" to: "+plink)
        res.redirect(301, plink);
        return;
      } else {
        var single_seller_page_data = {}
        single_seller_page_data.loggedIn = req.session.loggedIn;
        single_seller_page_data.navbar_data = {}
        if (req.session.loggedIn){
          single_seller_page_data.navbar_data = { user_info: req.session.user_info };
        }

        single_seller_page_data.seller_data = seller_doc;
        page_link += seller_doc.permalink ? seller_doc.permalink : "/seller/"+seller_doc._id+"/"+seller_doc.url_name;
        
        if (sellerSub == "json") {
          res.json({
            single_seller_page_data: single_seller_page_data,
            page_info : {
              page_title: single_seller_page_data.seller_data.name,
              page_link: page_link,
              post_type: "Seller"      
            },
          });
        } else {
          res.render('zs_single_seller_info_page', {single_seller_page_data: single_seller_page_data,
            page_info : {
              page_title: single_seller_page_data.seller_data.name,
              page_link: page_link,
              post_type: "Seller"      
            },
          });
        }
        
      }
    });
  });

  // var getSellerObj = function(req, edit) {
  //   var seller = {};

  //   console.log(req.param('site_domain'))

  //   if (!edit && !req.param('site_domain')) { 
  //     // if the seller is being added without a name
  //     return false;
  //   }

  //   if (req.param('site_domain')) {
  //       seller.site_domain = req.param('site_domain');
  //   }

  //   if (req.param('name')) {
  //       seller.name = req.param('name');
  //   } else {
  //       seller.name = req.param('site_domain');
  //   }

  //   return seller;
  // }

  // app.post('/seller', function(req, res) {

  //   if (!req.session.loggedIn) {
  //     res.status(401).render("zs_401_question_post.ejs");
  //     return;
  //   }

  //   if (!app.AccessControl.isStaff(req.session.user_info)){
  //     res.status(403).render("zs_403_forbidden.ejs");
  //     return; 
  //   }

  //   seller = getSellerObj(req);
  //   if (!seller){
  //     res.status(412).render("zs_412_invalid.ejs");
  //     return;
  //   }

  //   seller._author = req.session.user_info._id;
  //   console.log(seller);

  //   app.models.Seller.createNode(seller, function(err, saved_seller){
  //     if(err || !saved_seller){
  //       console.log(err);
  //       res.status(412).render("zs_412_invalid.ejs");
  //     } else {
  //       // seller is saved

  //       // if (saved_question.permalink)
  //       //   res.redirect(saved_question.permalink);
  //       res.json(saved_seller);
  //       // res.json(saved_question.permalink);
  //       // res.send(200);
  //     }
  //   })
  //   // res.send(200);
  // });

} // end module.exports