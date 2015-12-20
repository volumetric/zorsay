module.exports = function(app){

  app.get('/questions?', function(req, res){
    res.redirect(302, '/questions/recent')
  });

  app.get('/questions?/:order(recent|topvoted|topanswers|unanswered)/:lastId?/:limit?/:type?', function(req, res){
    
    // console.log("inside /questions/:order(recent|topanswers|unanswered)/:lastId?/:limit?/:type?");

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

    var all_question_data = {};
    all_question_data.list_order = list_order;
    all_question_data.loggedIn = req.session.loggedIn;
    all_question_data.navbar_data = {}
    all_question_data.navbar_data.user_info = {}
    var accountId = null;

    if (req.session.loggedIn){
      accountId = req.session.user_info._id;
      all_question_data.navbar_data.user_info = req.session.user_info;
    }

    // app.models.Question.getPostsByValueSkipLimit(skip, limit, function(err, question_docs){
    // app.models.Question.getPostsByTimeSkipLimit(skip, limit, function(err, question_docs){

    if (list_order == "recent") {
      // var queryFunction = app.models.Question.getPostsPopulatedById
      var queryFunction = app.models.Question.getPostsPopulatedByActivity
    } else if (list_order == "topvoted") {
      var queryFunction = app.models.Question.getPostsPopulatedByVotes
    } else if (list_order == "topanswers") {
      var queryFunction = app.models.Question.getPostsPopulatedById
    } else if (list_order == "unanswered") {
      var queryFunction = app.models.Question.getUnansweredPostsPopulatedByVotes
    } else {
      var queryFunction = app.models.Question.getPostsPopulatedById
    }

    queryFunction(lastId, limit, 
      {
      "_author": "name fullname level img_icon_url url_name",
      // "_seller": "name _author _questiones", 
      "_seller": "name url_name", 
      "_pro_cat": "name url_name", 
      "_ser_cat": "name url_name", 
      // #TODO add this by making collection for "Product" and "Service" in the db
      // "_pro": "name", 
      // "_ser": "name", 
      // "_comments": "content_text _author _parent_name _parent_id",
      "_comments": "content_text _author created_at updated_at",
      },
      function(err, question_docs){

      if (err || !question_docs) {
        console.log(err)
        console.log("nothing came")
        res.status(404).render("zs_404_content_not_found.ejs");
        return;
      }

      if (question_docs.length == 0) {
        console.log("length zero")
        res.status(404).render("zs_404_no_more.ejs");
        return; 
      }

      all_question_data.question_main_column_data = {}
      all_question_data.question_main_column_data.question_list_data = question_docs

      // console.log("all_question_data");
      // console.log({all_question_data: all_question_data});

      // all_question_data
      //   navbar_data
      //     user_info_data
      //   top_header_data
      //   question_main_column_data
      //     question_list_data = [question_data]
      //   right_sidebar_data
      //   end_footer_data

      app.models.Utils.getAllPostsSidebarData(function(err, side_bar_data){
        if (!return_type){
          res.render('zs_all_question_page', {
            all_question_data: all_question_data,
            side_bar_data: side_bar_data,
          });
        } else if (return_type == "json") {
          res.json({
            question_list_data: question_docs
          })
        } else if (return_type == "fulljson") {
          res.json({
            all_question_data: all_question_data
          })
        } else if(return_type == "html") { 
          res.render('zs_question_short_list', {
            question_list_data: question_docs,
            user_info: req.session.user_info,
            loggedIn: req.session.loggedIn,
          });
        } else if(return_type == "fullhtml") { //Default
          res.render('zs_all_question_page', {
            all_question_data: all_question_data,
            side_bar_data: side_bar_data,
          });
        }
      });

    });
  });



  // app.get('/question/:pub_id', function(req, res) {
  //   // console.log("ssseee")
  //   console.log(req.params.pub_id);
  //   // res.send(200);
  //   // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
  //   var questionPubId = req.params.pub_id;

  //   app.models.Question.findByPubIdPopulated(questionPubId, function(err, question) {
  //     if (err || !question) {
  //       // console.log("not in PublicReviews");
  //       res.send(404);
  //     } else {
  //       // console.log("found in PublicReviews...");
  //       // app.models.Account.findById(publicReview.accountId, function(account) {
          
  //         console.log("GET request for question with pub_id: "+questionPubId);
  //         // console.log("Got Shopex: "+ JSON.stringify(shopex));

  //         // console.log(account.reviews.length);
  //         // for (var i = 0; i < account.reviews.length; ++i){
  //           // console.log(account.reviews[i]._id);
  //           // console.log(reviewId);
  //           // if (account.reviews[i]._id == reviewId){
  //             // console.log("found the review...");
  //             // res.send(account.reviews[i]);
  //             // app.models.Account.findById(shopex._author, function(account) {

  //             // }
  //             res.render('question', question);
  //             // return;
  //           // }
  //         // }
  //         // res.send(404);
  //         // return;
  //       // });
  //     }
  //   });
  // });

  // app.get('/shopex/:pub_id', function(req, res){
  //   findByPubIdAuthorCommentsPopulated1
  // })

  
  // #TODO if the title here is not same as url_title for this question then 301 redirect to that url, for this a key value db is best where id is mapped to url_title so does not require a slow main db query for the question.
  app.get('/question/:id/:title/comments/:type?', function(req, res) {

    // console.log("inside /question/:id/:title/comments?/:type")

    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;

    var return_type = req.params.type ? req.params.type : "";
    var return_type_trail = return_type ? "/"+return_type : "";

    var questionId = req.params.id;
    var questionTitle = req.params.title;

    // console.log("id:", questionId);
    // console.log("title:", req.params.title);

    // if(!hasValue(shopexPubId)){
    if(!questionId || isNaN(questionId)){
      // res.send(404);
      res.status(404).render("zs_404_content_not_found.ejs");
      return;
    }

    comment_container_data = {}
    comment_container_data.loggedIn = req.session.loggedIn;
    comment_container_data.navbar_data = {}
    if (req.session.loggedIn){
      // comment_container_data.navbar_data = { user_info: req.session.user_info };
      comment_container_data.user_info = req.session.user_info;
    }

    // app.models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
    // app.models.Question.findByPubIdAuthorCommentsPopulated(questionId, function(err, question) {
    
    // app.models.Question.findById(questionId, function(err, question) {
    
    // app.models.Question.getPostPopulated(questionId, 
    // app.models.Question.getPostPopulatedNested(questionId, 
    app.models.Question.getPostCommentsPopulatedNested(questionId, function(err, question) {

      // console.log("inside findById callback")
      if (err || !question || !question._comments) {
        // console.log(err);
        // console.log(question);
        console.log("some error getting comments for this post:", questionId);
        // res.send(500);
        res.status(500).render("zs_5xx_error.ejs");
        return;
      } else if (questionTitle != question.url_title) {
        console.log("Redirection with 301 to:", question.permalink+"/comments/"+return_type);
        res.redirect(301, question.permalink+"/comments"+return_type_trail);
        return;
      } else {

        // Got the basic question, now call all the populate functions
        // call populate() for populating basic presentable info for:
        // _author
        // _seller, _pro_cat, _ser_cat, _pro, _ser
        // _answers array, top n
        // _related_questions array, top m
        // _comments array, top p
        
        // if needed populate
          // viewers
          // upvoters/downvoters
          // followers
          // flaggers etc...

        comment_container_data.comments = question._comments;
      }

      // console.log(shopex._comments[0]._author);
      // console.log(single_question_page_data);
      
      // res.json({
      //   comment_container_data: comment_container_data
      // });

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
  });

  // app.get('/question/random/:type?', function(req, res){
  //   console.log("inside /question/random/:type?")
  //   var return_type = req.params.type ? req.params.type : "";

  //   var side_bar_data = {};

  //   app.models.Question.getRandomPosts(10, function(err, doc){
  //     if (err || !doc){
  //       res.status(404).render("zs_404_content_not_found.ejs");
  //       return;
  //     }
      
  //     side_bar_data = doc;

  //     if (return_type && return_type == "json") {
  //       res.json({
  //         side_bar_data: side_bar_data
  //       })
  //     } else {
  //       res.render('zs_right_sidebar_populated', {
  //         side_bar_data: side_bar_data,
  //       });
  //     }

  //   })
  // })
  
  

  // #TODO if the title here is not same as url_title for this question then 302 redirect to that url, for this a key value db is best where id is mapped to url_title so does not require a slow main db query for the question.
  app.get('/question/:id/:title/:type?', function(req, res) {

    // console.log("inside /question/:id/:title")

    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    var return_type = req.params.type ? req.params.type : "";
    var return_type_trail = return_type ? "/"+return_type : "";

    var questionId = req.params.id;
    var questionTitle = req.params.title;

    // var port = process.env.PORT || 8080;
    var port = 80;
    var port_str = (port==80) ? "" : ":"+port;
    var page_link = req.protocol+"://"+req.host+port_str;

    // console.log("id:", questionId);
    // console.log("title:", req.params.title);

    // if(!hasValue(shopexPubId)){
    if(!questionId || isNaN(questionId)){
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

    single_question_page_data = {}
    single_question_page_data.loggedIn = req.session.loggedIn;
    single_question_page_data.navbar_data = {}
    if (req.session.loggedIn){
      single_question_page_data.navbar_data = { user_info: req.session.user_info };
    }

    // app.models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
    // app.models.Question.findByPubIdAuthorCommentsPopulated(questionId, function(err, question) {
    
    // app.models.Question.findById(questionId, function(err, question) {
    
    // app.models.Question.getPostPopulated(questionId, 
    // app.models.Question.getPostPopulatedNested(questionId, 
    app.models.Question.getPostPopulatedNested1(questionId, 
      {
      "_author": "name fullname level img_icon_url url_name",
      // "_seller": "name _author _shopexes", 
      "_seller": "name", 
      "_pro_cat": "name", 
      "_ser_cat": "name", 
      // "_pro": "name", 
      // "_ser": "name", 
      "_answers": "content_text _author vote_count _comments meta_info created_at updated_at", 
      "_related_questions": "content_title _author meta_info", 
      // "_comments": "content_text _author _parent_name _parent_id",
      // "_comments": "content_text _author created_at updated_at",
      },
      function(err, question) {

      // console.log("inside findById callback")
      if (err || !question) {
        // console.log(err);
        // console.log(question);
        // console.log("question with given _id not found:", questionId);
        // res.send(404);
        res.status(404).render("zs_404_content_not_found.ejs");
        return;
      } else if (question.permalink && questionTitle != question.url_title) {
        // console.log("========================")
        // console.log(questionTitle)
        // console.log("-----------------------")
        // console.log(question.url_title)
        // console.log("========================")
        // console.log("Redirection with 301 to:", question.permalink);
        res.redirect(301, question.permalink + return_type_trail);
        return;
      }

      // Got the basic question, now call all the populate functions
      // call populate() for populating basic presentable info for:
      // _author
      // _seller, _pro_cat, _ser_cat, _pro, _ser
      // _answers array, top n
      // _related_questions array, top m
      // _comments array, top p
      
      // if needed populate
        // viewers
        // upvoters/downvoters
        // followers
        // flaggers etc...

      single_question_page_data.question_data = question;
      page_link += single_question_page_data.question_data.permalink;
      
      // app.models.Question.getRandomPosts(10, function(err, docs){
      //   var side_bar_data = []
      //   if (!err && docs){
      //     side_bar_data = docs;
      //   }

      app.models.Utils.getSinglePostSidebarData(function(err, side_bar_data){

        if (return_type && return_type == "json") {
          res.json({
            single_question_page_data: single_question_page_data,
            side_bar_data: side_bar_data,
          })
        } else if (return_type && return_type == "html") {
          res.send({
            question_data: single_question_page_data.question_data,
          })
        } else {
          res.render('zs_single_question_page', {
            single_question_page_data: single_question_page_data,
            side_bar_data: side_bar_data,
            page_info : {
              page_title: single_question_page_data.question_data.content_title,
              page_link: page_link,
              post_type: "Question"      
            },
          });
        }

      });

      // console.log(shopex._comments[0]._author);
      // console.log(single_question_page_data);

    });
  });


// app.get('/shopping-experience/ejs1/:pub_id', function(req, res) {

//     console.log("inside /shopping-experience/ejs1/:pub_id")

//     // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
//     var shopexPubId = req.params.pub_id;
//     console.log("pub_id:", shopexPubId);

//     // if(!hasValue(shopexPubId)){
//     if(shopexPubId == undefined){
//       res.send(404);
//       return;
//     }
    
//     // single_shopex_page_data
//     //   navbar_data
//     //     user_info_data
//     //   top_header_data
//     //   shopex_main_column_data
//     //     shopex_data = shopex
//     //   right_sidebar_data
//     //   end_footer_data

//     single_shopex_page_data = {}
//     single_shopex_page_data.navbar_data = {}
//     if (req.session.loggedIn){
//       single_shopex_page_data.navbar_data = {user_info: req.session.user_info};
//     }

//     // app.models.Shopex.findByPubIdPopulated(shopexPubId, function(err, shopex) {
//     app.models.Shopex.findByPubIdAuthorCommentsPopulated(shopexPubId, function(err, shopex) {

//       console.log("inside findByPubIdAuthorCommentsPopulated callback")
//       if (err || !shopex) {
//         console.log("Shopex with given pub_id not found:", shopexPubId);
//         res.send(404);
//         return;
//       } else {

//         single_shopex_page_data.single_shopex_data = {}

//         // console.log("single_shopex_page_data");
//         // console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
//         console.log({single_shopex_page_data: single_shopex_page_data});

//         single_shopex_page_data.single_shopex_data.shopex_data = shopex;
//         // single_shopex_page_data.single_shopex_data.user_data = {};
//       }

//       // console.log(shopex._comments[0]._author);

//       console.log(single_shopex_page_data);
      
//       res.render('zs_single_shopex_page', {
//         single_shopex_page_data: single_shopex_page_data
//       });
//     });
//   });

//   app.get('/shopping-experience/all/:limit/:skip', function(req, res){
//     console.log("inside /shopping-experience/all/:limit/:skip")

//     limit = req.params.limit;
//     skip = req.params.skip;
//     console.log("limit:", limit);
//     console.log("skip:", skip);

//     app.models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){
//       if (err || !shopex_docs) {
//         console.log("$$$ Sending 404 $$$")
//         res.send(404);
//       } else {
//         console.log("$$$ Sending shopexes $$$")
//         res.send(shopex_docs);
//       }
//     });
//   });

//   app.get('/shopping-experience/all', function(req, res){
//     console.log("inside /shopping-experience/all")

//     app.models.Shopex.getPostsByTime(function(err, shopex_docs){
//       if (err || !shopex_docs) {
//         console.log("$$$ Sending 404 $$$")
//         res.send(404);
//       } else {
//         console.log("$$$ Sending shopexes $$$")
//         res.send(shopex_docs);
//       }
//     });
//   });

//   app.get('/shopping-experience/val/:limit?/:skip?', function(req, res){
//     console.log("inside /shopping-experience/val/:limit/:skip")

//     limit = req.params.limit;
//     skip = req.params.skip;
//     console.log("limit:", limit);
//     console.log("skip:", skip);

//     app.models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
//       if (err || !shopex_docs) {
//         console.log("$$$ Sending 404 $$$")
//         res.send(404);
//       } else {
//         console.log("$$$ Sending shopexes $$$")
//         res.send(shopex_docs);
//       }
//     });
//   });

//   app.get('/shopping-experience/val/ejs/:limit?/:skip?', function(req, res){
    
//     console.log("inside /shopping-experience/val/ejs/:limit/:skip")

//     limit = req.params.limit;
//     skip = req.params.skip;
//     console.log("limit:", limit);
//     console.log("skip:", skip);

//     all_shopex_data = {}
//     all_shopex_data.navbar_data = {}
//     if (req.session.loggedIn){
//       all_shopex_data.navbar_data = {user_info: req.session.user_info};
//     }

//     // app.models.Shopex.getPostsByValueSkipLimit(skip, limit, function(err, shopex_docs){
//     app.models.Shopex.getPostsByTimeSkipLimit(skip, limit, function(err, shopex_docs){

//       all_shopex_data.shopex_main_column_data = {}
//       all_shopex_data.shopex_main_column_data.shopex_list_data = []

//       console.log("all_shopex_data");
//       console.log({all_shopex_data: all_shopex_data});

//       // all_shopex_data
//       //   navbar_data
//       //     user_info_data
//       //   top_header_data
//       //   shopex_main_column_data
//       //     shopex_list_data = [shopex_data]
//       //   right_sidebar_data
//       //   end_footer_data

//       if (err || !shopex_docs) {
//         console.log("$$$ Got no shopex Sending empty shopex list $$$")
//       } else {
//         console.log("$$$ Got shopexes Sending shopex list $$$")
//         all_shopex_data.shopex_main_column_data.shopex_list_data = shopex_docs
//       }

//       res.render('zs_all_shopex_page', {all_shopex_data: all_shopex_data} )

//     });
//   });


  // #TODO#DONE make one function to handle voting, favourite, sharing, reporting etc... and use ugly url params, as its internal comm
  app.post('/question/:id/meta/:op', function(req, res){
    console.log("inside /question/:id/meta/:op");

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_op.ejs");
      return;
    } else {
      var accountId = req.session.user_info._id;
    }

    questionId = req.params.id;
    var op = req.params.op;

    if (op == "view") {
      app.models.Question.view(questionId, accountId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "upvote") {
      app.models.Question.upvote(questionId, accountId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "downvote") {
      app.models.Question.downvote(questionId, accountId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "favourite") {
      app.models.Question.favourite(questionId, accountId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "follow") {
      app.models.Question.follow(questionId, accountId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          console.log("question_doc.meta_info.followers");
          console.log(question_doc.meta_info.followers);
          res.send(200);
        }
      });
    } else if (op == "report") {
      var report_data = req.param('report_data');
      report_data.account = accountId;

      app.models.Question.report(questionId, report_data, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "share") {
      var share_data = req.param('share_data');
      share_data.account = accountId;
      
      app.models.Question.share(questionId, share_data, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "makeanon") {
      app.models.Question.makeAnon(questionId, accountId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "removeanon") {
      app.models.Question.removeAnon(questionId, accountId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "acceptanswer") {
      var answerId = req.param('answer_id');
      app.models.Question.acceptanswer(questionId, accountId, answerId, function(err, question_doc){
        if (err || !question_doc) {
          // res.send(403);
          console.log(err);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else {
      console.log("unrecognized operation");
      // res.send(403);
      res.status(403).render("zs_403_forbidden.ejs");
    }
  });



  var getQuestionObj = function(req, edit) {
    var question = {};

    console.log(req.param('content_title'))

    if (!edit && !req.param('content_title')) { 
      // if the question is being added without a title
      return false;
    }

    if (req.param('content_title')) {
        question.content_title = req.param('content_title');
    }
    
    if (req.param('content_text'))
      question.content_text = req.param('content_text');
    
    if (req.param('anon'))
      question.anon = JSON.parse(req.param('anon'));

    // "[123, 345, 678]"
    if (req.param('seller_id'))
      question._seller = JSON.parse(req.param('seller_id'));

    if (req.param('pro_cat_id'))
      question._pro_cat = JSON.parse(req.param('pro_cat_id'));

    if (req.param('ser_cat_id'))
      question._ser_cat = JSON.parse(req.param('ser_cat_id'));
    
    if (req.param('pro_id'))
      question._pro = JSON.parse(req.param('pro_id'));

    if (req.param('ser_id'))
      question._ser = JSON.parse(req.param('ser_id'));

    if (req.param('areacode')) {
      if (!isNaN(req.param('areacode')))
        shopex.areacode = req.param('areacode');
      else
        shopex.location = req.param('areacode');
    }

    if (req.param('prod_links'))
      question.prod_links = req.param('prod_links');

    if (req.param('source'))
      question.source = req.param('source');

    return question;
  }


  // app.post('/question/:pub_id', function(req, res) {
  //   console.log("inside /question/:pub_id");
  //   var accountId = req.session.accountId;
  //   var questionPubId = req.params.pub_id;

  //   console.log("questionPubId: ", questionPubId);
  //   // #TODO implement this function: getShopexObj()
    
  //   var questionObj = getQuestionObj(req, req.param.anonymous);
  //   // shopexObj._author = req.session.accountId;

  //   // #TODO implement this function: editPermission()
  //   // editPermission(accountId, "shopex", shopexPubId, function(err, permission){

  //   app.models.Question.getAuthorId(questionPubId, function(err, authorId){
  //     if (err || !authorId || authorId != accountId) {
  //       console.log("Permission Denied To Edit")
  //       res.send(400);
  //       return;
  //     } else {
  //       console.log("Permission Accessed To Edit")
  //       app.models.Question.updatePost(questionPubId, questionObj, "edit_summary", function(err, updated_question){
  //         console.log("inside callback of updatePost()")
  //         if (err || !updated_question){
  //           console.log(err);
  //           res.send(500);
  //           return;
  //         }
  //         console.log("Question Updated:", updated_question.pub_id);
  //         res.send(200);
  //       });
  //       console.log("After calling updatePost")

  //       // send OK right away, dont need to wait for actual db save to return.
  //       // res.send(200);
  //     }
  //   });
  // });

  app.delete('/question/:id', function(req, res) {
    console.log("inside delete /question/:id");

    if (!req.session.loggedIn) {
      res.status(401).render("zs_401_question_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;
    var questionId = req.params.id;

    app.models.Question.deletePost(questionId, accountId, function(err){
      console.log("inside callback of deletePost()")
      if (err){
        console.log(err);
        // res.status(500).render("zs_5xx_error.ejs");
        res.status(403).render("zs_403_question_delete.ejs");
        return;
      }
      res.send(200);
    });

  });

  app.post('/question/:id', function(req, res) {
    console.log("inside /question/:id");

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_question_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;

    var questionId = req.params.id;
    var question = getQuestionObj(req, true);
    if (!question){
      // res.send(412);
      res.status(412).render("zs_412_question_invalid.ejs");
      return;
    }
    var edit_summary = req.param('edit_summary');
    console.log("Edit questionId: ", questionId);
    console.log(JSON.stringify(question));

    var diff_fields = ["content_title", "content_text", "anon", "_seller", "_pro_cat", "_pro", "_ser_cat", "_ser"];

    // #TODO implement this function: editPermission()
    // editPermission(accountId, "question", questionId, function(err, permission){

    // #TODO for canEdit() their should not be a slow db query for the question, rather maintain a key-vale db like redis for questionId to accountId to check for authorship and other permissions. Right now two separate query is being made for getting the same question document, its ok for now since its an edit operation and will be lesser of these requests

    app.models.Question.updatePost(questionId, accountId, question, edit_summary, diff_fields,  function(err, updated_question){

      // updated_question.testProtoFunc();

      // console.log("inside callback of updatePost()")
      if (err || !updated_question){
        console.log(err);
        // res.status(500).render("zs_5xx_error.ejs");
        res.status(403).render("zs_403_forbidden.ejs");
        return;
      }
      // console.log("Question Updated:", updated_question._id);
      res.send(200);
    });

  });

  app.post('/question', function(req, res) {

    if (!req.session.loggedIn) {
      // need to log in for posting a question
      // res.send(401);
      res.status(401).render("zs_401_question_post.ejs");
      return;
    }

    question = getQuestionObj(req);
    if (!question){
      // precondition failed
      // res.send(412)
      res.status(412).render("zs_412_question_invalid.ejs");
      return;
    }

    question._author = req.session.user_info._id;

    console.log(question);
    // console.log(JSON.stringify(question));

    app.models.Question.createPost(question, function(err, saved_question){
      if(err || !saved_question){
        console.log(err);
        // res.send(412);
        res.status(412).render("zs_412_question_invalid.ejs");
      } else {
        // question is saved

        // if (saved_question.permalink)
        //   res.redirect(saved_question.permalink);
        res.json(saved_question);
        // res.json(saved_question.permalink);
        // res.send(200);
      }
    })
    // res.send(200);
  });

} // end module.exports