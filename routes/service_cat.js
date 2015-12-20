module.exports = function(app){

  app.get('/sercat/shopex_count/:limit?/:skip?', function(req, res){
    console.log("inside /sercat/shopex_count/:limit?/:skip?")

    limit = req.params.limit == undefined ? 10 : req.params.limit ;
    skip = req.params.skip == undefined ? 0 : req.params.skip;
    console.log("limit:", limit);
    console.log("skip:", skip);

    // app.models.ServiceCat.getServiceCatsByShopexCountSkipLimit(skip, limit, function(err, sercat_docs){
    app.models.ServiceCat.getByShopexCountSkipLimit(skip, limit, function(err, sercat_docs){
      if (err || !sercat_docs) {
        console.log("$$$ Sending 404 $$$")
        res.send(404);
      } else {
        console.log("$$$ Sending sellers $$$")
        res.send(sercat_docs);
      }
    });
  });

  app.get('/service-category/po/:id', function(req, res){
    // console.log("inside /sercat/po/:id")

    sercatId = req.params.id

    // console.log("sercatId:", sercatId);
    if (!sercatId || isNaN(sercatId)){
      res.send(404);
      return;
    }

    // app.models.Seller.getSerCatPopoverInfo(sercatId, function(err, seller_doc){
    app.models.ServiceCat.findById(sercatId, function(err, ser_cat_doc){
      if (err || !ser_cat_doc) {
        res.send(404);
        return;
      } else {
        // res.render('zs_ser_cat_popover_new', ser_cat_doc);
        res.render('zs_ser_cat_popover_new', {ser_cat_data: ser_cat_doc});
      }
    });
  });

  app.get('/service-category/:id/:url_name/:sub(json|info|shopping-experiences?|questions?|answers?)?', function(req, res){
    console.log("inside /service-category/:id/:url_name")
    // "/service-category/2/taxi-service/"

    sercatId = req.params.id;
    sercatUrlName = req.params.url_name;
    sercatSub = req.params.sub ? req.params.sub : "info";

    // console.log("sercatId:", sercatId);
    if (!sercatId || isNaN(sercatId)){
      res.send(404);
      return;
    }

    var page_link = req.host;

    app.models.ServiceCat.findById(sercatId, function(err, ser_cat_doc){
      if (err || !ser_cat_doc) {
        res.status(404).render("zs_404_page_not_found.ejs");
        return;
      } else if (ser_cat_doc.url_name && (sercatUrlName != ser_cat_doc.url_name)) {

        plink = ser_cat_doc.permalink ? ser_cat_doc.permalink : "/service-category/"+ser_cat_doc._id+"/"+ser_cat_doc.url_name;
        
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

        single_cat_page_data.cat_data = ser_cat_doc;
        page_link += ser_cat_doc.permalink ? ser_cat_doc.permalink : "/service-category/"+ser_cat_doc._id+"/"+ser_cat_doc.url_name;

        if (sercatSub == "json") {
          res.json({
            single_cat_page_data: single_cat_page_data,
            page_info : {
              page_title: single_cat_page_data.cat_data.name,
              page_link: page_link,
              post_type: "Service Category"      
            },
          });
        } else {        
          res.render('zs_single_cat_info_page', {single_cat_page_data: single_cat_page_data,
            page_info : {
              page_title: single_cat_page_data.cat_data.name,
              page_link: page_link,
              post_type: "Service Category"      
            },
          });
        }
      }
    });
  });

} // end module.exports