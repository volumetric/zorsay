module.exports = function(config, mongoose, models, modelName) {
  
  mongoose.set('debug', true);

  var CommentSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },

    // Auxiallary ID of the document
    obj_id: { type: mongoose.Schema.ObjectId, unique: true },
    
    // ### timestamps ###
    created_at: { type: Date },
    // only when the post is edited
    updated_at: { type: Date, required: true, default: Date.now() },
    // activity like upvoted/commneted/edited anything
    last_activity: { type: Date, default: Date.now() },

    
    // ### content ###
    content_text: { type: String },
    anon: { type: Boolean, default: false },


    // ### associations ###
    _author: { type: Number, ref: 'Account', index: true },
    
    //"Shopex", "Question", "Answer" or "Comment" #TODO use enum
    _parent_name: {type: String, required: true}, 
    _parent_id: {type: Number, required: true}, // _id of the post

    // #CHECK see if a generic reference can be made for a multiple collections

    _comments: [{ type: Number, ref: 'Comment' }],
    
    // #TODO make comments as lazy load, incremental load.

    // ### meta information ###
    // allow_reply: {type: Boolean}, // reply can be disabled by commenter
    permalink: { type: String },
    verified:  { type: Boolean },
    source: { type: String }, // if null, then orginated from the site itself

    vote_count: { type: Number },
    meta_info: {
      value: { type: Number }, //overall value of this post
      
      viewers: [{ type: Number, ref: 'Account' }],
      upvoters: [{ type: Number, ref: 'Account' }],
      downvoters: [{ type: Number, ref: 'Account' }],
      favors: [{ type: Number, ref: 'Account' }],
      sharers: [{ type: Number, ref: 'Account' }],
    
      //array of array of account refs for diff types of flag raisers #TODO
      flaggers: [{ type: Number, ref: 'Account' }],

      edits: {type: Number}, //number of edits made on this post (versions) 
      editors: [{ type: Number, ref: 'Account' }],
    },

  }, { autoIndex: true });

  CommentSchema.pre('save', function(next){

    this.updated_at = new Date;

    if (this._id) {
      // this.permalink = this._parent_id.permalink+'/comment/'+this._id
      this.permalink = '/comment/'+this._id
    }

    if ( !this.created_at ) {
      this.created_at = new Date;
      this.obj_id = mongoose.Types.ObjectId();

      this.vote_count = 1;
      this.meta_info = {
        value: 5, //overall value of this post
      
        viewers: [this._author],
        upvoters: [this._author],
        downvoters: [],

        favors: [this._author],
        sharers: [],

        flaggers: [],

        edits: 1,
        editors: [this._author],
      };
      
    } // when created

    next();
  });


  CommentSchema.post('save', function(comment_doc){

    var getModelbyName = function(name) {
      for (i in models){
        if (typeof(models[i]) === 'object' && models[i].Model){
          if (name === models[i].Model.modelName){
            return models[i];
          }
        }
      }
    }

    // console.log("@@@@@@@ $$$$$$$$$$$ inside post save for CommentSchema")

    // #TODO add this comment to the parent _comments array for refs
    // #TODO get the model from the db based only on the collection name

    postModel = null;
    postModel = getModelbyName(comment_doc._parent_name);

    // console.log(comment_doc._parent.post_name);
    // console.log(postModel.Model.modelName);

    // console.log(postModel);

    if (postModel !== null) {
      if (modelName !== "dComment" && comment_doc.__v == 0) {
        postModel.addComment(comment_doc._parent_id, comment_doc._id, function(err, post_doc){
            // console.log("comment added to the post in collection", comment_doc._parent.post_name, "with pub_id: ", comment_doc._parent.post_pub_id);
        });
      }
    }
    
  });

  // var Comment = mongoose.model('Comment', CommentSchema);
  var Comment = mongoose.model(modelName, CommentSchema);

  return Comment;
}
