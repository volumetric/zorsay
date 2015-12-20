module.exports = function(config, mongoose, models, Post) {

  AccessControl = require('../common/AccessControl');

  // Post is actually PostModel 
  // its a basic mongoose model defined by specific schema and
  // pre() and post() middlware functions definitions

  var jsdiff = require("diff");

  // var findOneCommentsPopulated = function(postPubId, callback) {
  //   Post
  //   .findOne(pub_id: postPubId)
  //   .populate('_author')
  //   .exec
  // }

  Post.prototype.testProtoFunc = function() {
      console.log("####### testProtoFunc Working #########");
      console.log(JSON.stringify(this));
      console.log("####### testProtoFunc Working #########");
  };

  var formatExternalLink = function(str) {
    // var anchor_tag_regex = /<a(?:.|\n)*?>/gm;
    var anchor_tag_regex = /<a((.|\n)*?)>/gm;
    return str.replace(anchor_tag_regex, "<a$1 "+ "target=\"_blank\" rel=\"nofollow\"" +" >")
  }

  Post.prototype.validatedSave = function(callback) {
      var any_html_tag_regex = /<(?:.|\n)*?>/gm;
      var script_tag_regex = /<script(?:.|\n)*?>/gm;
      // var script_tag_regex = /<script(:?.|\n)*?>(:?.|\n)*?<\/script(:?.|\n)*?>/gm;

      console.log("####### validatedSave Working #########");
      console.log(JSON.stringify(this));

      // this.content_title has to be pure text, i.e.. no html
      if (this.content_title){
        this.content_title = this.content_title.replace(/<(?:.|\n)*?>/gm, ' ');
      }

      // this.content_text can be an html but cleaned with any script tags and any anchor tag will be injected with target="_blank" attribute and rel="nofollow" attribute
      if (this.content_text) {
        this.content_text = this.content_text.replace(script_tag_regex, '')
      }

      if (this.content_text) {
        this.content_text = formatExternalLink(this.content_text);
      }      

      // other stuff can also be done like getting title for the external link and putting it as anchor text, if its not given, but not yet

      this.save(callback);
      console.log("####### validatedSave Working #########");
  };

  var findById = function(postId, callback) {
    Post.findOne({ _id: postId }, callback);
  }

  var findByIdPopulated = function(postId, callback) {
    Post
    .findOne({_id:postId})
    .populate('_author')
    .exec(function(err, post){
      callback(post);
      // if (err)
      //   return handleError(err);
    });
  }

  var canEdit = function(postId, userId, callback) {
    Post.findOne({ _id: postId }, function(err, doc){
      if (err || !doc){
        callback(err, doc)
      } else {
        // #FEATURE can others conditions here
        if (doc._author == userId) {
          callback(err, doc);
        } else {
          callback(new Error("Not the Author"), null);
        }
      }
    }); 
  }

  var getPostNamePopulated = function(postId, fields, callback) {
    query = Post.findOne({ _id: postId });

    for(var i = 0; i < fields.length; ++i){
      query = query.populate(fields[i], 'name');
    }

    query.exec(callback);
  }

  var getRandomPosts = function(num, callback) {
    if (!num){
      callback(null, null)
      return;
    }

    models.PublicCounter.getCurrSequence(Post.modelName, function(err, doc){
      if (err || !doc) {
        callback(err, doc)
        return;
      }
      var randomLimit = doc.seq;
      var randomArr = [];
      var query;

      if (randomLimit > num * 2) {
        while(randomArr.length < num){
          var r = Math.floor((Math.random() * randomLimit));
          if (randomArr.indexOf(r) == -1){
            randomArr.push(r);
          }
        }
        query = Post.find({ _id: {$in : randomArr} }, {content_title: 1, permalink: 1}).limit(num);
      } else {
        query = Post.find({}, {content_title: 1, permalink: 1}).limit(num);
      }
      query.exec(callback);  
    })    
    
  }

  var getPostPopulated = function(postId, pop_fields, callback) {
    query = Post.findOne({ _id: postId });

    for(key in pop_fields){
      query = query.populate(key, pop_fields[key]);
    }

    query.exec(callback);
  }

  // #TODO this is not a generic function, make it so, right now it just populates the comments' author' name and img_icon_url as hard coded without proper params
  var getPostPopulatedNested = function(postId, pop_fields, callback) {
    query = Post.findOne({ _id: postId }).lean();

    for(key in pop_fields){
      query = query.populate(key, pop_fields[key]);
    }

    query.exec(function(err, doc) {

      if (err || !doc){
        callback(err, doc);  
      } else {
        opts = {
          path: "_author",
          select: "name fullname img_icon_url url_name",
          // options: {limit: 2},
        };

        Post.populate(doc._comments, opts, function(err, comment_docs){
          doc._comments = comment_docs;
          // console.log(doc._comments);

          callback(err, doc);
        });
      }
    });
  }

  var resave = function(postId, callback){
    findById(postId, function(err, doc){
      if (err || !doc)
        callback(err, doc)
      else
        doc.save(callback);
    })
  }

  var getPostPopulatedNested1 = function(postId, pop_fields, callback) {
    query = Post.findOne({ _id: postId }).lean();

    for(key in pop_fields){
      query = query.populate(key, pop_fields[key]);
    }

    query.exec(function(err, doc) {

      if (err || !doc){
        callback(err, doc);  
      } else {
        opts = {
          path: "_author",
          select: "name fullname level img_icon_url url_name",
          // options: {limit: 2},
        };

        Post.populate(doc._comments, opts, function(err, comment_docs){
          doc._comments = comment_docs;
          // console.log(doc._comments);
          Post.populate(doc._answers, opts, function(err, answer_docs){
            // doc._answers = answer_docs;
            doc._answers = answer_docs.sort(function(a,b){
              return b.vote_count - a.vote_count;
            });
            // console.log(doc._answers);
            callback(err, doc);
          });
        });
      }
    });
  }

  var getPostCommentsPopulatedNested = function(postId, callback) {
    
    this.getPostPopulated(postId, {
      "_comments": "content_text _author anon created_at updated_at",
      }, function(err, doc) {
        if (err || !doc){
          callback(err, doc);  
        } else {
          opts = {
            path: "_author",
            select: "name fullname img_icon_url url_name",
            // options: {limit: 2},
          };

          Post.populate(doc._comments, opts, function(err, comment_docs){
            doc._comments = comment_docs;
            // console.log(doc._comments);

            // callback(err, comment_docs);
            callback(err, doc);
          });
        }
      });

    // query = Post.findOne({ _id: postId }).lean();

    // for(key in pop_fields){
    //   query = query.populate(key, pop_fields[key]);
    // }

    // query.exec(function(err, doc) {

      // if (err || !doc){
      //   callback(err, doc);  
      // } else {
      //   opts = {
      //     path: "_author",
      //     select: "name fullname img_icon_url",
      //     // options: {limit: 2},
      //   };

      //   Post.populate(doc._comments, opts, function(err, comment_docs){
      //     doc._comments = comment_docs;
      //     // console.log(doc._comments);

      //     callback(err, doc);
      //   });
      // }
    // });
  }

  // var viewPost = function(postId, pop_fields, userId, callback) {
  //   getPostPopulated(postId, pop_fields, function(err, doc){

  //     callback(err, doc);

  //     // This code runs after the function callback is being called. the below code does not return back to anything

  //     if (userId && !err && doc) {
  //       if (doc.meta_info.viewers.indexOf(userId) == -1){
  //         doc.meta_info.viewers.push(userId);
  //         doc.save();
  //       }
  //     }

  //   });

  // }

  var findByPubId = function(postPubId, callback) {
    Post.findOne({pub_id:postPubId}, function(err, post) {
      callback(err, post);
    });
  }

  var findByPubIdPopulated = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate('_author')
    .exec(function(err, post){
      callback(err, post);
      // if (err)
      //   return handleError(err);
    });
  }

  var findByPubIdAuthorPopulated = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate('_author.id')
    .exec(function(err, post){
      callback(err, post);
      // if (err)
      //   return handleError(err);
    });
  }

  var findByPubIdArgPopulated = function(postPubId, populateField, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate(populateField)
    .exec(function(err, post){
      callback(err, post);
      // if (err)
      //   return handleError(err);
    });
  }

  /*

  */
  var findByPubIdArgSelectedPopulated = function(postPubId, populateField, selectFields, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate({
      path: populateField,
      select: selectFields,
    })
    .exec(function(err, post){
      callback(err, post);
      // if (err)
      //   return handleError(err);
    });
  }

  var findByPubIdCommentsPopulated = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    // .populate('_author')
    .populate('_comments')
    .exec(function(err, post){
      callback(err, post);
      // if (err)
      //   return handleError(err);
    });
  }

  var findByIdAuthorCommentsPopulated = function(postId, callback) {
    Post
    .findOne({_id:postId})
    .populate('_author')
    .populate('_comments')
    // .sort({_id: -1})
    .exec(function(err, post){
      callback(err, post);
      // if (err)
      //   return handleError(err);
    });
  }

  var findByPubIdAuthorCommentsPopulated1 = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate('_author')
    // .populate('_comments')
    // .populate('_comments._author.id')
    .exec(function(err, post){
      // if (err)
      //   return handleError(err);

      var resu = post.toObject();
      console.log(resu);
      // resu._comments = []
      new_comments = []
      for(var i = 0; i < post._comments.length; ++i){
        models.Comment.Model.findOne({_id: post._comments[i]})
        .populate('i_author')
        .exec(function(err, comm){
          console.log("commcommcommcommcommcommcommcommcomm")
          console.log(comm)
          console.log("commcommcommcommcommcommcommcommcomm")
          new_comments.push(comm)
        })
      }
      resu._comments = new_comments;

      console.log("resuresuresuresuresuresuresuresuresuresuresuresuresuresuresuresu")
      console.log(resu)
      console.log("resuresuresuresuresuresuresuresuresuresuresuresuresuresuresuresu")

      callback(err, resu);
      // post.populate('_comments._author.id', callback);

    });
  }

  var findByPubIdAuthorCommentsPopulated2 = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate('_author')
    .populate('_comments')
    // .populate('_comments.i_author')
    .exec(function(err, post){
      // if (err)
      //   return handleError(err);

      var resu = post.toObject();
      console.log(resu);
      // resu._comments = []
      new_comments = []
      for(var i = 0; i < post._comments.length; ++i){
        models.Comment.Model.findOne({_id: post._comments[i]})
        .populate('i_author')
        .exec(function(err, comm){
          console.log("commcommcommcommcommcommcommcommcomm")
          console.log(comm)
          console.log("commcommcommcommcommcommcommcommcomm")
          new_comments.push(comm)
        })
      }
      resu._comments = new_comments;

      callback(err, resu);

      // callback(err, post);
      // post.populate('_comments._author.id', callback);

    });
  }

 
  // utility functions

  var getAuthorId = function(postPubId, callback) {
    Post.findOne({pub_id:postPubId}, function(err, post){
      if (err || !post)
        callback(err)
      else
        callback(err, post._author);
    });
  }

  var getAuthorInfo = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate('_author')
    .exec(function(err, post){
      // if (err) return handleError(err);
      callback(err, { 
        name: post._author.name,
        email: post._author.email,
        last_seen: post._author.last_seen,
        img_icon_url: post._author.img_icon_url,
        });
    });
  }

  var getAuthor = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate('_author')
    .exec(function(err, post){
      // if (err) return handleError(err);
      callback(err, post._author);
    });
  }

  var getComments = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
    .populate('_comments')
    .exec(function(err, post){
      // if (err) return handleError(err);
      callback(err, post._comments);
    });
  }

  // #TODO#DONE implement this function
  var addComment = function(postId, commentId, callback) {
    console.log("addComment called for post and comment ids:", postId, commentId)
    console.log(commentId);
    Post.findOne({_id: postId}, function(err, post_doc){
      if (err || !post_doc){
        callback(err, post_doc)
        return;
      }
      // post_doc._comments.push(commentId);
      if( post_doc._comments.indexOf(commentId) == -1){
        post_doc._comments = [commentId].concat(post_doc._comments);
        post_doc.save(callback);
      } else {
        callback(err, post_doc);
      }
      
    });
  }

  var addAnswer = function(postId, answerId, callback) {
    console.log("addAnswer called for _id:", postId, answerId)
    console.log(answerId);
    Post.findOne({_id:postId}, function(err, post_doc){
      if (err || !post_doc){
        callback(err, post_doc)
        return;
      }
      // post_doc._answers.push(answerId);
      if( post_doc._answers.indexOf(answerId) == -1){
        post_doc._answers = [answerId].concat(post_doc._answers);
        post_doc.save(callback);
      } else {
        callback(err, post_doc);
      }
      
    });
  }

  var addAnswererAndAnswer = function(postId, answerId, answerAuthorId, callback) {
    console.log("addAnswer called for questionId, answerId and answerAuthorId:", postId, answerId, answerAuthorId)
    Post.findOne({_id:postId}, function(err, post_doc){
      if (err || !post_doc){
        callback(err, post_doc)
        return;
      }
      if (post_doc._answerers.indexOf(answerAuthorId) == -1){
        post_doc._answerers = [answerAuthorId].concat(post_doc._answerers);
        if( post_doc._answers.indexOf(answerId) == -1){
          post_doc._answers = [answerId].concat(post_doc._answers);
        }
        post_doc.save(callback);
      } else {
        callback(new Error("User already posted an answer for this question"), null);
      }

    });
  }

  var checkAnswererForQuestion = function(postId, answerAuthorId, callback) {
    console.log("inside checkAnswererForQuestion");

    Post.findOne({_id:postId}, function(err, post_doc){
      if (err || !post_doc){
        callback(err, post_doc)
        return;
      }

      if (post_doc._answerers.indexOf(answerAuthorId) == -1){
        callback(err, post_doc)
      } else {
        callback(new Error("Cannot Post new Answer for this question, Already Posted."), null);
      }

    });
  }

  // var register = function(email, password, firstName, lastName, verificationUrl, callback) 
  
  var createPost = function(postObj, callback) {
    console.log("in createPost function for:", Post.modelName);

    // #TODO#DONE #BUG "Post" should get replaced by Model name/Collection name. must me some way to get it from the model i.e.. Post itself #CHECK
    models.PublicCounter.getNextSequence(Post.modelName, function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      console.log("got next seq number for post", Post.modelName)

      if (!seq){
        console.log("Cant get seq for:", Post.modelName);
        callback(new Error("Serial number for Pubic id not initialized."), null);
      }

      postObj._id = seq;
      // if (Post.modelName == "Question"){
      //   postObj._id = seq;
      // } else {
      //   postObj.pub_id = seq;  
      // }

      var post = new Post(postObj);
      post.validatedSave(callback);
      // post.save(callback);

    });

  }

  // // diff on basic varibel types, string, number, boolean etc...
  // // #TODO#DONE implement this function
  // var basicDiff = function(a, b) {

  // }

  var createObjPatch = function(fileId, obj1, obj2, diff_fields, callback) {
    // do the diff and put the results in patchObj
    // diff_fields is [string], which are the fields on which to take the diff
    patchObj = {};
    for (var i = 0; i < diff_fields.length; ++i){
      key = diff_fields[i];
      
      if (typeof(obj1[key]) == undefined || obj1[key] == undefined || obj1[key] == null)
        obj1[key] = "";
        
      if (typeof(obj2[key]) == undefined || obj2[key] == undefined || obj2[key] == null)
        continue;

      if (obj1[key] == obj2[key])
        continue;

      // typecasting to string will happen inside this function
      // patchObj[key] = jsdiff.createPatch(fileId, obj1[key], obj2[key]);
      patchObj[key] = jsdiff.createPatch(fileId, JSON.stringify(obj1[key]), JSON.stringify(obj2[key]));
    }
    callback(null, patchObj);
  }

  var applyObjPatch = function(oldObj, patchObj, callback) {
    newObj = {};
    patchObj_keys = Object.keys(patchObj);

    for (var i = 0; i < patchObj_keys.length; ++i){
      key = patchObj_keys[i];

      newObj[key] = jsdiff.applyPatch(oldObj[key], patchObj[key]);
    }
    callback(null, newObj);
  }

  var getObjVersion = function(postPubId, version_num, callback) {
    // #TODO implement this function
    // find the post with postPubId
    // incremently apply patch till version_num from the edit_hist_diff_arr
  }



  // #TODO#DONE have to make is applicable for kinds of posts
  var updatePost = function(postId, userId, postObj, edit_summary, diff_fields, callback) {
    // if (VIN_DEBUG) 
    console.log("inside updatePost function for:", Post.modelName, postId);

    // console.log(postObj);

    this.findById(postId, function(err, post_doc){
      if (err || !post_doc){
        callback(err, null);
        return;
      }

      if (!AccessControl.postEditPermission(post_doc, userId)){
        callback(new Error("Permission Denied, Cannot Update this Post"), null);
        return;
      }

      createObjPatch(Post.modelName+"_"+postId, post_doc, postObj, diff_fields, function(err, patch){

        patch.edit_meta = {}
        patch.edit_meta.edit_summary = edit_summary;
        patch.edit_meta.submitted = Date.now();

        post_doc.edit_hist_diff_arr.push(patch);
         
        // post_doc.save(function(err, saved_post_doc) {
        //   callback(err, saved_post_doc);
        // });

        // #TODO#DONE update the post entry with the newest edit enrty saved
        // console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(postObj);

        keys = Object.keys(postObj);
        for (var i = 0; i < keys.length; ++i) {
          key = keys[i];
          post_doc[key] = postObj[key];
        }
        post_doc.validatedSave(callback);
        // post_doc.save(function(err, saved_post_doc){
        //   callback(err, saved_post_doc);
        // });
      });
    });
  }

  var editPost = function(postId, userId, postObj, diff_fields, callback) {
    // if (VIN_DEBUG) 
    console.log("in editPost function for:", Post.modelName, postId);

    Post.findOne({_id: postId}, function(err, post_doc){
      if (err || !post_doc){
        callback(err, null);
        return;
      }

      if (!AccessControl.postEditPermission(post_doc, userId)){
        callback(new Error("Permission Denied, Cannot Edit this Post"), null);
        return;
      }

      keys = Object.keys(postObj);
      for (var i = 0; i < keys.length; ++i) {
        key = keys[i];
        post_doc[key] = postObj[key];
      }

      post_doc.meta_info.edits += 1;
      post_doc.validatedSave(callback);
      // post_doc.save(callback);
    })
  }

  var getModelbyName = function(name) {
    for (i in models){
      if (typeof(models[i]) === 'object' && models[i].Model){
        if (name === models[i].Model.modelName){
          return models[i];
        }
      }
    }
    return null;
  }

  var removeCommentRef = function(postId, commentId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){
      if (err){
        callback(err, null);
        return;
      }

      if (!post_doc){
        callback(null, true);
        return;
      }

      var commentId_idx = post_doc._comments.indexOf(commentId);
      if(commentId_idx != -1) {
        post_doc._comments.splice(commentId_idx, 1);
        post_doc.save(callback);
      } else {
        callback(null, true)
      }
    });
  }

  var removeAnswerRef = function(postId, answerDoc, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){
      if (err){
        callback(err, null);
        return;
      }

      if (!post_doc){
        callback(null, true);
        return;
      }

      var answerId_idx = post_doc._answers.indexOf(answerDoc._id);
      var answererId_idx = post_doc._answerers.indexOf(answerDoc._author);
      if((answerId_idx != -1) && (answererId_idx != -1)) {
        if (answerId_idx != -1)
          post_doc._answers.splice(answerId_idx, 1);
        if (answererId_idx != -1)
          post_doc._answerers.splice(answererId_idx, 1);

        post_doc.save(callback);
      } else {
        callback(null, true)
      }
    });
  }

  var removeRef = function(parentModelName, parentPostId, childModelName, childPostDoc, callback) {

    var childPostId = childPostDoc._id;

    if (!parentModelName || !parentPostId) {
      callback(null, true);
      return;
    }

    var postModel = getModelbyName(parentModelName);
    if (postModel == null) {
      callback(null, true);
      return;
    }

    if ((childModelName == "Comment") && (childPostId)){
      postModel.removeCommentRef(parentPostId, childPostId, callback);
    } 
    else if ((childModelName == "Answer") && (childPostDoc)){
      postModel.removeAnswerRef(parentPostId, childPostDoc, callback);
    }
    else{
      callback(null, true);
    }

  }

  var makeDeleteModelName = function(name) {
    return "d"+name;
  }

  var deletePost = function(postId, userId, callback) {
    // if (VIN_DEBUG) 
    console.log("in deletePost function for:", Post.modelName, postId);

    var post_parent_name = "";
    var post_parent_id = 0;


    Post.findOne({_id: postId}, function(err, post_doc){
      if (err){
        callback(err, null);
        return;
      }

      if (!post_doc){
        callback(null, true);
        return; 
      }

      if (!AccessControl.postAdminPermission(post_doc, userId)){
        callback(new Error("Permission Denied, Cannot Delete this Post"), null);
        return;
      }

      if (Post.modelName == "Comment"){
        post_parent_name = post_doc._parent_name;
        post_parent_id = post_doc._parent_id;
      }

      if (Post.modelName == "Answer"){
        post_parent_name = "Question";
        post_parent_id = post_doc._question;
      }

      removeRef(post_parent_name, post_parent_id, Post.modelName, post_doc, function(err, doc){
        if (err || !doc){
          callback(err, doc);
          return;
        }

        // associations are moved, now safe to shift the post from primary to deleted collection.

        var deletePostModelName = makeDeleteModelName(Post.modelName);
        var deletePostModel = getModelbyName(deletePostModelName);

        if (deletePostModel == null) {
          callback(new Error("delete model or collection not found"), null);
          return;
        }

        // #TODO#DONE bring up auxillary collection for deleted content and make an entry in it, for post_doc document

        var toDelete = new deletePostModel.Model(post_doc);
        toDelete.save(function(err, deleted_post) {
          if (err || !deleted_post){
            callback(new Error("cannot delete document"), null);
            return;
          }
          // #TODO#DONE in the callback of its save, delete the actual doc and return in its callback
          post_doc.remove(callback)
        });
      });

      // keys = Object.keys(postObj);
      // for (var i = 0; i < keys.length; ++i) {
      //   key = keys[i];
      //   post_doc[key] = postObj[key];
      // }

      // post_doc.meta_info.edits += 1;
      // post_doc.save(callback);
    })
  }




  var getPostsByTime = function(callback) {
    Post.find().sort({
      _id: -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeLimitCount = function(limit, callback) {
    Post.find().sort({
      _id: -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeSkipLimit = function(skip, limit, callback) {
    Post.find().sort({
      _id: -1,
    }).skip(skip).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsById = function(lastPostId, limit, callback) {
    Post.find( {_id: {$gt: lastPostId}} )
        .sort({ _id: -1 })
        .limit(limit)
        .exec(function(err, docs){
          callback(err, docs);
    });
  }

  var getPostsPopulatedById = function(lastPostId, limit, pop_fields, callback) {
    // query = Post.find( {_id: {$gt: lastPostId}} )
    query = Post.find( {_id: {$lt: lastPostId}} )
      .lean()
      .sort({ _id: -1 })
      .limit(limit);

    for(key in pop_fields){
      query = query.populate(key, pop_fields[key]);
    }

    query.exec(function(err, docs){
      callback(err, docs);
    });
  }

  var getPostsPopulatedByActivity = function(lastPostId, limit, pop_fields, callback) {

    var ss = function(lastUpdated, cb) {

      criteria = { $or: [
        {updated_at: {$lt: lastUpdated}},
        {
          updated_at: lastUpdated,
          _id: {$lt: lastPostId}
        }
        ] 
      }

      query = Post.find(criteria)
        .lean()
        .sort({ updated_at: -1, _id: -1 })
        .limit(limit);
        // .limit(10);

      for(key in pop_fields){
        query = query.populate(key, pop_fields[key]);
      }

      query.exec(function(err, docs){
        cb(err, docs);
      });
    };


    if (lastPostId == 10000000000){
      // lastUpdated = 1401518903378000;
      lastUpdated = new Date(1401518903378000);
      ss(lastUpdated, callback)
    } else {
      Post.findOne( {_id: lastPostId}, function(err, last_post_doc) {

        if (err || !last_post_doc){
          callback(err, last_post_doc);
          return;
        }

        lastUpdated = last_post_doc.updated_at;
        ss(lastUpdated, callback)
      });
    }
  }

  var getPostsPopulatedByVotes = function(lastPostId, limit, pop_fields, callback) {

    var ss = function(lastPostVoteCount, cb) {
      // #TODO#DONE complete this

      // criteria = {vote_count: {$lte: lastPostVoteCount}};

      // criteria = { $or: [
      //   { vote_count: {$lt: lastPostVoteCount} },
      //   {
      //     $and: [
      //       { vote_count: lastPostVoteCount },
      //       { _id: {$lt: lastPostId} }
      //     ]
      //   }
      //   ]
      // }

      // console.log("lastPostVoteCount:", lastPostVoteCount)
      // console.log("lastPostId:", lastPostId)

      criteria = { $or: [
        {vote_count: {$lt: lastPostVoteCount}},
        {
          vote_count: lastPostVoteCount,
          _id: {$lt: lastPostId}
        }
        ] 
      }

      query = Post.find(criteria)
        .lean()
        .sort({ vote_count: -1, _id: -1 })
        .limit(limit);
        // .limit(10);

      for(key in pop_fields){
        query = query.populate(key, pop_fields[key]);
      }

      query.exec(function(err, docs){
        cb(err, docs);
      });
    };


    if (lastPostId == 10000000000){
      lastPostVoteCount = 10000000000;
      ss(lastPostVoteCount, callback)
    } else {
      Post.findOne( {_id: lastPostId}, function(err, last_post_doc) {

        if (err || !last_post_doc){
          callback(err, last_post_doc);
          return;
        }

        lastPostVoteCount = last_post_doc.vote_count;
        ss(lastPostVoteCount, callback)
      });
    }
  }

  var getUnansweredPostsPopulatedByVotes = function(lastPostId, limit, pop_fields, callback) {

    var ss = function(lastPostVoteCount, cb) {
      // #TODO#DONE complete this

      // criteria = {vote_count: {$lte: lastPostVoteCount}};

      // criteria = { $or: [
      //   { vote_count: {$lt: lastPostVoteCount} },
      //   {
      //     $and: [
      //       { vote_count: lastPostVoteCount },
      //       { _id: {$lt: lastPostId} }
      //     ]
      //   }
      //   ]
      // }

      criteria = { $or: [
        { vote_count: {$lt: lastPostVoteCount},
          _answers: {$size: 0}
        },
        {
          vote_count: lastPostVoteCount,
          _id: {$lt: lastPostId},
          _answers: {$size: 0}
        }
        ]
      }

      query = Post.find(criteria)
        .lean()
        .sort({ vote_count: -1, _id: -1 })
        .limit(limit);
        // .limit(10);

      for(key in pop_fields){
        query = query.populate(key, pop_fields[key]);
      }

      query.exec(function(err, docs){
        cb(err, docs);
      });
    };


    if (lastPostId == 10000000000){
      lastPostVoteCount = 10000000000;
      ss(lastPostVoteCount, callback)
    } else {
      Post.findOne( {_id: lastPostId}, function(err, last_post_doc) {

        if (err || !last_post_doc){
          callback(err, last_post_doc);
          return;
        }

        lastPostVoteCount = last_post_doc.vote_count;
        ss(lastPostVoteCount, callback)
      });
    }
  }

  var getPostsPopulatedByAnswerCount = function(lastPostId, limit, pop_fields, callback) {

    var ss = function(lastPostAnswerCount, cb) {
      // #TODO complete this

      criteria = { $or: [
        {_answers: {$size: {$lt: lastPostAnswerCount, $gt: 0}}},
        {
          _answers: {$size: lastPostAnswerCount},
          _id: {$lt: lastPostId}
        }
        ] 
      }

      query = Post.find(criteria)
        .lean()
        // #TODO
        // .sort({ _answers.length: -1, _id: -1 })
        .sort({ _id: -1 })
        .limit(limit);
        // .limit(10);

      for(key in pop_fields){
        query = query.populate(key, pop_fields[key]);
      }

      query.exec(function(err, docs){
        cb(err, docs);
      });
    };


    if (lastPostId == 10000000000){
      lastPostVoteCount = 10000000000;
      ss(lastPostVoteCount, callback)
    } else {
      Post.findOne( {_id: lastPostId}, function(err, last_post_doc) {

        if (err || !last_post_doc){
          callback(err, last_post_doc);
          return;
        }

        lastPostAnswerCount = last_post_doc._answers.length;
        if (lastPostAnswerCount > 0)
          ss(lastPostVoteCount, callback)
        else
          callback(new Error("No more content found"), null);
      });
    }
  }

  // var getPostPopulatedNested = function(postId, pop_fields, callback) {
  //   query = Post.findOne({ _id: postId }).lean();

  //   for(key in pop_fields){
  //     query = query.populate(key, pop_fields[key]);
  //   }

  //   query.exec(function(err, doc) {

  //     if (err || !doc){
  //       callback(err, doc);  
  //     } else {
  //       opts = {
  //         path: "_author",
  //         select: "name fullname img_icon_url",
  //         // options: {limit: 2},
  //       };

  //       Post.populate(doc._comments, opts, function(err, comment_docs){
  //         doc._comments = comment_docs;
  //         // console.log(doc._comments);

  //         callback(err, doc);
  //       });
  //     }
      
  //   });
  // }


  var getPostsByTimeQuery = function(objId, callback) {
    Post.find({
      _id: {$lt: objId},
    }).sort({
      _id: -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeQueryLimit = function(objId, limit, callback) {
    Post.find({
      _id: {$lt: objId},
    }).sort({
      _id: -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  // Getting posts by their value or upvotes [Start]

  var getPostsByValue = function(callback) {
    Post.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueLimitCount = function(limit, callback) {
    Post.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueSkipLimit = function(skip, limit, callback) {
    Post.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).skip(skip).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueQuery = function(lastValue, callback) {
    Post.find({
      'meta_info.value': {$lt: lastValue},
      // 'meta_info.upvotes': {$lt: lastValue},
    }).sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueQueryLimit = function(objId, limit, callback) {
    Post.find({
      'meta_info.value': {$lt: lastValue},
      // 'meta_info.upvotes': {$lt: lastValue},
    }).sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  // Getting posts by their value or upvotes [End]

  var upvote = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){
      
      if (err || !post_doc){
        callback(err, post_doc);
        return;
      }
      // get index of userId in downvoters array
      userId_dnidx = post_doc.meta_info.downvoters.indexOf(userId)
      if (userId_dnidx > -1){
        // userId is in downvoters array
        // remove it from the downvoters array
        post_doc.meta_info.downvoters.splice(userId_dnidx, 1)
      }
      // userId is not in downvoters array, nothing to do

      // get index of userId in upvoters array
      userId_upidx = post_doc.meta_info.upvoters.indexOf(userId);
      
      if (userId_upidx == -1){
        // userId is not in upvoters array, add it
        post_doc.meta_info.upvoters.push(userId);
      } else {
        // userId is already in upvoters array
        // do UNDO, remove it from the upvoters array
        post_doc.meta_info.upvoters.splice(userId_upidx, 1)
      }

      post_doc.vote_count = post_doc.meta_info.upvoters.length - post_doc.meta_info.downvoters.length;
      post_doc.save(callback);
    })
  }

  var downvote = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){
      
      if (err || !post_doc){
        callback(err, post_doc);
        return;
      }
      // get index of userId in upvoters array
      userId_upidx = post_doc.meta_info.upvoters.indexOf(userId);
      if (userId_upidx > -1){
        // userId is in upvoters array
        // remove it from the upvoters array
        post_doc.meta_info.upvoters.splice(userId_upidx, 1)
      }
      // userId is not in upvoters array, nothing to do

      // get index of userId in downvoters array
      userId_dnidx = post_doc.meta_info.downvoters.indexOf(userId)
      if (userId_dnidx == -1){
        // userId is not in downvoters array, add it
        post_doc.meta_info.downvoters.push(userId);
      } else {
        // userId is already in downvoters array
        // do UNDO, remove it from the downvoters array
        post_doc.meta_info.downvoters.splice(userId_dnidx, 1)
      }
      post_doc.vote_count = post_doc.meta_info.upvoters.length - post_doc.meta_info.downvoters.length;
      post_doc.save(callback);
    })
  }

  var favourite = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      // get index of userId in favors array
      userId_favidx = post_doc.meta_info.favors.indexOf(userId)
      if (userId_favidx == -1){
        // userId is not in favors array, add it
        post_doc.meta_info.favors.push(userId);
        post_doc.save(callback);
      } else {
        // userId already in favors array, UNDO, remove it
        post_doc.meta_info.favors.splice(userId_favidx, 1)
        post_doc.save(callback);
      }
    })
  }

  var follow = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      // get index of userId in followers array
      userId_folidx = post_doc.meta_info.followers.indexOf(userId)
      if (userId_folidx == -1){
        // userId is not in followers array, add it
        console.log("not here, adding")
        post_doc.meta_info.followers.push(userId);
        post_doc.save(callback);
      } else {
        // userId already in followers array, UNDO, remove it
        console.log("here, removing")
        post_doc.meta_info.followers.splice(userId_folidx, 1)
        post_doc.save(callback);
      }
    })
  }

  var makeAnon = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      if (userId == post_doc._author){
        if (post_doc.anon){
          callback(err, post_doc);
        } else {
          post_doc.anon = true;
          post_doc.save(callback);
        }
      } else {
        callback(new Error("Not the Author"), null);
      }

    })
  }

  var removeAnon = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      if (userId == post_doc._author){
        if (post_doc.anon){
          post_doc.anon = false;
          post_doc.save(callback);
        } else {
          callback(err, post_doc);
        }
      } else {
        callback(new Error("Not the Author"), null);
      }
    })
  }

  var view = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      // get index of userId in viewers array
      userId_viewidx = post_doc.meta_info.viewers.indexOf(userId)
      if (userId_viewidx == -1){
        // userId is not in viewers array, add it
        post_doc.meta_info.viewers.push(userId);
        post_doc.save(callback);
      } else {
        // nothing to do
        callback(err, post_doc);
      }
    })
  }

  var acceptanswer = function(postId, userId, answerId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      if (err || !post_doc){
        callback(err, post_doc);
        return;
      }

      if (!AccessControl.postAdminPermission(post_doc, userId)){
        callback(new Error("Permission Denied, Cannot Admin this Post"), null);
        return;
      }

      if (!post_doc._accepted_answer) {
        post_doc._accepted_answer = answerId;
        post_doc.save(callback);
      } else {
        // an answer is already accepted, cannot do anything else;
        callback(new Error("Accepted Answer exists"), null);
      }

    })
  }

  var report = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      // #TODO implement this
      callback(err, post_doc);

      // get index of userId in viewers array
      // userId_viewidx = post_doc.meta_info.viewers.indexOf(userId)
      // if (userId_viewidx == -1){
      //   // userId is not in viewers array, add it
      //   post_doc.meta_info.viewers.push(userId);
      //   post_doc.save(callback);
      // } else {
      //   // userId already in viewers array, UNDO, remove it
      //   post_doc.meta_info.viewers.splice(userId_viewidx, 1)
      //   post_doc.save(callback);
      // }
    })
  }

  var share = function(postId, userId, callback) {
    Post.findOne({_id: postId}, function(err, post_doc){

      // #TODO implement this
      callback(err, post_doc);
      
      // get index of userId in viewers array
      // userId_viewidx = post_doc.meta_info.viewers.indexOf(userId)
      // if (userId_viewidx == -1){
      //   // userId is not in viewers array, add it
      //   post_doc.meta_info.viewers.push(userId);
      //   post_doc.save(callback);
      // } else {
      //   // userId already in viewers array, UNDO, remove it
      //   post_doc.meta_info.viewers.splice(userId_viewidx, 1)
      //   post_doc.save(callback);
      // }
    })
  }

  var _postUpvalue = function(found_post, val, callback) {
    found_post.meta_info.value += val
    // found_post.meta_info.value += 1
    found_post.save(function(err, saved_post){
      callback(err, saved_post);
    })
  }

  var updateValue = function(postPubId, val, callback) {
    Post.findOne({pub_id: postPubId}, function(err, found_post){
      if (!found_post.meta_info){
        found_post.save(function(){
          // _postUpvote(found_post, callback);
          found_post.meta_info.value = val
          // found_post.meta_info.value += 1
          found_post.save(function(err, saved_post){
            callback(err, saved_post);
          })
        });
      } else {
        _postUpvalue(found_post, val, callback);
      }
    })
  }

  return {
    findById: findById,
    findByIdPopulated: findByIdPopulated,

    findByPubId: findByPubId,
    findByPubIdPopulated: findByPubIdPopulated,
    findByPubIdCommentsPopulated: findByPubIdCommentsPopulated,
    findByIdAuthorCommentsPopulated: findByIdAuthorCommentsPopulated,
    findByPubIdAuthorPopulated: findByPubIdAuthorPopulated,
    findByPubIdAuthorCommentsPopulated1:
      findByPubIdAuthorCommentsPopulated1,
    findByPubIdAuthorCommentsPopulated2:
      findByPubIdAuthorCommentsPopulated2,  

    getPostNamePopulated: getPostNamePopulated,
    getPostPopulated: getPostPopulated,
    getPostPopulatedNested: getPostPopulatedNested,
    getPostPopulatedNested1: getPostPopulatedNested1,
    
    getPostsById: getPostsById,
    getPostsPopulatedById: getPostsPopulatedById,
    getPostsPopulatedByActivity: getPostsPopulatedByActivity,
    getPostsPopulatedByVotes: getPostsPopulatedByVotes,
    getUnansweredPostsPopulatedByVotes:
      getUnansweredPostsPopulatedByVotes,
    getPostsPopulatedByAnswerCount: getPostsPopulatedByAnswerCount,

    canEdit: canEdit,

    // viewPost: viewPost,

    findByPubIdArgPopulated: findByPubIdArgPopulated,
    findByPubIdArgSelectedPopulated: findByPubIdArgSelectedPopulated,

    createPost: createPost,
    editPost: editPost,
    updatePost: updatePost,
    deletePost: deletePost,

    removeAnswerRef: removeAnswerRef,
    removeCommentRef: removeCommentRef,
    removeRef: removeRef,

    getPostsByTime: getPostsByTime,
    getPostsByTimeLimitCount: getPostsByTimeLimitCount,
    getPostsByTimeSkipLimit: getPostsByTimeSkipLimit,
    getPostsByTimeQuery: getPostsByTimeQuery,
    getPostsByTimeQueryLimit: getPostsByTimeQueryLimit,

    getRandomPosts: getRandomPosts,
    getPostsByValue: getPostsByValue,
    getPostsByValueLimitCount: getPostsByValueLimitCount,
    getPostsByValueSkipLimit: getPostsByValueSkipLimit,
    getPostsByValueQuery: getPostsByValueQuery,
    getPostsByValueQueryLimit: getPostsByValueQueryLimit,
    getPostCommentsPopulatedNested: getPostCommentsPopulatedNested,

    view: view,
    upvote: upvote,
    downvote: downvote,
    favourite: favourite,
    follow: follow,
    report: report,
    share: share,
    acceptanswer: acceptanswer,

    makeAnon: makeAnon,
    removeAnon: removeAnon,

    updateValue: updateValue,

    getAuthorId: getAuthorId,
    getAuthorInfo: getAuthorInfo,
    getAuthor: getAuthor,
    getComments: getComments,
    
    addComment: addComment,
    addAnswer: addAnswer,

    resave: resave,

    addAnswererAndAnswer: addAnswererAndAnswer,
    checkAnswererForQuestion: checkAnswererForQuestion,
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    Model: Post,
  }
}
