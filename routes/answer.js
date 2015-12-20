module.exports = function(app){

  // #TODO if the title here is not same as url_title for this answer then 301 redirect to that url, for this a key value db is best where id is mapped to url_title so does not require a slow main db query for the answer.
  app.get('/answer/:id/comments/:type?', function(req, res) {

    // console.log("inside /answer/:id/:title/comments?/:type")

    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;

    var return_type = req.params.type ? req.params.type : "";
    var answerId = req.params.id;

    // console.log("id:", answerId);
    // console.log("title:", req.params.title);

    // if(!hasValue(shopexPubId)){
    if(!answerId || isNaN(answerId)){
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
    // app.models.Answer.findByPubIdAuthorCommentsPopulated(answerId, function(err, answer) {
    
    // app.models.Answer.findById(answerId, function(err, answer) {
    
    // app.models.Answer.getPostPopulated(answerId, 
    // app.models.Answer.getPostPopulatedNested(answerId, 
    app.models.Answer.getPostCommentsPopulatedNested(answerId, function(err, answer) {

      // console.log("inside findById callback")
      if (err || !answer || !answer._comments ) {
        // console.log(err);
        // console.log(answer);
        console.log("no comments for answer with given _id:", answerId);
        // res.send(404);
        res.status(404).render("zs_404_content_not_found.ejs");
        return;
      } else {

        // Got the basic answer, now call all the populate functions
        // call populate() for populating basic presentable info for:
        // _author
        // _seller, _pro_cat, _ser_cat, _pro, _ser
        // _answers array, top n
        // _related_answers array, top m
        // _comments array, top p
        
        // if needed populate
          // viewers
          // upvoters/downvoters
          // followers
          // flaggers etc...

        comment_container_data.comments = answer._comments;
      }

      // console.log(shopex._comments[0]._author);
      // console.log(single_answer_page_data);
      
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

  // #TODO create single answer pages with url as:
  // /question/121/What-is-Shopping/answer/23/Dilip-Kumar
  app.get('/answer/:id/:type?', function(req, res) {

    // console.log("inside /answer/:id/:title")

    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    var return_type = req.params.type;
    var answerId = req.params.id;
    // var answerTitle = req.params.title;

    // var port = process.env.PORT || 8080;
    var port = 80;
    var port_str = (port==80) ? "" : ":"+port;
    var page_link = req.protocol+"://"+req.host+port_str;

    // console.log("id:", answerId);
    // console.log("title:", req.params.title);

    // if(!hasValue(shopexPubId)){
    if(!answerId || isNaN(answerId)){
      // res.send(404);
      res.status(404).render("zs_404_content_not_found.ejs");
      return;
    }
    
    single_answer_page_data = {}
    single_answer_page_data.loggedIn = req.session.loggedIn;
    single_answer_page_data.navbar_data = {}
    if (req.session.loggedIn){
      single_answer_page_data.navbar_data = { user_info: req.session.user_info };
    }

    app.models.Answer.getPostPopulatedNested(answerId, 
      {
      "_author": "name fullname level img_icon_url url_name",
      // "_seller": "name _author _shopexes", 
      "_question": "content_title content_text _accepted_answer _author permalink _answers",
      // "_seller": "name", 
      // "_pro_cat": "name", 
      // "_ser_cat": "name", 
      // "_pro": "name", 
      // "_ser": "name", 
      // "_answers": "content_text _author", 
      // "_related_answers": "content_title _author", 
      // "_comments": "content_text _author _parent_name _parent_id",
      // "_comments": "content_text _author created_at",
      },
      function(err, answer) {

      // console.log("inside findById callback")
      if (err || !answer) {
        // console.log(err);
        // console.log(answer);
        console.log("answer with given _id not found:", answerId);
        // res.send(404);
        res.status(404).render("zs_404_content_not_found.ejs");
        return;
      } else {

        single_answer_page_data.answer_data = answer;
        // page_link += single_answer_page_data.answer_data.permalink;
        page_link += "/answer/"+single_answer_page_data.answer_data._id;
      }

      // console.log(shopex._comments[0]._author);
      // console.log(single_answer_page_data);

      app.models.Utils.getSinglePostSidebarData(function(err, side_bar_data){      
        if (return_type && return_type == "json") {
          res.json({
            single_answer_page_data: single_answer_page_data,
            side_bar_data: side_bar_data,
          })
        } else {
          res.render('zs_single_answer_page', {
            single_answer_page_data: single_answer_page_data,
            side_bar_data: side_bar_data,
            page_info : {
              page_title: "Answer to "+single_answer_page_data.answer_data._question.content_title,
              page_link: page_link,
              post_type: "Answer"
            },
          });
        }
      });

    });
  });


  // #TODO#DONE make one function to handle voting, favourite, sharing, reporting etc... and use ugly url params, as its internal comm
  // #TODO also put "anon" as an operation make/unmake a post as anonymous
  app.post('/answer/:id/meta/:op', function(req, res){
    console.log("inside /answer/:id/meta/:op");

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_op.ejs");
      return;
    } else {
      var accountId = req.session.user_info._id;
    }

    answerId = req.params.id;
    var op = req.params.op;

    if (op == "view") {
      app.models.Answer.view(answerId, accountId, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "upvote") {
      app.models.Answer.upvote(answerId, accountId, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "downvote") {
      app.models.Answer.downvote(answerId, accountId, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "favourite") {
      app.models.Answer.favourite(answerId, accountId, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "follow") {
      app.models.Answer.follow(answerId, accountId, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "report") {
      var report_data = req.param('report_data');
      report_data.account = accountId;

      app.models.Answer.report(answerId, report_data, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "share") {
      var share_data = req.param('share_data');
      share_data.account = accountId;
      
      app.models.Answer.share(answerId, share_data, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "makeanon") {
      app.models.Answer.makeAnon(answerId, accountId, function(err, answer_doc){
        if (err || !answer_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "removeanon") {
      app.models.Answer.removeAnon(answerId, accountId, function(err, answer_doc){
        if (err || !answer_doc) {
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


  var getAnswerObj = function(req, edit) {
    var answer = {};

    if (!edit && (
        !req.param('content_text') || 
        !req.param('question_id') || 
        isNaN(req.param('question_id'))
        )
      )
    { 
      // if the answer is being added without text or invalid question id
      return false;
    }

    if (req.param('content_text'))
      answer.content_text = req.param('content_text');
    
    if (req.param('anon'))
      answer.anon = JSON.parse(req.param('anon'));

    if (req.param('location'))
      answer.location = req.param('location');
    if (req.param('areacode'))
      answer.areacode = req.param('areacode');

    if (req.param('source'))
      answer.source = req.param('source');

    // #associations, only allowed if its being created not edited
    if (!edit) {
      answer._question = req.param('question_id');
    }

    return answer;
  }

  app.delete('/answer/:id', function(req, res) {
    console.log("inside delete /answer/:id");

    if (!req.session.loggedIn) {
      res.status(401).render("zs_401_answer_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;
    var answerId = req.params.id;

    app.models.Answer.deletePost(answerId, accountId, function(err){
      console.log("inside callback of deletePost()")
      if (err){
        console.log(err);
        // res.status(500).render("zs_5xx_error.ejs");
        res.status(403).render("zs_403_forbidden.ejs");
        return;
      }
      res.send(200);
    });

  });

  app.post('/answer/:id', function(req, res) {
    console.log("inside /answer/:id");

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_answer_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;

    var answerId = req.params.id;
    var answer = getAnswerObj(req, true);
    if (!answer){
      // res.send(412);
      res.status(412).render("zs_412_answer_invalid.ejs");
      return;
    }
    var edit_summary = req.param('edit_summary') ? req.param('edit_summary') : "";
    console.log("Edit answerId: ", answerId);
    console.log(JSON.stringify(answer));

    var diff_fields = ["content_text", "anon", "_seller", "_pro_cat", "_pro", "_ser_cat", "_ser"];

    // #TODO implement this function: editPermission()
    // editPermission(accountId, "answer", answerId, function(err, permission){

    // #TODO for canEdit() their should not be a slow db query for the answer, rather maintain a key-vale db like redis for answerId to accountId to check for authorship and other permissions. Right now two separate query is being made for getting the same answer document, its ok for now since its an edit operation and will be lesser of these requests

    app.models.Answer.updatePost(answerId, accountId, answer, edit_summary, diff_fields,  function(err, updated_answer){
      // console.log("inside callback of updatePost()")
      if (err || !updated_answer){
        console.log(err);
        // res.status(500).render("zs_5xx_error.ejs");
        res.status(403).render("zs_403_forbidden.ejs");
        return;
      }
      // console.log("Answer Updated:", updated_answer._id);
      res.send(200);
    });

  });

  app.post('/answer', function(req, res) {

    if (!req.session.loggedIn) {
      // need to log in for posting a answer
      // res.send(401)
      res.status(401).render("zs_401_answer_post.ejs");
      return;
    }

    answer = getAnswerObj(req);
    if (!answer){
      // precondition failed
      res.status(412).render("zs_412_answer_invalid.ejs");
      return;
    }
    answer._author = req.session.user_info._id;
    console.log(answer);

    app.models.Question.checkAnswererForQuestion(answer._question, answer._author, function(err, question_res){
      if (err || !question_res){
        console.log(err);
        res.status(403).render("zs_403_answer_exists.ejs");
        return;
      }

      app.models.Answer.createPost(answer, function(err, saved_answer){
        if(err || !saved_answer){
          console.log(err);
          // res.send(412);
          res.status(412).render("zs_412_answer_invalid.ejs");
        } else {
          // answer is saved

          // if (saved_answer.permalink)
          //   res.redirect(saved_answer.permalink);
          res.json(saved_answer);
          // res.json(saved_answer.permalink);

          // res.status(200).render("zs_200_answer_posted.ejs");
          // res.send(200);
        }
      })
    })
    // res.send(200);
  });

} // end module.exports