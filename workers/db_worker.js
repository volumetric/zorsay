//var dbPath      = 'mongodb://localhost/nodebackbone1';
//var dbPath      = 'mongodb://vinit:wordpass@linus.mongohq.com:10004/nodebackbone1';
//var dbPath      = 'mongodb://vinit:wordpass@linus.mongohq.com:10004/nodebackbone2';

// var dbPath = process.env.MONGOHQ_URL || 'mongodb://localhost/nodebackbone4';
// var dbPath = process.env.MONGOHQ_URL || 'mongodb://vinit:wordpass@oceanic.mongohq.com:10010/nodebackbone3';
var dbPath = process.env.MONGOHQ_URL || 'mongodb://vinit:wordpass@oceanic.mongohq.com:10038/bender001';

var onlineSellersList = "sellers_list.txt";
var productCategoryList = "product_category_list.txt";
var serviceCategoryList = "service_category_list.txt";

// Import the data layer
var mongoose = require('mongoose');
var fs = require('fs');
var config = {
  mail: require('../config/mail')
};

console.log("Zorsay DB Worker Started.");

console.log('Trying to connect to mongo at: '+dbPath);

mongoose.connect(dbPath, function onMongooseError(err) {
  console.log('inside mongoose connect callback');
  if (err)  {
    console.log('err found in connecting to mongo');
    console.log(err);
    throw err;
  }
  console.log('all good while connecting to mongo');

  // Import the models
  models = {};

  models.PublicCounter = require('../models/PublicCounter')(config, mongoose);

  // models.Account = require('./models/Account')(config, mongoose, nodemailer),
  // models.Shopex = require('../models/Shopex')(config, mongoose, PublicCounter),
  // models.Question = require('../models/Shopex')(config, mongoose, PublicCounter),
  // models.Answer = require('../models/Shopex')(config, mongoose, PublicCounter),

  models.Seller = require('../models/Seller_new')(config, mongoose, models),
  models.ProductCat = require('../models/ProductCat_new')(config, mongoose, models),
  models.ServiceCat = require('../models/ServiceCat_new')(config, mongoose, models),
  

  fs.readFile(onlineSellersList, "utf-8", function(err, data){
    if (err)
      throw err;
    // console.log(data);
    sellers = data.split("\n");
    console.log(sellers.length);

    for(var i = 0; i < sellers.length; ++i) {
      seller_name = sellers[i].trim();
      if (seller_name) {
        seller_domain = seller_name.toLowerCase();
        seller_url_name = seller_domain;

        models.Seller.createNode({ 
          site_domain: seller_domain,
          name: seller_name,
          url_name: seller_url_name,
        }, function(err, saved_seller){
          console.log("createNode callback for sellers");
          if (err)
            console.log(err);
          // console.log(JSON.stringify(saved_seller));
        });
      }
    }
  }) // sellers list inserted

  fs.readFile(productCategoryList, "utf-8", function(err, data){
    if (err)
      throw err;
    // console.log(data);
    pro_cats = data.split("\n");
    console.log(pro_cats.length);

    for(var i = 0; i < pro_cats.length; ++i) {
      pro_cat_name = pro_cats[i].trim();
      if (pro_cat_name) {
        pro_cat_url_name = pro_cat_name.replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]+/g,"");

        models.ProductCat.createNode({ 
          name: pro_cat_name,
          url_name: pro_cat_url_name,
        }, function(err, saved_pro_cat){
          console.log("createNode callback for pro_cats");
          if (err)
            console.log(err.message);
          // console.log(JSON.stringify(saved_pro_cat));
        });
      }
    }
  }) // Product Category list inserted

  fs.readFile(serviceCategoryList, "utf-8", function(err, data){
    if (err)
      throw err;
    // console.log(data);
    ser_cats = data.split("\n");
    console.log(ser_cats.length);

    for(var i = 0; i < ser_cats.length; ++i) {
      ser_cat_name = ser_cats[i].trim();
      if (ser_cat_name) {
        ser_cat_url_name = ser_cat_name.replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]+/g,"");

        models.ServiceCat.createNode({ 
          name: ser_cat_name,
          url_name: ser_cat_url_name,
        }, function(err, saved_ser_cat){
          console.log("createNode callback for ser_cats");
          if (err)
            console.log(err.message);
          // console.log(JSON.stringify(saved_ser_cat));
        });
      }
    }
  }) // Service Category list inserted

});
