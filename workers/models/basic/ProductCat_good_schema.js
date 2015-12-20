module.exports = function(config, mongoose, models, modelName) {

  mongoose.set('debug', true);

  var ProductCatSchema = new mongoose.Schema({
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
    name: { type: String, unique: true, required: true },
    node_type: { type: String },
    url_name: { type: String, unique: true, required: true },

    wiki_url: { type: String }, // url of the wikipedia page with more detailed information about the product category
    google_url: { type: String }, // url of the Google Search results page with more information about the product category
    picture: { type: String }, // image url 

    sample_product_url: { type: [String] }, // url of few sample products in this category from each vendors
    sample_product_images: { type: [String] }, // image url for them

    short_desc: { type: String },
    big_desc: { type: String },
    info_object: { type: String }, // use JSON.parse() and JSON.stringify() on this to convert the stringified json to a js object and vice-versa
    //{{ add more }}?

    aliases: { type: [String], index: true }, // #TODO index is multikey index to be used when matching for the name, #CHECK

    offline_availability : { type: Boolean, default: true }, // #TODO array of offline shop locations and contact details

    // #TODO see for type for URL, to check for live links for images
    img_icon_url : { type: String },  
    cover_image_url : { type: String },
    profile_image_url : { type: String }, 
    thumb_image_url : { type: String }, 

    details : {  
      last_updated: { type: Date },
      estimated_total_num_of_purchases: { type: Number },
      valuation: { type: Number }, // in USD
      industry:  { type: [String], index: true }, //["Internet","Online retailing"],
    },


    // ### associations ###
    _author: { type: Number, ref: 'Account', index: true },

    _shopexes: [{ type: Number, ref: 'Shopex', index: true }],
    _questions: [{ type: Number, ref: 'Question', index: true }],
    _answers: [{ type: Number, ref: 'Answer', index: true }],

    _comments: [{ type: Number, ref: 'Comment' }],

    _seller: [{ type: Number, ref: 'Seller', index: true,}],

    //array of refs with multikey indexing on their ids #CHECK #TODO
    _child_pro_cat: [{ type: Number, ref: 'ProductCat', index: true }],
    _parent_pro_cat: [{ type: Number, ref: 'ProductCat', index: true }],
    _pro: [{ type: Number, ref: 'Product', index: true }],

    // Related Services Categories with this Product Category
    _related_ser_cat: [{ type: Number, ref: 'ServiceCat', index: true }],
    
    // Related Services with this Product Category
    _related_ser: [{ type: Number, ref: 'Service', index: true }],


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

    meta_info: {
      value: { type: Number }, //overall value of this post
      
      viewers: [{ type: Number, ref: 'Account' }],
      followers: [{ type: Number, ref: 'Account' }],
      favors: [{ type: Number, ref: 'Account' }],
      sharers: [{ type: Number, ref: 'Account' }],
      
      //array of array of account refs for diff types of flag raisers #TODO
      flaggers: [{ type: Number, ref: 'Account' }],

      edits: {type: Number}, //number of edits made on this post (versions) 
      editors: [{ type: Number, ref: 'Account' }],

      buyers: [{ type: Number, ref: 'Account' }],
    },

  }, { autoIndex: true });

  ProductCatSchema.pre('save', function(next){
    this.updated_at = new Date;

    // var name_changed = false;
    var url_n = this.name.trim().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]+/g,"");
    if ( this.url_name != url_n ){
      this.url_name = url_n;
      // name_changed = true;
    }

    // if (this._id && (!this.permalink || name_changed) ) {
    if (this._id) {
      var plink = "/product-category/"+this._id+"/"+this.url_name;

      if ( this.permalink != plink )
          this.permalink = plink;
    }

    if ( !this.created_at ) {
      this.created_at = new Date;
      this.obj_id = mongoose.Types.ObjectId();

      this.node_type = "_pro_cat";
      this.node_type_num = "1";
      this.meta_info = {
        value: 10, //overall value of this post
      
        viewers: [this._author],

        followers: [this._author],
        favors: [this._author],
        sharers: [],

        flaggers: [],

        edits: 1,
        editors: [this._author],

        buyers: [],
      };

    } // when created

    next();
  });

  // var ProductCat = mongoose.model('ProductCat', ProductCatSchema);
  var ProductCat = mongoose.model(modelName, ProductCatSchema);
  
  return ProductCat;
}
