module.exports = function(app){

  var querySort = function() {
    re = arguments[0];
    all = arguments[1];
    for(var i = 2; i < arguments.length; ++i) {
      all = all.concat(arguments[i])
    }
    
    res = [];
  
    for(var i = 0; i < all.length; ++i) {
      qidx = all[i].name.match(re).index;
      a = {};
      a = JSON.parse(JSON.stringify(all[i]));
      a.qidx = qidx;
      
      res.push(a);
    }

    function compare(a,b) {
      if (a.qidx < b.qidx)
         return -1;
      if (a.qidx > b.qidx)
        return 1;
      // if (a.qidx == b.qidx) {
      //   if (a.meta_info.followers.length > b.meta_info.followers.length)
      //    return -1;
      //   if (a.meta_info.followers.length < b.meta_info.followers.length)
      //     return 1;
      //   return 0;
      // }
      return 0;
    }
    res.sort(compare);

    // console.log(res);
    return res;
  }

  var skipLimit = function(arr, skip, limit) {
    return arr.slice(skip, skip+limit);
  }

  var add_input_query = function(final_res, input_query) {
    final_res.total += 1;
    input_query_obj = {
      node_type: "_new_node",
      name: input_query,
      url_name: input_query.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]/,""),
      _id: -1,
      aliases: [],
      sample_product_images: [],
      sample_product_url: [],
      qidx: 0
    }

    final_res.results = [input_query_obj].concat(final_res.results);
    return final_res;
  }

  app.get('/tags', function(req, res){
    // console.log("/tags/:query");
    // console.log(req.params.query);
    // console.log(req.url);
    // res.send("Got: "+req.params.query);

    var querystring = require('querystring');
    query_string = req.url.substr(req.url.indexOf("?")+1);
    var querystring_parts = querystring.parse(query_string);
    // console.log(querystring_parts);
    
    //#TODO sanitize this query #IMPORTANT #URGENT
    var input_query = querystring_parts["q"];
    var q_re = new RegExp(input_query,"i");

    limit = querystring_parts["page_limit"] ? querystring_parts["page_limit"] : 0;
    skip = querystring_parts["page"] ? (querystring_parts["page"] - 1)* limit : 0;
    
    // console.log(querystring_parts["type"]);
    if(querystring_parts["type"] != undefined && querystring_parts["type"] != "all"){

      if (querystring_parts["type"] == "seller") {
        // console.log("Searching in Sellers...for:", querystring_parts["q"]);

        // app.models.Seller.findByRegex("name", q_re, function(err, seller_docs){
        app.models.Seller.findByRegex1("name", q_re, 
          { 
            site_domain : 1, 
            name: 1, 
            url_name: 1,
            node_type: 1,
            img_icon_url: 1,
            aliases : 1, 
            _followers: 1,
            // _pro_cat: { $slice: 2 },
            // _pro: { $slice: 2 },
            // _ser_cat: { $slice: 2 },
            // _ser: { $slice: 2 },
          }, function(err, seller_docs){
          if (err || !seller_docs) {
            // console.log("Nothing found for:", querystring_parts["q"])
            // res.send(404);
            res.jsonp([]);
          } else {

            for(var i = 0; i < seller_docs.length; ++i){
              seller_docs[i].node_type = "_seller"
            }

            // console.log(seller_docs);
            
            // stuff = querySort(q_re, seller_docs, pro_cat_docs, ser_car_docs);
            stuff = querySort(q_re, seller_docs);
            // console.log("skip:", skip, "limit:", limit);

            final_res = {results: skipLimit(stuff, skip, limit), total: stuff.length}
            // res.jsonp(add_input_query(final_res, input_query));
            res.jsonp(final_res);
          }
        });

      } else if (querystring_parts["type"] == "product_cat") {
        // console.log("Searching in Product Categories...");

        app.models.ProductCat.findByRegex1("name", q_re, 
          { 
            name: 1, 
            url_name: 1,
            node_type: 1,
            img_icon_url: 1,
            aliases : 1, 
            _followers: 1,
            sample_product_images: 1,
            sample_product_url: 1,
            // _related_ser: { $slice: 2 },
            // _related_ser_cat: { $slice: 2 },
            // _direct_pro: { $slice: 2 },
            // _parent_pro_cat: { $slice: 2 },
            // _child_pro_cat: { $slice: 2 },
            // _seller: { $slice: 2 },
          }, function(err, docs){
          if (err || !docs) {
            // console.log("Nothing found for:", querystring_parts["q"])
            // res.send(404);
            res.jsonp([]);
          } else {
            for(var i = 0; i < docs.length; ++i){
              docs[i].node_type = "_pro_cat"
            }
            
            // stuff = querySort(q_re, seller_docs, pro_cat_docs, ser_car_docs);
            stuff = querySort(q_re, docs);
            // console.log("skip:", skip, "limit:", limit);

            final_res = {results: skipLimit(stuff, skip, limit), total: stuff.length}
            // res.jsonp(add_input_query(final_res, input_query));
            res.jsonp(final_res);
          }
        });

      } else if (querystring_parts["type"] == "service_cat") {
        // console.log("Searching in Service Categories...");

        app.models.ServiceCat.findByRegex1("name", q_re, 
          { 
            name: 1, 
            url_name: 1,
            node_type: 1,
            img_icon_url: 1,  
            aliases : 1, 
            _followers: 1,
            sample_service_images: 1,
            sample_service_url: 1,
            // _related_ser: { $slice: 2 },
            // _related_ser_cat: { $slice: 2 },
            // _direct_pro: { $slice: 2 },
            // _parent_pro_cat: { $slice: 2 },
            // _child_pro_cat: { $slice: 2 },
            // _seller: { $slice: 2 },
          }, function(err, docs){
          if (err || !docs) {
            // console.log("Nothing found for:", querystring_parts["q"])
            // res.send(404);
            res.jsonp([]);
          } else {
            for(var i = 0; i < docs.length; ++i){
              docs[i].node_type = "_ser_cat"
            }
            
            // stuff = querySort(q_re, seller_docs, pro_cat_docs, ser_car_docs);
            stuff = querySort(q_re, docs);
            // console.log("skip:", skip, "limit:", limit);

            final_res = {results: skipLimit(stuff, skip, limit), total: stuff.length}
            // res.jsonp(add_input_query(final_res, input_query));
            res.jsonp(final_res);
          }
        });

      } else if (querystring_parts["type"] == "category") {
        // console.log("Searching in Product Categories and Service Categories...");

        app.models.ProductCat.findByRegex1("name", q_re, 
          { 
            name: 1, 
            url_name: 1,
            node_type: 1,
            img_icon_url: 1,  
            aliases : 1, 
            _followers: 1,
            sample_product_images: 1,
            sample_product_url: 1,
            // _related_ser: { $slice: 2 },
            // _related_ser_cat: { $slice: 2 },
            // _direct_pro: { $slice: 2 },
            // _parent_pro_cat: { $slice: 2 },
            // _child_pro_cat: { $slice: 2 },
            // _seller: { $slice: 2 },
          }, function(err, procat_docs){

            app.models.ServiceCat.findByRegex1("name", q_re, 
            { 
              name: 1, 
              url_name: 1,
              node_type: 1,
              img_icon_url: 1,  
              aliases : 1, 
              _followers: 1,
              sample_service_images: 1,
              sample_service_url: 1,
              // _related_ser: { $slice: 2 },
              // _related_ser_cat: { $slice: 2 },
              // _direct_pro: { $slice: 2 },
              // _parent_pro_cat: { $slice: 2 },
              // _child_pro_cat: { $slice: 2 },
              // _seller: { $slice: 2 },
            }, function(err, sercat_docs){
              if (!procat_docs && !sercat_docs) {
                // console.log("Nothing found for:", querystring_parts["q"])
                // res.send(404);
                res.jsonp([]);
              } else {
                
                for(var i = 0; i < procat_docs.length; ++i){
                  procat_docs[i].node_type = "_pro_cat"
                }
                for(var i = 0; i < sercat_docs.length; ++i){
                  sercat_docs[i].node_type = "_ser_cat"
                }

                if (!procat_docs)
                  procat_docs = [];
                if (!sercat_docs)
                  sercat_docs = [];

                // stuff = querySort(q_re, seller_docs, pro_cat_docs, ser_car_docs);
                stuff = querySort(q_re, procat_docs, sercat_docs);
                // console.log("skip:", skip, "limit:", limit);

                final_res = {results: skipLimit(stuff, skip, limit), total: stuff.length}
                // res.jsonp(add_input_query(final_res, input_query));
                res.jsonp(final_res);
              }
            });

        });

      } else {
        // console.log("type is something unexpected");
        res.jsonp([]);
      }
    } else {
      console.log("Searching in all stuff...");

      app.models.ProductCat.findByRegex1("name", q_re, 
        { 
          name: 1, 
          url_name: 1,
          node_type: 1,
          img_icon_url: 1,  
          aliases : 1, 
          _followers: 1,
          sample_product_images: 1,
          sample_product_url: 1,
          // _related_ser: { $slice: 2 },
          // _related_ser_cat: { $slice: 2 },
          // _direct_pro: { $slice: 2 },
          // _parent_pro_cat: { $slice: 2 },
          // _child_pro_cat: { $slice: 2 },
          // _seller: { $slice: 2 },
        }, function(err, procat_docs){
          app.models.ServiceCat.findByRegex1("name", q_re, 
          { 
            name: 1, 
            url_name: 1,
            node_type: 1,
            img_icon_url: 1,  
            aliases : 1, 
            _followers: 1,
            sample_service_images: 1,
            sample_service_url: 1,
            // _related_ser: { $slice: 2 },
            // _related_ser_cat: { $slice: 2 },
            // _direct_pro: { $slice: 2 },
            // _parent_pro_cat: { $slice: 2 },
            // _child_pro_cat: { $slice: 2 },
            // _seller: { $slice: 2 },
          }, function(err, sercat_docs){

            app.models.Seller.findByRegex1("name", q_re, 
            { 
              site_domain : 1, 
              name: 1, 
              url_name: 1,
              node_type: 1,
              img_icon_url: 1, 
              aliases : 1, 
              _followers: 1,
              // _pro_cat: { $slice: 2 },
              // _pro: { $slice: 2 },
              // _ser_cat: { $slice: 2 },
              // _ser: { $slice: 2 },
            }, function(err, seller_docs){
              if (!procat_docs && !sercat_docs && !seller_docs) {
                // console.log("Nothing found for:", querystring_parts["q"])
                // res.send(404);
                res.jsonp([]);
              } else {

                for(var i = 0; i < procat_docs.length; ++i){
                  procat_docs[i].node_type = "_pro_cat"
                }
                for(var i = 0; i < sercat_docs.length; ++i){
                  sercat_docs[i].node_type = "_ser_cat"
                }
                for(var i = 0; i < seller_docs.length; ++i){
                  seller_docs[i].node_type = "_seller"
                }

                if (!procat_docs)
                  procat_docs = [];
                if (!sercat_docs)
                  sercat_docs = [];
                if (!seller_docs)
                  seller_docs = [];

                
                // stuff = querySort(q_re, seller_docs, pro_cat_docs, ser_car_docs);
                stuff = querySort(q_re, procat_docs, sercat_docs, seller_docs);
                // console.log("skip:", skip, "limit:", limit);

                final_res = {results: skipLimit(stuff, skip, limit), total: stuff.length}
                // res.jsonp(add_input_query(final_res, input_query));
                res.jsonp(final_res);
              }
            });
          });
        });
    }

  });

} // end module.exports