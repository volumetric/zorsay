module.exports = function(config, mongoose, models, modelName) {

  mongoose.set('debug', true);

  var QuestionSchema = new mongoose.Schema({
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
    // content_title: { type: String, unique: true, index: "text", required:true},
    content_title: { type: String, index: "text", required: true},
    content_text: { type: String, index: "text", default: "" },  // question details 
    anon:  { type: Boolean, default: false },
    
    location: { type: String, index: "text" }, // location: {type: geo}, #TODO
    areacode: { type: Number, index: true },
    prod_links: [{ type: String }],

    url_title: { type: String, index: "text"},

    // ### associations ###
    _author: { type: Number, ref: 'Account', index: true, required: true },
    _answerers: [{ type: Number, ref: 'Account', index: true }],

    _answers: [{ type: Number, ref: 'Answer' }],
    _accepted_answer: { type: Number, ref: 'Answer' },

    _related_questions: [{ type: Number, ref: 'Question' }],
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
      // shares: [
      //   { 
      //     account: { type: Number, ref: 'Account' },
      //     to: [{ type: Number, ref: 'Account' }],
      //     message: { type: String },
      //   }
      // ],
    
      //array of array of account refs for diff types of flag raisers #TODO
      flaggers: [{ type: Number, ref: 'Account' }],
      // flags: [{ type: Number, ref: 'Account' }],

      edits: {type: Number}, //number of edits made on this post (versions) 
      editors: [{ type: Number, ref: 'Account' }],
    },

  }, { autoIndex: true });

  QuestionSchema.pre('save', function(next){
    this.updated_at = new Date;

    // if ( !this.permalink && this._id ){
    //   this.permalink = "/question/"+this._id+"/"+this.content_title;
    // }

    var url_t = this.content_title.trim().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]+/g,"");
    if ( this.url_title != url_t )
      this.url_title = url_t;

    if (this._id) {
      var plink = "/question/"+this._id+"/"+this.url_title

      if ( this.permalink != plink )
          this.permalink = plink;
    }

    // if this is a new post and being saved for the first time
    if ( !this.created_at ) {
      this.created_at = new Date;
      this.obj_id = mongoose.Types.ObjectId();

      // if ( !this.url_title )
      //   this.url_title = this.content_title.trim().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]+/g,"");

      // if ( !this.permalink && this._id)
      //   this.permalink = "/question/"+this._id+"/"+this.url_title;

      // #TODO move this from pre() to post() 
      // #TODO and write a function to increment question count for Sellers and ProductCat

      this.vote_count = 1;
      this.meta_info = {
        value: 20, //overall value of this post
      
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


  QuestionSchema.post('save', function(question_doc){

    // #TODO implement addQuestion() in Node Model
    // models.Seller.addQuestion(question_doc._seller, question_doc._id);
    
    // for (var i = 0; i < question_doc._pro_cat.length; ++i){
    //   models.ProductCat.addQuestion(question_doc._pro_cat[i], question_doc._id)
    // }
    // for (var i = 0; i < question_doc._ser_cat.length; ++i){
    //   models.ServiceCat.addQuestion(question_doc._ser_cat[i], question_doc._id)
    // }

  });

  // var Question = mongoose.model('Question', QuestionSchema);
  var Question = mongoose.model(modelName, QuestionSchema);
  return Question;
}