module.exports = function(config, mongoose, models, modelName) {

  mongoose.set('debug', true);

  var SellerSchema = new mongoose.Schema({
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
    name: { type: String, required: true },
    node_type: { type: String },
    site_domain: { type: String, unique: true, required: true},
    url_name: { type: String, unique: true },

    url: { type: String },
    url_title: { type: String },
    url_screenshot: { type: String }, // image url 

    // on zorsay
    store_page_url: { type: String },

    store_url: { type: String },
    store_url_screenshot: { type: String }, // image url 

    catalog_url: { type: String },
    catalog_url_screenshot: { type: String }, // image url 
    
    sample_product_url: { type: String },
    sample_product_url_screenshot: { type: String }, // image url 

    _templates: {
      // these will be the templates to be used for indexing the seller's site

      // individual product page template
      product_page_template: { type: String },
      // {{add_more}}
    },

    short_desc: { type: String },
    big_desc: { type: String },
    info_object: { type: String }, // use JSON.parse() and JSON.stringify() on this to convert the stringified json to a js object and vice-versa
    //{{ add more }}?

    aliases: { type: [String], index: true }, // #TODO index is multikey index to be used when matching for the name, #CHECK
    online_order: { type: Boolean },  
    home_delivery: { type: Boolean }, // #TODO array of reach and region of delivery to be displayed on a map
    offline_shop : { type: Boolean }, // #TODO array of offline shop locations and contact details
    mode_of_money_transaction : { type: [String] }, //["CC","DC","NB","COD"], // #TODO add enum
    logo_url : { type: String },  // #TODO see if their is type for URL, to check for live links for images
    img_icon_url : { type: String },  
    cover_image_url : { type: String },
    profile_image_url : { type: String }, 
    thumb_image_url : { type: String }, 
    courier_details : { type: String },  // #TODO add details

    details : {  
      last_updated: { type: Date },
      estimated_total_num_of_purchases: { type: Number },
      revenue: { type: Number }, // in USD
      valuation: { type: Number }, // in USD
      employees: { type: Number },
      world_alexa_rank: { type: Number },
      india_alexa_rank: { type: Number },
      type: { type: [String] }, // #TODO enum list of types of sellers: stores, agents, boutique, etc...
      language_availability: { type: [String] }, // #TODO list of locals like en-us or en-uk
      launched: { type: Date },
      current_status: { type: String }, // #TODO enum for online, offline, recently lauched, out of business etc...
      registration_requirement: { type: [String] }, // #TODO registration required for these activities, like buying digital content
      slogan: { type: String },
      sister_sites:  { type: [String] }, //["Flipkart.com", "Electronic Wallet","Mime360.com", "Chakpak.com"],
      services:  { type: String }, //"Electronic commerce",
      industry:  { type: [String] }, //["Internet","Online retailing"],
      area_served:  { type: [String] }, // ["India", "Southe East Asia" ]
    },


    location: {
      headQuarter:  [
        {
          name: {type: String},
          coordinates: {
            lat: {type: Number},
            lon: {type: Number},
          },
        },
      ],
      wareHouses:  [
        {
          name: {type: String},
          coordinates: {
            lat: {type: Number},
            lon: {type: Number},
          },
        },
      ],
    },

    // ### analytics ###
    // A descriptive text for explaining the objective data, to be written manually after analyzing the ratings and comments for posted shopexes.
    rating_text: { type: String },
    
    otd_rating: { type: Number },
    pad_rating: { type: Number },
    pri_rating: { type: Number },
    pro_rating: { type: Number },
    eos_rating: { type: Number },
    csu_rating: { type: Number },
    rrp_rating: { type: Number },
    all_rating: { type: Number },

    // last time analytics data was updated
    analytics_updated: { type: Date },
    // other analytics info like number of shopex on which these data was generated etc...
    // analytics_meta: {},


    // ### associations ###
    _author: { type: Number, ref: 'Account', index: true },

    _shopexes: [{ type: Number, ref: 'Shopex', index: true }],
    _questions: [{ type: Number, ref: 'Question', index: true }],
    _answers: [{ type: Number, ref: 'Answer', index: true }],

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

  SellerSchema.pre('save', function(next){
    this.updated_at = new Date;

    // var name_changed = false;
    // var url_n = this.name.trim().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]+/g,"");
    var url_n = this.site_domain.trim().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9\.]+/g,"");
    if ( this.url_name != url_n ){
      this.url_name = url_n;
      // name_changed = true;
    }

    // if (this._id && (!this.permalink || name_changed) ) {
    if (this._id) {
      var plink = "/seller/"+this._id+"/"+this.url_name;

      if ( this.permalink != plink )
          this.permalink = plink;
    }

    if ( !this.created_at ) {
      this.created_at = new Date;
      this.obj_id = mongoose.Types.ObjectId();

      this.node_type = "_seller";
      this.node_type_num = "0";
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

  // var Seller = mongoose.model('Seller', SellerSchema);
  var Seller = mongoose.model(modelName, SellerSchema);
  
  return Seller;
}
