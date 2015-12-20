/*
 * Import required packages.
 * Packages should be installed with "npm install".
 */
var express     = require("express");
var app         = express();
var nodemailer  = require('nodemailer');

var session    = require('express-session');
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

// var MemoryStore = require('connect').session.MemoryStore;
// var RedisStore = require('connect-redis');
// var MongoStore = require('connect-mongo')(express);
var MongoStore = require('connect-mongo')(session);

var ejs         = require("ejs");
var fs          = require("fs");
// var crypto      = require('crypto');
var Recaptcha   = require('re-captcha');

//var dbPath      = 'mongodb://localhost/nodebackbone1';
//var dbPath      = 'mongodb://vinit:wordpass@linus.mongohq.com:10004/nodebackbone1';
//var dbPath      = 'mongodb://vinit:wordpass@linus.mongohq.com:10004/nodebackbone2';
var dbPath = process.env.MONGOHQ_URL || 'mongodb://localhost/nodebackbone4';

// Import the data layer
var mongoose = require('mongoose');
var config = {
  mail: require('./config/mail')
};

// Import the models
var models                = {};

models.PublicCounter      = require('./models/PublicCounter')(config, mongoose);

// models.LaunchListAccount  = require('./models/LaunchListAccount')(config, mongoose);
// models.PublicReviews      = require('./models/PublicReviews')(config, mongoose);

// -----------------------------------------------------

// models.Account            = require('./models/Account')(config, mongoose, nodemailer, models);
models.Account            = require('./models/Account_new')(config, mongoose, nodemailer, models, "Account");

// -----------------------------------------------------

// models.Seller             = require('./models/Seller')(config, mongoose, models);
models.Seller             = require('./models/Seller_new')(config, mongoose, models, "Seller");
// models.ProductCat         = require('./models/ProductCat')(config, mongoose, models);
models.ProductCat         = require('./models/ProductCat_new')(config, mongoose, models, "ProductCat");

// models.ServiceCat         = require('./models/ServiceCat')(config, mongoose, models);
models.ServiceCat         = require('./models/ServiceCat_new')(config, mongoose, models, "ServiceCat");

// -----------------------------------------------------

// models.Shopex             = require('./models/Shopex')(config, mongoose, models);
models.dShopex             = require('./models/Shopex_new')(config, mongoose, models, "dShopex");
models.Shopex             = require('./models/Shopex_new')(config, mongoose, models, "Shopex");

// models.Question           = require('./models/Question')(config, mongoose, models);
models.dQuestion             = require('./models/Question_new')(config, mongoose, models, "dQuestion");
models.Question             = require('./models/Question_new')(config, mongoose, models, "Question");

// models.Answer           = require('./models/Answer')(config, mongoose, models);
models.dAnswer             = require('./models/Answer_new')(config, mongoose, models, "dAnswer");
models.Answer             = require('./models/Answer_new')(config, mongoose, models, "Answer");

// models.Comment            = require('./models/Comment')(config, mongoose, models)
models.dComment            = require('./models/Comment_new')(config, mongoose, models, "dComment");
models.Comment            = require('./models/Comment_new')(config, mongoose, models, "Comment");

models.Utils              = require('./models/utils')(app);

// -----------------------------------------------------

// app.locals.AccessControl  = require('./models/common/AccessControl')(config);
AccessControl = require('./models/common/AccessControl')(config);

app.AccessControl = AccessControl;


// #TODO needed a configuration for defining environment for the application to run
// http://expressjs.com/api.html#app.configure
// http://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application
// process.env.NODE_ENV must be in ["development", "testing", "staging", "production"]

// app.configure(function(){
  // app.engine('html', cons.underscore);
  app.set('view engine', 'ejs');

  // #TODO make it so when in production, enable browser cache
  // #TODO figure out a way related to E-tag and If-None-Match headers
  // http://stackoverflow.com/questions/10900108/node-express-serving-image-if-exist-caching-issue
  // #TODO also, look into compress, atleast for static files

  app.use(express.static(__dirname + '/public'));
  // app.use(express.static(__dirname + '/public', { maxAge: 30672000 }));
  // cache timing for pop lib like backbone, bootstrap etc...
  // 30672000
  // 31104000
  // 31536000

  // app.use(express.limit('1mb'));
  // var getRawBody = require('raw-body')
  // app.use(function (req, res, next) {
  //   getRawBody(req, {
  //     length: req.headers['content-length'],
  //     limit: '1mb',
  //     encoding: 'utf8'
  //   }, function (err, string) {
  //     if (err)
  //       return next(err)

  //     req.text = string
  //     next()
  //   })
  // })

  app.use(bodyParser());  
  app.use(cookieParser());

  // app.enable("jsonp callback");
  app.set("jsonp callback", true);
  
  // Create a session store to share between methods
  // app.sessionStore = new MemoryStore();
  // app.sessionStore = new RedisStore();
  app.sessionStore = new MongoStore({ url: dbPath+"/sessions" });

  // app.sessionSecret = "SocialNet secret key";
  app.sessionSecret = "LeelaFry secret key";
  // app.sessionKeyName = 'express.sid';
  app.sessionKeyName = 'bender.sid';

  // app.use(express.session({
  app.use(session({
    secret: app.sessionSecret,
    key: app.sessionKeyName,
    store: app.sessionStore,
  }));

  // app.use(function(req, res, next){
  //   res.locals.AccessControl  = require('./models/common/AccessControl')(config);
  //   next();
  // });

  // attach models to the app so it can be shared
  app.models = models;
  
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

// });


// These are global function for use inside ejs templates
// #TODO fix these to keep them from global namespace
// #TODO attache these functions to app and need to find a away to pass it to ejs engine

// app.locals.rendered_include = function(template_filename, param_data){
rendered_include = function(template_filename, param_data){
  template_str = fs.readFileSync(template_filename, 'utf-8');
  return ejs.render(template_str, param_data);
  // res = ejs.render(template_str, param_data);
  // console.log(res);
  // return res;
  // return ejs.render(template_filename, param_data);
}

makeStr = function (arr) {
  // if (arr.length == 0){
  //   return "Zorsay, Vinit Agrawal, Arun Anto";
  // }
  var arrStr = ""
  for (i in arr){
    arrStr += arr[i] + ", ";
  }
  return arrStr;
}

truncateStr = function(str, overflow) {
  var truncStr = str.replace(/<(?:.|\n)*?>/gm, ' ');
  if ((truncStr.replace(/\s/g,'').length > 0)) {
    truncStr = truncStr.trim();
    if (truncStr.length > overflow)
      return truncStr.substring(0, overflow);
    return truncStr;
  }
  return "";
}

getShopexRatingDesc = function(sd) {
  var sxrd = "Rated ";
  sxrd += sd.eos_rating ? sd.eos_rating +".0 for Ease Of Shopping, " : "";
  sxrd += sd.pad_rating ? sd.pad_rating +".0 for Product Variety, " : "";
  sxrd += sd.pri_rating ? sd.pri_rating +".0 for Pricing, " : "";
  sxrd += sd.csu_rating ? sd.csu_rating +".0 for Communication, " : "";
  sxrd += sd.pro_rating ? sd.pro_rating +".0 for Delivery & Product, " : "";
  sxrd += sd.rrp_rating ? sd.rrp_rating +".0 for Return & Refund." : "";
  
  return sxrd;
}

share_default_square_image = "https://zsimg.s3.amazonaws.com/account/zsimg-orig-1-1-0-294fe2fe86a8434060ccffe9adeb9431.png";

site_authors = ["Zorsay", "Vinit Agrawal", "Arun Anto"];

// site_host = "";
site_host = "http://www.zorsay.com";

site_message_orig = "This is a place to help you make better Decisions while Buying things Online. We are helping Buyers, like you, connect with other Buyers to get Unbiased Insights about a Product or a Service. We also help you connect with Online Sellers to give Expert Advise for your Needs.";

site_message = "This is a place to help you make better decisions while buying things online. We are helping buyers, like you, connect with other buyers to get unbiased insights about a Product or a Service. We also help you connect with Online Sellers to give expert advice for your Needs.";

site_message_html = "This is a place to help you make better <b>Decisions</b> while <b> Buying</b> things Online. We are helping <b>Buyers</b>, like you, connect with other Buyers to get <b>Unbiased Insights</b> about a <b>Product</b> or a <b>Service</b>. We also help you connect with <b>Online Sellers</b> to give <b>Expert Advise</b> for your <b>Needs</b>.";

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
checkData = function(data_obj, property_path) {
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

getAnswerPermalinkforAuthor = function(answers, authorId) {
  for(var i = 0; i < answers.length; ++i) {
    if (authorId == answers[i]._author || authorId == answers[i]._author._id){
      return answers[i].permalink ? answers[i].permalink : "/answer/"+answers[i]._id;
    }
  }
  return "#";
}

formatTime = function(t) {
  var ft = "permalink";
  if (t) {
    if (typeof(t) == 'object') {
      var tt = t.toDateString().split(" ");
      ft = tt[1] +" "+ tt[2];
    } else {
      var tt = new Date(t);
      if(JSON.stringify(tt)){
        tt = tt.toDateString().split(" ");
        ft = tt[1] +" "+ tt[2];
      }
    }
  }
  return ft;
}

// app.get('/template_test', function(req, res){
//   res.render('template_test');
// });

app.get('/', function(req, res){
  // console.log("getting / ...")

  if (site_host != req.protocol+"://"+req.host){
    site_host = req.protocol+"://"+req.host;
  }
  
  if (req.session.loggedIn){
    res.redirect('/questions');  
  } else {
    
    landing_page_data = {};
    landing_page_data.top_questions = [];
    landing_page_data.top_shopexes = [];

    app.models.Question.getPostsPopulatedByVotes(10000000000, 3, {}, function(err, top_questions){
      app.models.Shopex.getPostsPopulatedByVotes(10000000000, 3, {}, function(err, top_shopexes){
        if (!err && top_questions.length){
          landing_page_data.top_questions = top_questions;
        }
        if (!err && top_shopexes.length){
          landing_page_data.top_shopexes = top_shopexes;
        }
        res.render('zs_landing_page', { landing_page_data: landing_page_data });
      });
    });

  }
  
  // res.redirect('/login');
  // res.redirect('/questions');
  // console.log("DONE getting / ...")
});

var CAPTCHA_PUBLIC_KEY = process.env.GOOGLE_RE_CAPTCHA_PUBLIC_KEY;
var CAPTCHA_PRIVATE_KEY = process.env.GOOGLE_RE_CAPTCHA_PRIVATE_KEY;
var recaptcha = new Recaptcha(CAPTCHA_PUBLIC_KEY, CAPTCHA_PRIVATE_KEY);

app.check_captcha = function(req, callback) {
  console.log("inside app.check_captcha function");
  // console.log("inside check_captcha function");
  var data = {
    remoteip:  req.connection.remoteAddress,
    challenge: req.param('recaptcha_challenge_field', ''),
    response:  req.param('recaptcha_response_field', ''),
  };

  recaptcha.verify(data, callback);
};

//#TODO add ref or affiliate param in share url

fb_share = function(page_info) {
  return "http://www.facebook.com/sharer.php?u="+encodeURIComponent(page_info.page_link)+"&ref=fbshare&t="+page_info.page_title;
  // https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fstackoverflow.com%2Fq%2F5653858%2F907753%3Fsfb%3D2&ref=fbshare&t=FB+share+in+new+window
}

tw_share = function(page_info) {

  if ((page_info.page_title + page_info.page_link).length > 138)
        page_info.page_title = page_info.post_type;

  return "http://twitter.com/share?url="+encodeURIComponent(page_info.page_link)+"&text="+page_info.page_title;
  // https://twitter.com/intent/tweet?original_referer=http%3A%2F%2Fstackoverflow.com%2Fquestions%2F5653858%2Ffb-share-in-new-window&text=FB+share+in+new+window&url=http%3A%2F%2Fstackoverflow.com%2Fq%2F5653858%2F907753%3Fstw%3D2
}

gp_share = function(page_info) {
  return "https://plus.google.com/share?url="+encodeURIComponent(page_info.page_link);
  // https://plus.google.com/share?url=http%3A%2F%2Fstackoverflow.com%2Fq%2F5653858%2F907753?sgp=2
}

// app.get('/recaptcha', function(req, res){
//     res.render('recaptcha_form', {
//       layout: false,
//       locals: {
//         recaptcha_form: recaptcha.toHTML()
//       }
//     });
//     // res.send(recaptcha.toHTML());
//   });

// app.post('/recaptcha', function(req, res) {
//   var data = {
//     remoteip:  req.connection.remoteAddress,
//     challenge: req.body.recaptcha_challenge_field,
//     response:  req.body.recaptcha_response_field
//   };

//   recaptcha.verify(data, function(err) {
//     if (err) {
//       // Redisplay the form.
//       res.render('recaptcha_form', {
//         layout: false,
//         locals: {
//           recaptcha_form: recaptcha.toHTML(err)
//         }
//       });
//     } else {
//       res.send('Recaptcha response valid.');
//     }
//   });
// });

// #TODO#DONE add the routes here #CHECK
// #TODO#DONE require the scripts in routes/ folder #CHECK
// #TODO#DONE and pass them "app" to plugin the function routes to the app #CHECK
// require all the routes for express app residing in the routes directory
fs.readdirSync('routes').forEach(function(file) {
  var routeName = file.substr(0, file.indexOf('.'));
  if (routeName)
    require('./routes/' + routeName)(app);
});


app.listen(process.env.PORT || 8080);
console.log("ZorSay listening on port process.env.PORT or else 8080.");
