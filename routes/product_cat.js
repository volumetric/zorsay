module.exports = function(app){

  app.get('/procat/shopex_count/:limit?/:skip?', function(req, res){
    console.log("inside /procat/shopex_count/:limit?/:skip?")

    limit = req.params.limit == undefined ? 10 : req.params.limit ;
    skip = req.params.skip == undefined ? 0 : req.params.skip;
    console.log("limit:", limit);
    console.log("skip:", skip);

    // app.models.ProductCat.getProductCatsByShopexCountSkipLimit(skip, limit, function(err, procat_docs){
    app.models.ProductCat.getByShopexCountSkipLimit(skip, limit, function(err, procat_docs){
      if (err || !procat_docs) {
        console.log("$$$ Sending 404 $$$")
        res.send(404);
      } else {
        console.log("$$$ Sending sellers $$$")
        res.send(procat_docs);
      }
    });
  });

  app.get('/product-category/po/:id', function(req, res){
    // console.log("inside /procat/po/:id")

    procatId = req.params.id

    // console.log("procatId:", procatId);
    if (!procatId || isNaN(procatId)){
      res.send(404);
      return;
    }

    app.models.ProductCat.findById(procatId, function(err, pro_cat_doc){
      if (err || !pro_cat_doc) {
        res.send(404);
        return;
      } else {
        // res.render('zs_pro_cat_popover_new', pro_cat_doc);
        res.render('zs_pro_cat_popover_new', {pro_cat_data: pro_cat_doc});
      }
    });
  });


  // '/product-category/:id/:url_name/:sub(shopping-experiences?|questions?|answers?)?'
  app.get('/product-category/:id/:url_name/:sub(json|info|shopping-experiences?|questions?|answers?)?', function(req, res){
    console.log("inside /product-category/:id/:url_name")
    // "/product-category/54/Mens-Fashion/"

    procatId = req.params.id;
    procatUrlName = req.params.url_name;
    procatSub = req.params.sub ? req.params.sub : "info";

    // console.log("procatId:", procatId);
    if (!procatId || isNaN(procatId)){
      res.send(404);
      return;
    }

    var page_link = req.host;

    app.models.ProductCat.findById(procatId, function(err, pro_cat_doc){
      if (err || !pro_cat_doc) {
        res.status(404).render("zs_404_page_not_found.ejs");
        return;
      } else if (pro_cat_doc.url_name && (procatUrlName != pro_cat_doc.url_name)) {

        plink = pro_cat_doc.permalink ? pro_cat_doc.permalink : "/product-category/"+pro_cat_doc._id+"/"+pro_cat_doc.url_name;
        
        console.log("301 redirect from: "+req.url+" to: "+plink)
        res.redirect(301, plink);
        return;
      } else {
        var single_cat_page_data = {}
        single_cat_page_data.loggedIn = req.session.loggedIn;
        single_cat_page_data.navbar_data = {}
        if (req.session.loggedIn){
          single_cat_page_data.navbar_data = { user_info: req.session.user_info };
        }

        single_cat_page_data.cat_data = pro_cat_doc;
        page_link += pro_cat_doc.permalink ? pro_cat_doc.permalink : "/product-category/"+pro_cat_doc._id+"/"+pro_cat_doc.url_name;
        
        if (procatSub == "json") {
          res.json({
            single_cat_page_data: single_cat_page_data,
            page_info : {
              page_title: single_cat_page_data.cat_data.name,
              page_link: page_link,
              post_type: "Product Category"      
            },
          });
        } else {
          res.render('zs_single_cat_info_page', {single_cat_page_data: single_cat_page_data,
            page_info : {
              page_title: single_cat_page_data.cat_data.name,
              page_link: page_link,
              post_type: "Product Category"      
            },
          });
        }
        

      }
    });
  });

} // end module.exports