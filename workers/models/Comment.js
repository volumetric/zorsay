module.exports = function(config, mongoose, models) {
  
  mongoose.set('debug', true);


  var CommentSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},

    // created_at: {type: Date, required: true, default: Date.now },
    created_at: {type: Date },
    // updated_at: {type: Date, required: true, default: Date.now },
    updated_at: {type: Date },

    pub_id: { type: Number },

    _author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },
    _upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],

    _flaggers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], 

    _parent: {
      post_name: {type: String}, // name of the parent post collection: "Shopex", "Question", "Answer" or "Comment" #TODO put it an enum
      post_pub_id: {type: Number},  // pub_id of the post
    },

    // array of refs to Comments in Comment collection 
    _comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    comment_preview : {type: String},  //first 70 chars of the first nested comment, if any. reply field has to be true

    commentText: { type: String },

    permalink: {type: String},

    edit_count: {type: Number},

    anon:  { type: Boolean },

    meta_info: {
      value: {type: Number},                    //overall value of this post
      views: {type: Number},                    //number of views (readers)
      upvotes: {type: Number},                    //number of upvotes (upvoters)
      downvotes: {type: Number},
      // followers: {type: Number},                    //number of followers (followers)
      favs: {type: Number},                    //number of favorites (bookmarkers) 
      edits: {type: Number},                    //number of edits (versions) 
      // editors: {type: Number},                    //number of editors (collaborators) 
      flags: [{type: Number}],                       //number of flags raised, different types of flag counts
      shared: [{type: Number}],                  // number of times shared on each of the social networks
    },

    reply: {type: Boolean},

    verified:  { type: Boolean },
    source: { type: String }, // if null or undefined, then orginated from the site itself

  }, { autoIndex: false });

  CommentSchema.pre('save', function(next){
    console.log("^^^^^^^^^^^ @@@@@@@ $$$$$$$$$$$ inside pre save for CommentSchema");

    this.updated_at = new Date;

    if ( !this.created_at ) {
      this.created_at = new Date;
    
      this.permalink = "/comment/"+this.pub_id;

      this.meta_info = {
        value: 1,                     //overall value of this post
        views: 1,                      //number of views (readers)
        upvotes: 1,                    //number of upvotes (upvoters)
        downvotes: 1,                    //number of upvotes (upvoters)
        edits: 1,                      //number of edits (versions) 
        flags: [],                     //number of flags raised, different types of flag counts
      };

    } // when created

    next();
  });


  CommentSchema.post('save', function(comment_doc){

    console.log("@@@@@@@ $$$$$$$$$$$ inside post save for CommentSchema")

    // #TODO add this comment to the parent _comments array for refs
    // #TODO get the model from the db based only on the collection name
    
    if (comment_doc._parent.post_name == "Shopex") {
      postModel .Shopex;
    } else if (comment_doc._parent.post_name == "Comment"){
      postModel = Comment;
    } else {
      postModel = null;
    }

    if (postModel !== null) {
      postModel.addComment(comment_doc._parent.post_pub_id, commment_doc._id, function(err, post_doc){
          console.log("comment added to the post in collection", comment_doc._parent.post_name, "with pub_id: ", comment_doc._parent.post_pub_id);
      });  
    }
    
  });

  var Comment = mongoose.model('Comment', CommentSchema);

  var findById = function(commentId, callback) {
    Comment.findOne({_id:commentId}, function(err, comment) {
      callback(comment);
    });
  }

  var findByIdPopulated = function(commentId, callback) {
    Comment
    .findOne({_id:commentId})
    .populate('_author')
    .exec(function(err, comment){
      callback(comment);
      // if (err)
      //   return handleError(err);
    });
    // });
  }

  var findByPubId = function(commentPubId, callback) {
    Comment.findOne({pub_id:commentPubId}, function(err, comment) {
      callback(err, comment);
    });
  }

  var findByPubIdPopulated = function(commentPubId, callback) {
    Comment
    .findOne({pub_id:commentPubId})
    .populate('_author')
    .exec(function(err, comment){
      callback(err, comment);
      // if (err)
      //   return handleError(err);
    });
    // });
  }

  var createPost = function(commentObj, postInfo, callback) {
    console.log("in createPost function for commentObj")

    models.PublicCounter.getNextSequence("Comment", function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      if (!seq){
        console.log("Got No Sequence Number from counter collection");
        // throw error;
      }
      commentObj.pub_id = seq;

      commentObj._parent = postInfo; 
      // postInfo: { post_name: {type: String}, post_pub_id: {type: Number} }

      var comment = new Comment(commentObj);
      
      comment.save(function(err, saved_comment) {
        callback(err, saved_comment);
      });  
    });
  }

  var updatePost = function(commentPubId, commentObj, callback) {
    console.log("in updatePost function for commentObj")

    Comment.findOne({pub_id: commentPubId}, function(err, comment_doc){

      comment_doc.commentText = commentObj.commentText;
      comment_doc.edit_count += 1;

      comment_doc.save(function(err, saved_comment) {
        callback(err, saved_comment);
      });

    })
  }

  var getAuthorId = function(commentPubId, callback) {
    Comment.findOne({pub_id:commentPubId}, function(err, comment) {
      callback(err, comment._author);
    });
  }


  var getAuthorInfo = function(commentPubId, callback) {
    Comment
    .findOne({pub_id:commentPubId})
    .populate('_author')
    .exec(function(err, comment){
      // if (err) return handleError(err);
      callback(err, { 
        name: comment._author.name,
        email: comment._author.email,
        last_seen: comment._author.last_seen,
        img_icon_url: comment._author.img_icon_url,
        });
    });
  }

  var getAuthor = function(commentPubId, callback) {
    Comment
    .findOne({pub_id:commentPubId})
    .populate('_author')
    .exec(function(err, comment){
      // if (err) return handleError(err);
      callback(err, comment._author);
    });
  }

  var getComments = function(commentPubId, callback) {
    Comment
    .findOne({pub_id:commentPubId})
    .populate('_comments')
    .exec(function(err, comment){
      // if (err) return handleError(err);
      callback(err, comment._comments);
    });
  }

  // #TODO implement this fucker #DONE
  var addComment = function(commentPubId, commentId, callback) {
    Comment.findOne({pub_id:commentPubId}, function(err, comment_doc){
      comment_doc._comments.push(commentId);
    });
  }


  return {
    findById: findById,
    findByIdPopulated: findByIdPopulated,

    findByPubId: findByPubId,
    findByPubIdPopulated: findByPubIdPopulated,
    
    createPost: createPost,
    updatePost: updatePost,
    // upvote: upvote,
    // downvote: downvote,
    // updateValue: updateValue,

    getAuthorId: getAuthorId,
    getAuthorInfo: getAuthorInfo,
    getAuthor: getAuthor,
    
    getComments: getComments,
    addComment: addComment,

    Model: Comment,
  }
}
