module.exports = function(app){

  var getCommentObj = function(req, edit){
    // #TODO#DONE implement this function
    var comment = {};
    var posts = ["Shopex", "Question", "Answer", "Comment"];

    if (!edit && (
        !req.param('content_text') || 
        !req.param('parent_id') || 
        isNaN(req.param('parent_id')) ||
        !req.param('parent_name') ||
        (posts.indexOf(req.param('parent_name')) == -1)
        )
      )
    {
      // if the commment is being added without text or invalid parent
      return false;
    }

    if (req.param('content_text'))
      comment.content_text = req.param('content_text');
      
    if (req.param('anon'))
      comment.anon = JSON.parse(req.param('anon'));

    // #associations, only allowed if its being created not edited
    if (!edit) {
      comment._parent_name = req.param('parent_name');
      comment._parent_id = req.param('parent_id');
    }

    if (JSON.stringify(comment) != '{}')
      return comment;
    return false;
  }

  // app.get('/comment/:pub_id', function(req, res) {
  //   console.log("inside get /comment");

  //   // app.models.Comment.Model.findOne({pub_id: req.params.pub_id}, function(err, comment_doc){
  //   app.models.Comment.findByPubIdCommentsPopulated(req.params.pub_id, function(err, comment_doc){
  //       // res.render("zs_comment", {comment_data: comment_doc});
  //       res.send({comment_data: comment_doc});
  //   })

  // });

  // app.get('/comment/ejs/:pub_id', function(req, res) {
  //   console.log("inside get /comment");

  //   // app.models.Comment.Model.findOne({pub_id: req.params.pub_id}, function(err, comment_doc){
  //   app.models.Comment.findByPubIdCommentsPopulated(req.params.pub_id, function(err, comment_doc){
  //       res.render("zs_comment", {comment_data: comment_doc});
  //       // res.send({comment_data: comment_doc});
  //   })
  // });

  // #TODO create single comment pages with url as:
  // /question/121/What-is-Shopping/comment/23/Dilip-Kumar
  app.get('/comment/:id/:type?', function(req, res) {

    // console.log("inside /comment/:id/:title")

    // var accountId = req.params.id == 'me' ? req.session.accountId : req.params.id;
    var return_type = req.params.type;
    var commentId = req.params.id;
    // var commentTitle = req.params.title;

    // var port = process.env.PORT || 8080;
    var port = 80;
    var port_str = (port==80) ? "" : ":"+port;
    var page_link = req.protocol+"://"+req.host+port_str;

    // console.log("id:", commentId);
    // console.log("title:", req.params.title);

    // if(!hasValue(shopexPubId)){
    if(!commentId || isNaN(commentId)){
      // res.send(404);
      res.status(404).render("zs_404_content_not_found.ejs");
      return;
    }
    
    single_comment_page_data = {}
    single_comment_page_data.loggedIn = req.session.loggedIn;
    single_comment_page_data.navbar_data = {}
    if (req.session.loggedIn){
      single_comment_page_data.navbar_data = { user_info: req.session.user_info };
    }

    app.models.Comment.getPostPopulatedNested(commentId, 
      {
      "_author": "name fullname level img_icon_url url_name",
      // "_seller": "name _author _shopexes", 
      // "_question": "content_title content_text _accepted_comment _author permalink _comments",
      // "_seller": "name", 
      // "_pro_cat": "name", 
      // "_ser_cat": "name", 
      // "_pro": "name", 
      // "_ser": "name", 
      // "_comments": "content_text _author", 
      // "_related_comments": "content_title _author", 
      // "_comments": "content_text _author _parent_name _parent_id",
      // "_comments": "content_text _author created_at",
      },
      function(err, comment) {

      // console.log("inside findById callback")
      if (err || !comment) {
        // console.log(err);
        // console.log(comment);
        console.log("comment with given _id not found:", commentId);
        // res.send(404);
        res.status(404).render("zs_404_content_not_found.ejs");
        return;
      } else {

        single_comment_page_data.comment_data = comment;
        // page_link += single_comment_page_data.comment_data.permalink;
        page_link += "/comment/"+single_comment_page_data.comment_data._id;
      }

      // console.log(shopex._comments[0]._author);
      // console.log(single_comment_page_data);
      
      if (return_type && return_type == "json") {
        res.json({
          single_comment_page_data: single_comment_page_data
        })
      } else {
        res.render('zs_single_comment_page', {
          single_comment_page_data: single_comment_page_data,
          page_info : {
            page_title: "Comment for "+single_comment_page_data.comment_data._parent_name +" "+ single_comment_page_data.comment_data._parent_id,
            page_link: page_link,
            post_type: "Comment"
          },
        });
      }

    });
  });

  // #TODO#DONE make one function to handle voting, favourite, sharing, reporting etc... and use ugly url params, as its internal comm
  // #TODO also put "anon" as an operation make/unmake a post as anonymous
  app.post('/comment/:id/meta/:op', function(req, res){
    console.log("inside /comment/:id/meta/:op");

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_op.ejs");
      return;
    } else {
      var accountId = req.session.user_info._id;
    }

    commentId = req.params.id;
    var op = req.params.op;

    if (op == "view") {
      app.models.Comment.view(commentId, accountId, function(err, comment_doc){
        if (err || !comment_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "upvote") {
      app.models.Comment.upvote(commentId, accountId, function(err, comment_doc){
        if (err || !comment_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "downvote") {
      app.models.Comment.downvote(commentId, accountId, function(err, comment_doc){
        if (err || !comment_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    // } else if (op == "favourite") {
    //   app.models.Comment.favourite(commentId, accountId, function(err, comment_doc){
    //     if (err || !comment_doc) {
    //       // res.send(403);
    //       res.status(403).render("zs_403_forbidden.ejs");
    //     } else {
    //       res.send(200);
    //     }
    //   });
    } else if (op == "report") {
      var report_data = req.param('report_data');
      report_data.account = accountId;

      app.models.Comment.report(commentId, report_data, function(err, comment_doc){
        if (err || !comment_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "share") {
      var share_data = req.param('share_data');
      share_data.account = accountId;
      
      app.models.Comment.share(commentId, share_data, function(err, comment_doc){
        if (err || !comment_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "makeanon") {
      app.models.Comment.makeAnon(commentId, function(err, comment_doc){
        if (err || !comment_doc) {
          // res.send(403);
          res.status(403).render("zs_403_forbidden.ejs");
        } else {
          res.send(200);
        }
      });
    } else if (op == "removeanon") {
      app.models.Comment.removeAnon(commentId, function(err, comment_doc){
        if (err || !comment_doc) {
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


  app.delete('/comment/:id', function(req, res) {
    console.log("inside delete /comment/:id");

    if (!req.session.loggedIn) {
      res.status(401).render("zs_401_comment_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;
    var commentId = req.params.id;

    app.models.Comment.deletePost(commentId, accountId, function(err){
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


  app.post('/comment/:id', function(req, res) {
    console.log("inside /comment/:id");

    if (!req.session.loggedIn) {
      res.status(401).render("zs_401_comment_edit.ejs");
      return;
    }
    var accountId = req.session.user_info._id;
    
    var commentId = req.params.id;
    var comment = getCommentObj(req, true);
    if (!comment){
      // res.send(412);
      res.status(412).render("zs_412_comment_invalid.ejs");
      return;
    }
    var edit_summary = req.param('edit_summary') ? req.param('edit_summary') : "";
    console.log("Edit commentId: ", commentId);
    console.log(JSON.stringify(comment));    

    var diff_fields = ["content_text", "anon"];


    // #TODO implement this function: editPermission()
    // editPermission(accountId, "comment", commentId, function(err, permission){

    // #TODO for canEdit() their should not be a slow db query for the answer, rather maintain a key-vale db like redis for commentId to accountId to check for authorship and other permissions. Right now two separate query is being made for getting the same answer document, its ok for now since its an edit operation and will be lesser of these requests

    app.models.Comment.editPost(commentId, accountId, comment, diff_fields,  function(err, updated_comment){
      // console.log("inside callback of editPost()")
      if (err || !updated_comment){
        console.log(err);
        // res.status(500).render("zs_5xx_error.ejs");
        res.status(403).render("zs_403_forbidden.ejs");
        return;
      }
      // console.log("Comment Updated:", updated_comment);
      res.send(200);
    });

  });

  app.post('/comment', function(req, res) {

    if (!req.session.loggedIn) {
      // res.send(401);
      res.status(401).render("zs_401_comment_post.ejs");
      return;
    } else {
      comment = getCommentObj(req);
      if (!comment){
        // res.send(412);
        res.status(412).render("zs_412_comment_invalid.ejs");
        return;
      }
      comment._author = req.session.user_info._id;
    }
    console.log(JSON.stringify(comment));

    app.models.Comment.createPost(comment, function(err, saved_comment){
      if(err || !saved_comment){
        console.log(err);
        // console.log("333444")
        // res.send(412);
        res.status(412).render("zs_412_comment_invalid.ejs");
      } else {
        // comment is saved
        // res.send(200);
        res.json(saved_comment);
      }
      
    })

  });

} // end module.exports