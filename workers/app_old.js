var express     = require("express");
var app         = express();
var nodemailer  = require('nodemailer');
// var cons        = require('consolidate');
var MemoryStore = require('connect').session.MemoryStore;
var ejs         = require("ejs");
var fs          = require("fs");
//var dbPath      = 'mongodb://localhost/nodebackbone1';
//var dbPath      = 'mongodb://vinit:wordpass@linus.mongohq.com:10004/nodebackbone1';
//var dbPath      = 'mongodb://vinit:wordpass@linus.mongohq.com:10004/nodebackbone2';
var dbPath = process.env.MONGOHQ_URL || 'mongodb://localhost/nodebackbone3_shopex';

// Import the data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import the models
var models                = {};

// var byName = function(name) {
//   for (i in models){
//     if (typeof(models[i]) === 'object' && models[i].Model){
//       if (name === models[i].Model.modelName){
//         return models[i];
//       }
//     }
//   }
// }

// models.byName = byName;

models.PublicCounter      = require('./models/PublicCounter')(config, mongoose);

// models.Seller             = require('./models/Seller')(config, mongoose, models);
models.Seller             = require('./models/Seller_new')(config, mongoose, models);
// models.ProductCat         = require('./models/ProductCat')(config, mongoose, models);
models.ProductCat         = require('./models/ProductCat_new')(config, mongoose, models);

models.Account            = require('./models/Account')(config, mongoose, nodemailer);
// models.Account            = require('./models/Account_new')(config, mongoose, nodemailer);
models.LaunchListAccount  = require('./models/LaunchListAccount')(config, mongoose);
models.PublicReviews      = require('./models/PublicReviews')(config, mongoose);

// models.Shopex             = require('./models/Shopex')(config, mongoose, models);
models.Shopex             = require('./models/Shopex_new')(config, mongoose, models);
// models.Comment            = require('./models/Comment')(config, mongoose, models)
models.Comment            = require('./models/Comment_new')(config, mongoose, models) 


// console.log(models);

app.configure(function(){
  // app.engine('html', cons.underscore);
  app.set('view engine', 'ejs');
  app.use(express.static(__dirname + '/public'));
  app.use(express.limit('1mb'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({
    secret: "SocialNet secret key",
    store: new MemoryStore()
  }));
  
  console.log('trying to connect to mongo at: '+dbPath);
  mongoose.connect(dbPath, function onMongooseError(err) {
    console.log('inside mongoose connect callback');
    if (err)  {
      console.log('err found in connecting to mongo');
      console.log(err);
      throw err;
    }
    console.log('all good while connecting to mongo');
  });
});

// app.locals.rendered_include = function(template_filename, param_data){
rendered_include = function(template_filename, param_data){
  template_str = fs.readFileSync(template_filename, 'utf-8');
  return ejs.render(template_str, param_data);
  // res = ejs.render(template_str, param_data);
  // console.log(res);
  // return res;
  // return ejs.render(template_filename, param_data);
}

compiled_include = function(template_filename){
  template_str = fs.readFileSync(template_filename, 'utf-8');
  return ejs.compile(template_str);
}

hasValue = function(param){
  if (typeof(param) !== 'undefined' && param !== undefined && param !== null)
    return true;
  return false;
}

// will return false if the data in invalid, true otherwise
// checkData(navbar_data, 'navbar_data.user_info.name.first')
checkData =function(data_obj, property_path) {
  props = property_path.split('.');
  curr_data_obj = data_obj;
  if (!hasValue(curr_data_obj))
    return false;

  for (var i = 1; i < props.length; ++i) {
    if (!hasValue(curr_data_obj[props[i]]))
      return false;
    curr_data_obj = curr_data_obj[props[i]] 
  }
  return true;
}



app.get('/template_test', function(req, res){
  res.render('template_test');
});

app.get('/', function(req, res){
  // console.log("getting / ...")
  res.render('index');
  // console.log("DONE getting / ...")
});


function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
} 

// submiting email is the on landing page to get notification of the launch
app.post('/landing', function (req, res) {
  console.log('email posted');
  var email = req.param('email', null);
  
  var ip = req.headers['X-Forwarded-For']; // gives the correct result if proxy is used.
  if (!ip)
    var ip = req.connection.remoteAddress;  // if 'X-Forwarded-For' request header is not there.

  if (null == email || email.length < 1 || validateEmail(email) == false) {
    res.send(400);
    return;
  }

  models.LaunchListAccount.launchListAccountSubmit(email, ip, function(err){
    if (err){
      // console.log("Something is not right " + err);
      if (err.code){
        res.send(err.code);
      }
      else{
        // #TODO plun in a notification system to ping developers about the problem. 
        res.send(500);
      }
    } else {
      console.log('Email is registered for Launch List.');
      res.send(200);
    }
  });

});

app.post('/login', function(req, res) {
  console.log('login request');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1
      || null == password || password.length < 1 ) {
    res.send(400);
    return;
  }
  console.log("trying to login");
  models.Account.login(email, password, function(account) {
    console.log("in login callback");
    if ( !account ) {
      console.log("account not found");
      res.send(401);
      return;
    }
    console.log('login was successful');
    req.session.loggedIn = true;
    req.session.accountId = account._id;
    user_info = {email: account.email, photoUrl: account.photoUrl, name: {first: account.name.first, last: account.name.last}, pub_id: 13731};
    req.session.user_info = user_info;

    res.send({user_info: user_info});
  });
});

app.post('/logout', function(req, res) {
  console.log('logout request');

  req.session.accountId = null;
  req.session.loggedIn = false;
  res.send(200);
});

app.post('/register', function(req, res) {
  console.log('register request');
  var firstName = req.param('firstName', '');
  var lastName = req.param('lastName', '');
  var email = req.param('email', null);
  var password = req.param('password', null);

  if ( null == email || email.length < 1
       || null == password || password.length < 1 ) {
    res.send(400);
    return;
  }

  var hostname = req.headers.host;
  var verificationUrl = 'http://' + hostname + '/verify';
  console.log('trying to register');

  models.Account.register(email, password, firstName, lastName, verificationUrl, function(err){
    console.log('in register callback');

    if (err){
      console.log('err during register');
      // console.log("Something is not right " + err);
      if (err.code){
	console.log(err.code);
        res.send(err.code);
      }else{
   	console.log(500);
        res.send(500);
      }
    } else {
      console.log('Account was created');
      res.send(200);
    }
  });
  
});

app.get('/account/authenticated', function(req, res) {
  if ( req.session.loggedIn ) {
    res.send(200);
  } else {
    res.send(401);
  }
});

function timestamp_comparator(a, b) {

}

app.get('/accounts/me/reviews', function(req, res) {
  // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
  var accountId = req.session.accountId;

  models.Account.findById(accountId, function(account) {
    if (!account) {
      res.send(400);
    } else {
      res.send(account.reviews);
      // if (req.params.id == 'me') {
      //   // var all_reviews = account.reviews.concat(account.anonReviews);
      //   var all_reviews = account.reviews;

      //   var all_sorted_reviews = all_reviews;
      //   // var all_sorted_reviews = all_reviews.sort(timestamp_comparator);
        
      //   res.send(all_sorted_reviews) // if id is "me" show all the reviews, public and anonymous
      // } else {
      //   res.send(account.reviews); // show only public reviews of the user
      // }
    }
  });
});

app.get('/reviews/:id', function(req, res) {

  console.log(req.params.id);
  // res.send(200);
  // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
  var reviewId = req.params.id;

  models.PublicReviews.findById(reviewId, function(publicReview) {
    if (!publicReview) {
      // console.log("not in PublicReviews");
      res.send(404);
    } else {
      // console.log("found in PublicReviews...");
      models.Account.findById(publicReview.accountId, function(account) {
        // console.log("Got accountId...");
        console.log(account.reviews.length);
        for (var i = 0; i < account.reviews.length; ++i){
          // console.log(account.reviews[i]._id);
          // console.log(reviewId);
          if (account.reviews[i]._id == reviewId){
            // console.log("found the review...");
            // res.send(account.reviews[i]);
            res.render('review', account.reviews[i]);
            return;
          }
        }
        res.send(404);
        return;
      });
    }
  });
});

// app.get('/shopping-experience/:id', function(req, res) {

//   console.log(req.params.id);
//   // res.send(200);
//   // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
//   var shopexId = req.params.id;

//   models.Shopex.findByIdPopulated(shopexId, function(shopex) {
//     if (!shopex) {
//       // console.log("not in PublicReviews");
//       res.send(404);
//     } else {
//       // console.log("found in PublicReviews...");
//       // models.Account.findById(publicReview.accountId, function(account) {
//         console.log("GET request for shopex with id: "+shopexId);
//         // console.log(account.reviews.length);
//         // for (var i = 0; i < account.reviews.length; ++i){
//           // console.log(account.reviews[i]._id);
//           // console.log(reviewId);
//           // if (account.reviews[i]._id == reviewId){
//             // console.log("found the review...");
//             // res.send(account.reviews[i]);
//             // models.Account.findById(shopex._author, function(account) {

//             // }
//             res.render('shopex', shopex);
//             // return;
//           // }
//         // }
//         // res.send(404);
//         // return;
//       // });
//     }
//   });
// });

app.get('/shopping-experience/:pub_id', function(req, res) {
  console.log("ssseee")
  console.log(req.params.pub_id);
  // res.send(200);
  // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
  var shopexPubId = req.params.pub_id;

  models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
    if (err || !shopex) {
      // console.log("not in PublicReviews");
      res.send(404);
    } else {
      // console.log("found in PublicReviews...");
      // models.Account.findById(publicReview.accountId, function(account) {
        
        console.log("GET request for shopex with pub_id: "+shopexPubId);
        // console.log("Got Shopex: "+ JSON.stringify(shopex));

        // console.log(account.reviews.length);
        // for (var i = 0; i < account.reviews.length; ++i){
          // console.log(account.reviews[i]._id);
          // console.log(reviewId);
          // if (account.reviews[i]._id == reviewId){
            // console.log("found the review...");
            // res.send(account.reviews[i]);
            // models.Account.findById(shopex._author, function(account) {

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

app.get('/shopping-experience/ejs/:pub_id', function(req, res) {

  console.log("inside /shopping-experience/ejs/:pub_id")

  // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
  var shopexPubId = req.params.pub_id;
  console.log("pub_id:", shopexPubId);
  
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

  models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
    if (err || !shopex) {
      console.log("Shopex with given pub_id not found:", shopexPubId);
      res.send(404);
    } else {

      single_shopex_page_data.single_shopex_data = {}

      console.log("single_shopex_page_data");
      console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
      console.log({single_shopex_page_data: single_shopex_page_data});

      single_shopex_page_data.single_shopex_data.shopex_data = shopex;
      // single_shopex_page_data.single_shopex_data.user_data = {};
    }

    console.log(single_shopex_page_data);
    
    res.render('zs_single_shopex_page', {single_shopex_page_data: single_shopex_page_data} )
  });
});


app.get('/shopping-experience/all/:limit/:skip', function(req, res){
  console.log("inside /shopping-experience/all/:limit/:skip")

  limit = req.params.limit;
  skip = req.params.skip;
  console.log("limit:", limit);
  console.log("skip:", skip);

  models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){
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

  models.Shopex.getPostsByTime(function(err, shopex_docs){
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

  models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
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

  // models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
  models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){

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

    res.render('zs_all_shopex', {all_shopex_data: all_shopex_data} )

  });
});

app.get('/seller/shopex_count/:limit?/:skip?', function(req, res){
  console.log("inside /seller/shopex_count/:limit?/:skip?")

  limit = req.params.limit == undefined ? 10 : req.params.limit ;
  skip = req.params.skip == undefined ? 0 : req.params.skip;
  console.log("limit:", limit);
  console.log("skip:", skip);

  models.Seller.getSellersByShopexCountSkipLimit(skip, limit, function(err, seller_docs){
    if (err || !seller_docs) {
      console.log("$$$ Sending 404 $$$")
      res.send(404);
    } else {
      console.log("$$$ Sending sellers $$$")
      res.send(seller_docs);
    }
  });
});

app.get('/procat/shopex_count/:limit?/:skip?', function(req, res){
  console.log("inside /procat/shopex_count/:limit?/:skip?")

  limit = req.params.limit == undefined ? 10 : req.params.limit ;
  skip = req.params.skip == undefined ? 0 : req.params.skip;
  console.log("limit:", limit);
  console.log("skip:", skip);

  models.ProductCat.getProductCatsByShopexCountSkipLimit(skip, limit, function(err, procat_docs){
    if (err || !procat_docs) {
      console.log("$$$ Sending 404 $$$")
      res.send(404);
    } else {
      console.log("$$$ Sending sellers $$$")
      res.send(procat_docs);
    }
  });
});

app.post('/shopping-experience/:pub_id/upvote', function(req, res){
  console.log("inside /shopping-experience/:pub_id/upvote")
  pubid = req.params.pub_id;

  models.Shopex.upvote(pubid, function(err, shopex_doc){
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

  models.Shopex.upvalue(pubid, 1, function(err, shopex_doc){
    if (err || !shopex_doc) {
      res.send(404);
    } else {
      res.send(200);
    }
  })
})

function expandReviews(docs, callback) {
  // console.log("expandReviews called");
  res = [];
  pushed = 0;
  // console.log(docs);

  for (var i=0; i < docs.length; ++i){
    // console.log(pushed);
    accountId = docs[i]["accountId"];
    reviewId = docs[i]["reviewId"];

    (function(reviewId) {
      models.Account.findById(accountId, function(account) {
        if (account) {
          // console.log("found account");
          for (var r = 0; r < account.reviews.length; ++r) {
            // console.log("=="+account.reviews[r]._id+"==");
            // console.log("=="+reviewId+"==");
            // console.log("");

            // console.log("=="+typeof(account.reviews[r]._id)+"==");
            // console.log("=="+typeof(reviewId)+"==");
            // console.log("");
            // console.log("$$$$$"); 
            // console.log(r);
            // console.log("$$$$$");
            if (account.reviews[r]._id.toString() == reviewId.toString()){
              // console.log("got the review");
              // console.log(account.reviews[r]);
              res.push(account.reviews[r]);
              ++pushed;
              // console.log(pushed);
              // console.log(r);
              if (pushed == docs.length){
                // console.log(res);
                callback(res);
              }
              break;
            }
          }
        }
      });
    })(reviewId);
  }
}

// get all the public reviews posted by people, along with their first name and all anon reviews with name = anon
// send back the latest 50 reviews posted on the system
app.post('/reviews/all', function(req, res) {
  // var accountId = req.session.accountId;

  skip_count = parseInt(req.param('skip'));
  anchor_count = parseInt(req.param('anchor'));
  response = {};
  
  if (anchor_count == 0){
    models.PublicReviews.PublicReviews.count(function(err, currCount){
      anchor_count = currCount;
      models.PublicReviews.getNextPage(skip_count, anchor_count, 10, function(err, results) {
        if (err){
          res.send(400);
        }
        // console.log(results);
        response.skip = skip_count + results.length;
        response.anchor = anchor_count;
        expandReviews(results, function(expandedResults){
          response.results = expandedResults;
          res.send(response);
        });
      });
    });
  } else {
    models.PublicReviews.getNextPage(skip_count, anchor_count, 10, function(err, results) {
      if (err){
        console.log("[VIN_ERROR]=> Error in getNextPage()")
        res.send(200);
      }
      response.skip = skip_count + results.length;
      response.anchor = anchor_count;
      expandReviews(results, function(expandedResults){
        response.results = expandedResults;
        res.send(response);
      });
    });
  }
});

app.post('/accounts/me/reviews', function(req, res) {
  // var accountId = req.params.id == 'me'
  //                    ? req.session.accountId
  //                    : req.params.id;
  var accountId = req.session.accountId;
  // console.log("---------------------------");
  // console.log(accountId);
  // console.log(typeof(accountId));
  // console.log("---------------------------");
  models.Account.findById(accountId, function(account) {
    if (!account) {
      res.send(400);
    } else {
      review = {
        _id: mongoose.Types.ObjectId(),
        reviewText:   req.param('reviewText'),
        vendor:       req.param('vendor'),
        pscategory:   req.param('pscategory'),
        anonymous:    req.param('anonymous'),
        otd_rating:   parseInt(req.param('otd_rating')),
        pad_rating:   parseInt(req.param('pad_rating')),
        pri_rating:   parseInt(req.param('pri_rating')),
        pro_rating:   parseInt(req.param('pro_rating')),
        eos_rating:   parseInt(req.param('eos_rating')),
        rrp_rating:   parseInt(req.param('rrp_rating')),
        csu_rating:   parseInt(req.param('csu_rating')),
        all_rating:   req.param('all_rating'),
        otd_comment:  req.param('otd_comment'),
        pad_comment:  req.param('pad_comment'),
        pri_comment:  req.param('pri_comment'),
        pro_comment:  req.param('pro_comment'),
        eos_comment:  req.param('eos_comment'),
        rrp_comment:  req.param('rrp_comment'),
        csu_comment:  req.param('csu_comment')
      };
      console.log(JSON.stringify(review));
      account.reviews.push(review);
      // console.log("@@#########")
      // console.log(typeof(account.reviews));
      
      // if (req.param('anonymous') === "on")
      //   account.anonReviews.push(review);
      // else
      //   account.reviews.push(review);

      // Push the status to all friends
      // account.activity.push(status);
      account.save(function (err, doc) {
        if (err) {
          console.log('[VIN_ERROR]=> Error saving account: ' + err);
        }
          console.log('[VIN_DEBUG]=> Saved review with review id: ' + review._id);
          models.PublicReviews.addEntry(accountId, review._id, function(err, res){
            console.log(res);
          });
          console.log("=====================================================");
          // // console.log(account.reviews.find({_id:review._id}));
          console.log(account.reviews.length);
          for (var r = 0; r < account.reviews.length; ++r) {
            // console.log("#########")
            if (account.reviews[r]._id == review._id){
              console.log("got the review");
              console.log(account.reviews[r]);
            }
            // console.log("#########")
            // break;
          }
      });
      res.send(200);
  }
  });
});

var getShopexObj = function(req, anon) {
  var shopex = {
    // reviewText:   req.param('reviewText'),
    review_text:   req.param('reviewText'),
    
    // _author:      req.session.accountId,

    vendor:       req.param('vendor'),
    // _seller:      req.param('seller_pub_id'),

    pscategory:   req.param('pscategory'),

    // _pro_cat:     req.param('pro_cat_pub_id'),    // #Check would have to convert the stringified array to js array object
    // _pro:         req.param('pro_pub_id'),        // #Check would have to convert the stringified array to js array object

    // _ser_cat:     req.param('ser_cat_pub_id'),    // #Check would have to convert the stringified array to js array object
    // _ser:         req.param('ser_pub_id'),        // #Check would have to convert the stringified array to js array object
    
    // anonymous:    req.param('anonymous'),
    anon:         anon == "on",

    otd_rating:   parseInt(req.param('otd_rating')),
    pad_rating:   parseInt(req.param('pad_rating')),
    pri_rating:   parseInt(req.param('pri_rating')),
    pro_rating:   parseInt(req.param('pro_rating')),
    eos_rating:   parseInt(req.param('eos_rating')),
    rrp_rating:   parseInt(req.param('rrp_rating')),
    csu_rating:   parseInt(req.param('csu_rating')),

    all_rating:   req.param('all_rating'),
    otd_comment:  req.param('otd_comment'),
    pad_comment:  req.param('pad_comment'),
    pri_comment:  req.param('pri_comment'),
    pro_comment:  req.param('pro_comment'),
    eos_comment:  req.param('eos_comment'),
    rrp_comment:  req.param('rrp_comment'),
    csu_comment:  req.param('csu_comment')
  };
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

  models.Shopex.getAuthorId(shopexPubId, function(err, authorId){
    if (err || !authorId || authorId != accountId) {
      console.log("Permission Denied To Edit")
      res.send(400);
      return;
    } else {
      console.log("Permission Accessed To Edit")
      models.Shopex.updatePost(shopexPubId, shopexObj, "edit_summary", function(err, updated_shopex){
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
  // console.log("---------------------------");
  // console.log(accountId);
  // console.log(typeof(accountId));
  // console.log("---------------------------");
  
  // models.Account.findById(accountId, function(account) {
  //   if (!account) {
  //     res.send(400);
  //   } else {
  shopex = getShopexObj(req, anon);
  shopex._author = req.session.accountId;
  // shopex = {
  //   // _id: mongoose.Types.ObjectId(),

  //   // reviewText:   req.param('reviewText'),
  //   review_text:   req.param('reviewText'),
  //   _author:      accountId,
    
  //   vendor:       req.param('vendor'),
  //   _seller:      req.param('seller_pub_id'),

  //   pscategory:   req.param('pscategory'),

  //   _pro_cat:     req.param('pro_cat_pub_id'),    // #Check would have to convert the stringified array to js array object
  //   _pro:         req.param('pro_pub_id'),        // #Check would have to convert the stringified array to js array object

  //   _ser_cat:     req.param('ser_cat_pub_id'),    // #Check would have to convert the stringified array to js array object
  //   _ser:         req.param('ser_pub_id'),        // #Check would have to convert the stringified array to js array object
    
  //   // anonymous:    req.param('anonymous'),
  //   anon:         anon == "on",

  //   otd_rating:   parseInt(req.param('otd_rating')),
  //   pad_rating:   parseInt(req.param('pad_rating')),
  //   pri_rating:   parseInt(req.param('pri_rating')),
  //   pro_rating:   parseInt(req.param('pro_rating')),
  //   eos_rating:   parseInt(req.param('eos_rating')),
  //   rrp_rating:   parseInt(req.param('rrp_rating')),
  //   csu_rating:   parseInt(req.param('csu_rating')),

  //   all_rating:   req.param('all_rating'),
  //   otd_comment:  req.param('otd_comment'),
  //   pad_comment:  req.param('pad_comment'),
  //   pri_comment:  req.param('pri_comment'),
  //   pro_comment:  req.param('pro_comment'),
  //   eos_comment:  req.param('eos_comment'),
  //   rrp_comment:  req.param('rrp_comment'),
  //   csu_comment:  req.param('csu_comment')
  // };

  console.log(JSON.stringify(shopex));

  models.Shopex.createPost(shopex, function(err, saved_shopex){
    // got the shopex object, redirect the user to the shopex.pub_id based url for the post, available now 
  })

  // account.reviews.push(review);
  // console.log("@@#########")
  // console.log(typeof(account.reviews));
  
  // if (req.param('anonymous') === "on")
  //   account.anonReviews.push(review);
  // else
  //   account.reviews.push(review);

  // Push the status to all friends
  // account.activity.push(status);
  
  // shopex.save(function (err, doc) {
  //   if (err) {
  //     console.log('[VIN_ERROR]=> Error saving account: ' + err);
  //   }
  //     console.log('[VIN_DEBUG]=> Saved review with review id: ' + review._id);
  //     models.PublicReviews.addEntry(accountId, review._id, function(err, res){
  //       console.log(res);
  //     });
  //     console.log("=====================================================");
  //     // // console.log(account.reviews.find({_id:review._id}));
  //     console.log(account.reviews.length);
  //     for (var r = 0; r < account.reviews.length; ++r) {
  //       // console.log("#########")
  //       if (account.reviews[r]._id == review._id){
  //         console.log("got the review");
  //         console.log(account.reviews[r]);
  //       }
  //       // console.log("#########")
  //       // break;
  //     }
  // });

  res.send(200);
  // }
  // });
});


app.get('/accounts/me', function(req, res) {
  // var accountId = req.params.id == 'me'
  //                    ? req.session.accountId
  //                    : req.params.id;
  var accountId = req.session.accountId;
  models.Account.findById(accountId, function(account) {
    if (account)
      res.send(account);
    else
      res.send(400);
  });
});


app.post('/forgotpassword', function(req, res) {
  var hostname = req.headers.host;
  var resetPasswordUrl = 'http://' + hostname + '/resetPassword';
  var email = req.param('email', null);
  if ( null == email || email.length < 1 ) {
    res.send(400);
    return;
  }

  models.Account.forgotPassword(email, resetPasswordUrl, function(success){
    // if (success) {
    //   res.send(200);
    // } else {
    //   // Username or password not found
    //   res.send(404);
    // }
    res.send(200);
  });
});

app.get('/verify', function(req, res) {
  var accountId = req.param('account', null);
  
  models.Account.findById(accountId, function(account) {
    if (account){
      // set verified variable for the account to be true
      account.verified = true;
      account.save(function(err, doc){
        if (doc)
          console.log("account verification completed for: "+doc._id);
      });
      res.render('accountActivationSuccess');
    } else {
      res.send(400);
    }
  });
});

app.get('/resetPassword', function(req, res) {
  var accountId = req.param('account', null);
  // console.log(accountId);
  res.render('resetPassword', {locals:{accountId:accountId}});
});

app.post('/resetPassword', function(req, res) {
  var accountId = req.param('accountId', null);
  var password = req.param('password', null);
  var re_password = req.param('re-password', null);
  if ( null != accountId && null != password && password == re_password) {
    models.Account.changePassword(accountId, password);
  }
  res.render('resetPasswordSuccess');
});


app.listen(process.env.PORT || 8080);
console.log("ZorSay listening on port process.env.PORT or else 8080.");
