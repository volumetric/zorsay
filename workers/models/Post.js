module.exports = function(config, mongoose, models, Post) {

  var jsdiff = require("diff");

  var findById = function(postId, callback) {
    Post.findOne({_id:postId}, function(err, post) {
      callback(post);
    });
  }

  var findByIdPopulated = function(postId, callback) {
    // Post.findOne({_id:postId}, function(err, post) {
    // callback(post);
    Post
    .findOne({_id:postId})
    .populate('_author')
    .exec(function(err, post){
      callback(post);
      // if (err)
      //   return handleError(err);
    });
    // });
  }

  var findByPubId = function(postPubId, callback) {
    Post.findOne({pub_id:postPubId}, function(err, post) {
      callback(err, post);
    });
  }

  var findByPubIdPopulated = function(postPubId, callback) {
    // Post.findOne({_id:postId}, function(err, post) {
    // callback(post);
    Post
    .findOne({pub_id:postPubId})
    .populate('_author')
    .exec(function(err, post){
      callback(err, post);
      // if (err)
      //   return handleError(err);
    });
    // });
  }

 
  // utility functions

  var getAuthorId = function(postPubId, callback) {
    Post.findOne({pub_id:postPubId}, function(err, post) {
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
    Post.findOne({pub_id:postPubId}, function(err, post_doc){
      post_doc._comments.push(commentId);
    });
  }

  // var register = function(email, password, firstName, lastName, verificationUrl, callback) 
  
  var createPost = function(postObj, callback) {
    console.log("in createPost function")

    models.PublicCounter.getNextSequence("Post", function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      if (!seq){
        console.log("Got No Sequence Number from counter collection");
        // throw error;
      }
      postObj.pub_id = seq;
      var post = new Post(postObj);
      
      post.save(function(err, saved_post) {
        callback(err, saved_post);
      });  
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



  var updatePost = function(postPubId, postObj, summary, callback) {
    console.log("inside updatePost function for post pub_id:", postPubId);

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


  var getPostsByTime = function(callback) {
    Post.find().sort({
      _id: -1,
      // created_at: 1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeLimitCount = function(limit, callback) {
    Post.find().sort({
      _id: -1,
      // created_at: 1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeSkipLimit = function(skip, limit, callback) {
    Post.find().sort({
      _id: -1,
      // created_at: 1,
    }).skip(skip).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeQuery = function(objId, callback) {
    Post.find({
      _id: {$lt: objId},
    }).sort({
      _id: -1,
      // created_at: 1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeQueryLimit = function(objId, limit, callback) {
    Post.find({
      _id: {$lt: objId},
    }).sort({
      _id: -1,
      // created_at: 1,
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



  // args will be bunch of key, val, alternatively given 
  // key should be according to the object inner structure, like for a nested key full key name from top level is expected
  // # means that the suffix is actually an index and prefix is an array and update has to be made on that index of the array
  // var updatePost = function() {
    
  // }

  // args will be bunch of key, val, alternatively given 
  // key is expected to be for MetaPost subdocument top level
  // # means that the suffix is actually an index and prefix is an array and update has to be made on that index of the array
  // var updateMetaPost = function() {

  // }

  // var AddMetaCount = function() {

  // }

  // var voteUpdate = function(val) {
  //   updateMetaPost("upvotes", val);    // #CHECK  this.updateMetaPost may be needed
  // }

  // var favUpdate = function(val) {
  //   updateMetaPost("favs", val);    // #CHECK  this.updateMetaPost may be needed
  // }

  // var editUpdate = function(val) {
  //   updateMetaPost("edits", val);    // #CHECK  this.updateMetaPost may be needed
  // }

  // var viewUpdate = function(val) {
  //   updateMetaPost("views", val);    // #CHECK  this.updateMetaPost may be needed
  // }

  // var valueUpdate = function(val) {
  //   updateMetaPost("value", val);    // #CHECK  this.updateMetaPost may be needed
  // }

  // var flagUpdate = function(flagType, val) {
  //   updateMetaPost("flags#"+flagType, val);    // #CHECK  this.updateMetaPost may be needed
  //   // # means that the suffix is actually an index and prefix is an array and update has to be made on that index of the array
  //   // this needs to be implemented in both @updateMetaPost and @updateMetaPost
  // }




  return {
    findById: findById,
    findByIdPopulated: findByIdPopulated,

    findByPubId: findByPubId,
    findByPubIdPopulated: findByPubIdPopulated,
    
    createPost: createPost,
    updatePost: updatePost,

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
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    Post: Post,
  }
}
