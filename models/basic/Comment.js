module.exports = function(config, mongoose, models) {
  
  mongoose.set('debug', true);

  var byName = function(name) {
    for (i in models){
      if (typeof(models[i]) === 'object' && models[i].Model){
        if (name === models[i].Model.modelName){
          return models[i];
        }
      }
    }
  }

  var CommentSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},

    // created_at: {type: Date, required: true, default: Date.now },
    created_at: {type: Date },
    // updated_at: {type: Date, required: true, default: Date.now },
    updated_at: {type: Date },

    pub_id: { type: Number },

    // _author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },
    
    _author: 
    {
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },
      name: { 
        first: {type: String},
        last: {type: String},
      },
      img_icon_url: {type: String},
      pub_id: {type:Number},
    },

    i_author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },

    _upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],

    _flaggers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], 

    // #TODO this needs to be done in commentObj and should be done before calling createPost()
    // commentObj._parent = postInfo;
    _parent: {
      post_name: {type: String}, // name of the parent post collection: "Shopex", "Question", "Answer" or "Comment" #TODO put it an enum
      post_pub_id: {type: Number},  // pub_id of the post
    },

    // array of refs to Comments in Comment collection 
    _comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],

    comment_preview : {type: String},  //first 70 chars of the first nested comment, if any. reply field has to be true

    commentText: { type: String },

    permalink: {type: String},


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

      that = this;

      console.log(that._author.id);

      this.meta_info = {
        value: 1,                     //overall value of this post
        views: 1,                      //number of views (readers)
        upvotes: 1,                    //number of upvotes (upvoters)
        downvotes: 1,                    //number of upvotes (upvoters)
        edits: 0,                      //number of edits (versions) 
        flags: [],                     //number of flags raised, different types of flag counts
      };


      models.Account.Model.findOne({_id: that._author.id}, function(err, account_doc){
        console.log(account_doc);
        that._author.name = {}
        that._author.name.first = account_doc.name.first;
        that._author.name.last = account_doc.name.last;
        that._author.pub_id = account_doc.pub_id;
        that._author.img_icon_url = account_doc.img_icon_url;
        next();
      })  

    } else { 
      next();
    }

  });


  CommentSchema.post('save', function(comment_doc){

    console.log("@@@@@@@ $$$$$$$$$$$ inside post save for CommentSchema")

    // #TODO add this comment to the parent _comments array for refs
    // #TODO get the model from the db based only on the collection name

    // console.log(models);

    postModel = null;
    postModel = byName(comment_doc._parent.post_name);

    console.log(comment_doc._parent.post_name);
    console.log(postModel.Model.modelName);

    console.log(postModel);

    if (postModel !== null) {
      postModel.addComment(comment_doc._parent.post_pub_id, comment_doc, function(err, post_doc){
          console.log("comment added to the post in collection", comment_doc._parent.post_name, "with pub_id: ", comment_doc._parent.post_pub_id);
      });  
    }
    
  });

  var Comment = mongoose.model('Comment', CommentSchema);

  return Comment;
}
