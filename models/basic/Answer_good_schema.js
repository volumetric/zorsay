module.exports = function(config, mongoose, models, modelName) {

  mongoose.set('debug', true);

  var AnswerSchema = new mongoose.Schema({
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
    // content_title: { type: String, unique: true, index: "text", required: true},
    content_text: { type: String, index: "text", required: true },
    anon:  { type: Boolean, default: false },
    location: { type: String, index: "text" }, // location: {type: geo}, #TODO
    areacode: { type: Number, index: true },

    // ### associations ###
    _author: { type: Number, ref: 'Account', index: true, required: true },

    // _question: [{ type: Number, ref: 'Question' }],
    _question: { type: Number, ref: 'Question' },
    _comments: [{ type: Number, ref: 'Comment' }],

    _seller: [{ type: Number, ref: 'Seller', index: true,}],

    //array of refs with multikey indexing on their ids #CHECK #TODO
    _pro_cat: [{ type: Number, ref: 'ProductCat', index: true }],
    _pro: [{ type: Number, ref: 'Product', index: true }],

    _ser_cat: [{ type: Number, ref: 'ServiceCat', index: true }],
    _ser: [{ type: Number, ref: 'Service', index: true }],

    
    // ### edits ###
    // edit history diff will be incremental from previous versions of post
    edit_hist_diff_arr: [],
    edit_hist_diff_arr_meta: [{
      author: { type: Number, ref: 'Account'}, // same as _author, if null
      summary: { type: String },
      submitted:  { type: Date, required: true },
    }],

    // The diff in the case of suggestion will be wrt to latest version of post
    // accepting/rejecting a suggestion will remove that entry from this array

    // #TODO implement edit suggestions
    edit_sugg_diff_arr: [],
    edit_sugg_diff_arr_meta: [{ 
      author: { type: Number, ref: 'Account'},
      accepted: { type: Boolean }, // unviewed or unjudged, if null
      // This will be the index of the array in edit_hist_diff_arr w.r.t which the suggestion was made
      // This will be 0-indexed number and if the edit hist diff arr increases in size (it cannot decrease) then no problem will occur
      wrt: { type: Number }, // w.r.t. which post index in edit_hist_diff_arr
      submitted:  { type: Date, required: true },
      summary: { type: String },
    }],

    // ### meta information ###
    accepted: { type: Boolean },
    permalink: { type: String },
    verified:  { type: Boolean },
    source: { type: String }, // if null, then orginated from the site itself

    vote_count: { type: Number },
    meta_info: {
      value: { type: Number }, //overall value of this post
      
      viewers: [{ type: Number, ref: 'Account' }],
      upvoters: [{ type: Number, ref: 'Account' }],
      downvoters: [{ type: Number, ref: 'Account' }],
      followers: [{ type: Number, ref: 'Account' }],
      favors: [{ type: Number, ref: 'Account' }],
      sharers: [{ type: Number, ref: 'Account' }],
    
      //array of array of account refs for diff types of flag raisers #TODO
      flaggers: [{ type: Number, ref: 'Account' }],

      edits: {type: Number}, //number of edits made on this post (versions) 
      editors: [{ type: Number, ref: 'Account' }],
    },

  }, { autoIndex: true });

  AnswerSchema.pre('save', function(next){
    this.updated_at = new Date;

    // if (this._id){
    //   this.permalink = "/answer/"+this._id+"/"+this.content_title;
    // }

    // #TODO need to populate question for title before this
    // this.permalink = this._question.permalink+'/answer'+'/'+this._author.url_name
    
    if (this._id) {
      // this.permalink = this._question.permalink+'/answer/'+this._id
      this.permalink = '/answer/'+this._id
    }

    // if this is a new post and being saved for the first time

    if ( !this.created_at ) {
    // if ( !this._v ) {
      this.created_at = new Date;
      this.obj_id = mongoose.Types.ObjectId();

      // #TODO move this from pre() to post() 
      // #TODO and write a function to increment answer count for Sellers and ProductCat

      this.vote_count = 1;
      this.meta_info = {
        value: 30, //overall value of this post
      
        viewers: [this._author],
        upvoters: [this._author],
        downvoters: [],

        followers: [this._author],
        favors: [this._author],
        sharers: [],

        flaggers: [],

        edits: 1,
        editors: [this._author],
      };

    } // when created

    next();
  });


  AnswerSchema.post('save', function(answer_doc){

    // #TODO implement addAnswer() in Node Model
    // models.Seller.addAnswer(answer_doc._seller, answer_doc._id);
    
    // for (var i = 0; i < answer_doc._pro_cat.length; ++i){
    //   models.ProductCat.addAnswer(answer_doc._pro_cat[i], answer_doc._id)
    // }
    // for (var i = 0; i < answer_doc._ser_cat.length; ++i){
    //   models.ServiceCat.addAnswer(answer_doc._ser_cat[i], answer_doc._id)
    // }

    // console.log(answer_doc.__v);

    if (modelName !== "dAnswer" && answer_doc.__v == 0) {
      // models.Question.addAnswer(answer_doc._question, answer_doc._id, function(err, post_doc){
      models.Question.addAnswererAndAnswer(answer_doc._question, answer_doc._id, answer_doc._author, function(err, post_doc){
          console.log(err);
          // console.log("comment added to the post in collection", comment_doc._parent.post_name, "with pub_id: ", comment_doc._parent.post_pub_id);
      });
    }

  });

  // var Answer = mongoose.model('Answer', AnswerSchema);
  var Answer = mongoose.model(modelName, AnswerSchema);

  return Answer;
}