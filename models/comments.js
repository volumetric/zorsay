module.exports = function(config, mongoose, nodemailer) {
  var crypto = require('crypto');

  var CommentsSchema = new mongoose.Schema({
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
      {type: String}, // name of the parent post collection: "Shopex", "Question" or "Answer" #TODO put it an enum
      {type: Number},
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

  function rcomment_validator (comment) {
    return (comment.length <= 137);
  };

  function rating_validator (rating) {
    return (rating >= 0 && rating <= 5);
  };


  var Shopex = mongoose.model('Shopex', ShopexSchema);

  var findById = function(shopexId, callback) {
    Shopex.findOne({_id:shopexId}, function(err,doc) {
      callback(doc);
    });
  }

  var 

  return {
    findById: findById,
    register: register,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    login: login,
    Account: Account
  }
}
