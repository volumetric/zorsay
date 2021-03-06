module.exports = function(config, mongoose, models, Post) {

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

  var getPostNamePopulated = function(postId, fields, callback) {
    query = Post.findOne({ _id: postId });

    for(var i = 0; i < fields.length; ++i){
      query = query.populate(fields[i], 'name');
    }

    // query.populate("_pro_cat", 'name');
    // query.populate("_ser_cat", 'name');
    // query.populate("_seller", 'name');

    query.exec(callback);
  }

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

  var findByPubIdAuthorCommentsPopulated = function(postPubId, callback) {
    Post
    .findOne({pub_id:postPubId})
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

  // #TODO implement this fucker #DONE
  var addComment = function(postPubId, commentId, callback) {
    console.log("addComment called for pub_id:", postPubId, commentId)
    console.log(commentId);
    Post.findOne({pub_id:postPubId}, function(err, post_doc){
      // post_doc._comments.push(commentId);
      post_doc._comments = [commentId].concat(post_doc._comments);
      post_doc.save(callback);
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
      if (Post.modelName == "Question"){
        postObj._id = seq;
      } else {
        postObj.pub_id = seq;  
      }

      var post = new Post(postObj);
      post.save(callback);

    });

  }

  // // diff on basic varibel types, string, number, boolean etc...
  // // #TODO#DONE implement this function
  // var basicDiff = function(a, b) {

  // }

  var createObjPatch = function(fileId, obj1, obj2, diff_fields, callback) {
    // do the diff and put the results in diffObj
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



  // #TODO #BUG have to make is applicable for kinds of posts
  var updatePost = function(postPubId, postObj, summary, callback) {
    // if (VIN_DEBUG) 
    console.log("inside updatePost function for:", Post.modelName, postPubId);

    console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
    console.log(postObj);

    diff_fields = ["review_text","reviewText","anonymous","anon","location","otd_rating","pad_rating","pri_rating","pro_rating","eos_rating","rrp_rating","csu_rating","all_rating","otd_comment","pad_comment","pri_comment","pro_comment","eos_comment","rrp_comment","csu_comment"];

    this.findByPubId(postPubId, function(err, post_doc){
      if (err || !post_doc){
        callback(err, null);
        return;
      }

      createObjPatch("sx_"+postPubId, post_doc, postObj, diff_fields, function(err, patch){
        post_doc.edit_hist_diff_arr.push(patch);
        
        post_doc.edit_hist_diff_arr_meta.push({
          edit_summary: summary,
          submitted: Date.now(),
        });

        // post_doc.save(function(err, saved_post_doc) {
        //   callback(err, saved_post_doc);
        // });

        // #TODO#DONE update the post entry with the newest edit enrty saved
        console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");
        console.log(postObj);

        keys = Object.keys(postObj);
        for (var i = 0; i < keys.length; ++i) {
          key = keys[i];
          post_doc[key] = postObj[key];
        }
        post_doc.save(function(err, saved_post_doc){
          callback(err, saved_post_doc);
        });
      });
    });
  }

  var editPost = function(postPubId, postObj, callback) {
    if (VIN_DEBUG) console.log("in editPost function for:", Post.modelName, postPubId);

    Post.findOne({pub_id: postPubId}, function(err, post_doc){
      if (err || !post_doc){
        callback(err, null);
        return;
      }

      keys = Object.keys(postObj);
      for (var i = 0; i < keys.length; ++i) {
        key = keys[i];
        post_doc[key] = postObj[key];
      }

      post_doc.meta_info.edits += 1;

      post_doc.save(function(err, saved_post) {
        callback(err, saved_post);
      });

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

  var _postUpVote = function(found_post, callback) {
    found_post.meta_info.upvotes += 1
    // found_post.meta_info.value += 1
    found_post.save(function(err, saved_post){
      callback(err, saved_post);
    })
  }

  var _postDownVote = function(found_post, callback) {
    found_post.meta_info.downvotes += 1
    // found_post.meta_info.value += 1
    found_post.save(function(err, saved_post){
      callback(err, saved_post);
    })
  }

  var upvote = function(postPubId, callback) {
    Post.findOne({pub_id: postPubId}, function(err, found_post){
      if (!found_post.meta_info){
        found_post.save(function(){
          // _postUpvote(found_post, callback);
          found_post.meta_info.upvotes = 1
          // found_post.meta_info.value += 1
          found_post.save(function(err, saved_post){
            callback(err, saved_post);
          })
        });
      } else {
        _postUpVote(found_post, callback);
      }
    })
  }

  var downvote = function(postPubId, callback) {
    Post.findOne({pub_id: postPubId}, function(err, found_post){
      if (!found_post.meta_info){
        found_post.save(function(){
          // _postUpvote(found_post, callback);
          found_post.meta_info.downvotes = 1
          // found_post.meta_info.value += 1
          found_post.save(function(err, saved_post){
            callback(err, saved_post);
          })
        });
      } else {
        _postDownVote(found_post, callback);
      }
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
    findByPubIdAuthorCommentsPopulated: findByPubIdAuthorCommentsPopulated,
    findByPubIdAuthorPopulated: findByPubIdAuthorPopulated,
    findByPubIdAuthorCommentsPopulated1:
      findByPubIdAuthorCommentsPopulated1,
    findByPubIdAuthorCommentsPopulated2:
      findByPubIdAuthorCommentsPopulated2,  

    getPostNamePopulated: getPostNamePopulated,

    findByPubIdArgPopulated: findByPubIdArgPopulated,
    findByPubIdArgSelectedPopulated: findByPubIdArgSelectedPopulated,

    createPost: createPost,
    updatePost: updatePost,
    editPost: editPost,

    getPostsByTime: getPostsByTime,
    getPostsByTimeLimitCount: getPostsByTimeLimitCount,
    getPostsByTimeSkipLimit: getPostsByTimeSkipLimit,
    getPostsByTimeQuery: getPostsByTimeQuery,
    getPostsByTimeQueryLimit: getPostsByTimeQueryLimit,

    getPostsByValue: getPostsByValue,
    getPostsByValueLimitCount: getPostsByValueLimitCount,
    getPostsByValueSkipLimit: getPostsByValueSkipLimit,
    getPostsByValueQuery: getPostsByValueQuery,
    getPostsByValueQueryLimit: getPostsByValueQueryLimit,

    upvote: upvote,
    downvote: downvote,
    updateValue: updateValue,

    getAuthorId: getAuthorId,
    getAuthorInfo: getAuthorInfo,
    getAuthor: getAuthor,
    getComments: getComments,
    addComment: addComment,
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    Model: Post,
  }
}
