module.exports = function(config, mongoose, public_counter) {

  // Import models
  var models = {
    // PublicCounter: require('./PublicCounter')(config, mongoose),
    PublicCounter: public_counter,
  };

  mongoose.set('debug', true);

  var MetaPost = new mongoose.Schema({
    value: {type: Number},                    //overall value of this post
    views: {type: Number},                    //number of views (readers)
    upvotes: {type: Number},                    //number of upvotes (upvoters)
    // followers: {type: Number},                    //number of followers (followers)
    favs: {type: Number},                    //number of favorites (bookmarkers) 
    edits: {type: Number},                    //number of edits (versions) 
    // editors: {type: Number},                    //number of editors (collaborators) 
    flags: [{type: Number}],                       //number of flags raised, different types of flag counts
  })

  // Schema = mongoose.Schema;

  var PostDiffSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},

    pub_id: { type: Number },

    _author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },
    _upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],

    // // making array of array of account refs for diff types of flag raisers #CHECK #TODO
    _flaggers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], 

    review_text: { type: String },

    _seller: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true },
    

    // making array of ps_cat refs with multikey indexing on their ids #CHECK        
    // _pro_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCat', index: true }],
    _pro_cat: { type: [mongoose.Schema.Types.ObjectId], ref: 'ProductCat', index: true },

    // _pro: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true }],
    _pro: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', index: true },
    
    // _ser_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCat', index: true }],
    _ser_cat: { type: [mongoose.Schema.Types.ObjectId], ref: 'ServiceCat', index: true },
    
    // _ser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', index: true }],
    _ser: { type: [mongoose.Schema.Types.ObjectId], ref: 'Service', index: true },
    


    // ref to EditsSuggestionsHistory collection for edit version histroy and edit suggestion
    _edit_sugg: { type: mongoose.Schema.Types.ObjectId, ref: 'EditsSuggestions'},
    
    // array of refs to Comments in Comment collection 
    _comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],


    reviewText: { type: String },
    vendor:     { type: String },
    pscategory: { type: String },
    pscategory_all:   [{type: String}],

    submitted:  { type: Date },
    anonymous:  { type: String }, // "on" or "off"
    
    anon:  { type: Boolean }, // "on" or "off"
    // source :    { type: String }, //Review originated from which location
    
    location:   {type: String},
    // location:   {type: geo},

    otd_rating: { type: Number },
    pad_rating: { type: Number },
    pri_rating: { type: Number },
    pro_rating: { type: Number },
    eos_rating: { type: Number },
    rrp_rating: { type: Number },
    csu_rating: { type: Number },
    all_rating: { type: String },

    // otd_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    // pad_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    // pri_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    // pro_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    // eos_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    // rrp_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    // csu_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },

    otd_comment:{ type: String },
    pad_comment:{ type: String },
    pri_comment:{ type: String },
    pro_comment:{ type: String },
    eos_comment:{ type: String },
    rrp_comment:{ type: String },
    csu_comment:{ type: String },

    verified:  { type: Boolean },
    source: { type: String }, // if null or undefined, then orginated from the site itself
    last_updated: { type: Date, default: Date.now },

    Meta: [MetaPost],

    // anonymous: { type: Boolean },
    // version_history: [PostDiffSchema],
    // version_history: [PostDiffSchemaDiff]
  });

  // function rcomment_validator (comment) {
  //   return (comment.length <= 137);
  // };

  // function rating_validator (rating) {
  //   return (rating >= 0 && rating <= 5);
  // };


  var PostDiff = mongoose.model('PostDiff', PostDiffSchema);

  var findById = function(shopexId, callback) {
    PostDiff.findOne({_id:shopexId}, function(err, shopex) {
      callback(shopex);
    });
  }

  var findByIdPopulated = function(shopexId, callback) {
    // PostDiff.findOne({_id:shopexId}, function(err, shopex) {
    // callback(shopex);
    PostDiff
    .findOne({_id:shopexId})
    .populate('_author')
    .exec(function(err, shopex){
      callback(shopex);
      // if (err)
      //   return handleError(err);
    });
    // });
  }

  var findByPubId = function(shopexPubId, callback) {
    PostDiff.findOne({pub_id:shopexPubId}, function(err, shopex) {
      callback(err, shopex);
    });
  }

  var findByPubIdPopulated = function(shopexPubId, callback) {
    // PostDiff.findOne({_id:shopexId}, function(err, shopex) {
    // callback(shopex);
    PostDiff
    .findOne({pub_id:shopexPubId})
    .populate('_author')
    .exec(function(err, shopex){
      callback(err, shopex);
      // if (err)
      //   return handleError(err);
    });
    // });
  }

 
  // utility functions

  var getAuthorId = function(shopexId, callback) {
    PostDiff.findOne({_id:shopexId}, function(err, shopex) {
      callback(shopex._author);
    });
  }

  var getAuthorInfo = function(shopexId, callback) {
    PostDiff
    .findOne({_id:shopexId})
    .populate('_author')
    .exec(function(err, shopex){
      if (err) return handleError(err);
      callback({ 
        name: shopex._author.name,
        email: shopex._author.email,
        last_seen: shopex._author.last_seen,
        img_icon_url: shopex._author.img_icon_url,
        });
    });
  }

  var getAuthor = function(shopexId, callback) {
    PostDiff
    .findOne({_id:shopexId})
    .populate('_author')
    .exec(function(err, shopex){
      if (err) 
        return handleError(err);
      callback(shopex._author);
    });
  }

  var getComments = function(shopexId, callback) {
    PostDiff
    .findOne({_id:shopexId})
    .populate('_comments')
    .exec(function(err, shopex){
      if (err) 
        return handleError(err);
      callback(shopex._comments);
    });
  }

  // var register = function(email, password, firstName, lastName, verificationUrl, callback) 
  
  var createPost = function(shopexObj, callback) {
    console.log("in createPost function")

    models.PublicCounter.getNextSequence("PostDiff", function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      if (!seq){
        console.log("Got No Sequence Number from counter collection");
        // throw error;
      }
      shopexObj.pub_id = seq;
      var shopex = new PostDiff(shopexObj);
      
      shopex.save(function(err, saved_shopex) {
        callback(err, saved_shopex);
      });  
    });

  }

  // args will be bunch of key, val, alternatively given 
  // key should be according to the object inner structure, like for a nested key full key name from top level is expected
  // # means that the suffix is actually an index and prefix is an array and update has to be made on that index of the array
  var updatePost = function() {
    
  }

  // args will be bunch of key, val, alternatively given 
  // key is expected to be for MetaPost subdocument top level
  // # means that the suffix is actually an index and prefix is an array and update has to be made on that index of the array
  var updateMetaPost = function() {

  }

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
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    PostDiff: PostDiff
  }
}
