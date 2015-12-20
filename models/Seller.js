module.exports = function(config, mongoose, models, ProductCat, Shopex) {

  // Import models
  // var models = {
  //   // PublicCounter: require('./PublicCounter')(config, mongoose),
  //   PublicCounter: public_counter,
  // };

  mongoose.set('debug', true);

  // var MetaSeller = new mongoose.Schema({
  //   value: {type: Number},                    //overall value of this seller on the site
  //   buyers: {type: Number},                    //buyers count
  //   // views: {type: Number},                    //number of views (readers)
  //   // upvotes: {type: Number},                    //number of upvotes (upvoters)
  //   followers: {type: Number},                    //number of followers (followers)
  //   favs: {type: Number},                    //number of favorites (bookmarkers) 
  //   // edits: {type: Number},                    //number of edits (versions) 
  //   // editors: {type: Number},                    //number of editors (collaborators) 
  //   // flags: [{type: Number}],                       //number of flags raised, different types of flag counts
  //   shopex_count: {type: Number},
  //   question_count: {type: Number},
  // })

  // Schema = mongoose.Schema;

  var SellerSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},

    // created_at: {type: Date, required: true, default: Date.now },
    created_at: {type: Date },
    // updated_at: {type: Date, required: true, default: Date.now },
    updated_at: {type: Date },


    pub_id: { type: Number },

    // the user who created this seller on the site. if null or undefined, then created by site staff
    // _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true }, 
    _author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true }, 

    _followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],

    // making array of ps_cat refs with multikey indexing on their ids #CHECK #TODO
    // All the categories and products/services this seller sells

    // _pro_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCat', index: true }],
    _pro_cat: { type: [mongoose.Schema.Types.ObjectId], ref: 'ProductCat', index: true },

    // _pro: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true }],
    _pro: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', index: true },
    
    // _ser_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCat', index: true }],
    _ser_cat: { type: [mongoose.Schema.Types.ObjectId], ref: 'ServiceCat', index: true },
    
    // _ser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', index: true }],
    _ser: { type: [mongoose.Schema.Types.ObjectId], ref: 'Service', index: true },


    // _shopexes: { type: [mongoose.Schema.Types.ObjectId], ref: 'Shopex', index: true },
    _shopexes_pub_id: { type: [Number], ref: 'Shopex', index: true },


    // ref to EditsSuggestionsHistory collection for edit version histroy and edit suggestion
    // _edit_sugg: { type: mongoose.Schema.Types.ObjectId, ref: 'PostDiff'},

    // The diff in the case of edit history will be incremental from the previous version of the post
    edit_hist_diff_arr: [],
    edit_hist_diff_arr_meta: [{
      edit_author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'}, // if null of undefined then same as _author
      edit_summary: { type: String },
      submitted:  { type: Date },
    }],

    // The diff in the case of suggestion will be w.r.t to the latest version of the post
    // accepting/rejecting a suggestion will remove that entry from this array
    edit_sugg_diff_arr: [],
    edit_sugg_diff_arr_meta: [{ 
      sugg_author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'}, // anon if null or undefined
      sugg_accepted: { type: Boolean }, // if this field is undefined, then the edit has not been viewed or judged 
      sugg_wrt: { type: Number },
      submitted:  { type: Date },
      // This will be the index of the array in edit_hist_diff_arr w.r.t which the suggestion was made
      // This will be 0-indexed number and if the edit hist diff arr increases in size (it cannot decrease) then no problem will occur
    }],

    
    // array of refs to Comments in Comment collection 
    _comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],


    name: { type: String, unique: true, index: true },
    site_domain: { type: String,  unique: true, index: true },
    
    url: { type: String },
    url_title: { type: String },
    url_screenshot: { type: String }, // image url 

    store_url: { type: String },
    store_url_screenshot: { type: String }, // image url 

    catalog_url: { type: String },
    catalog_url_screenshot: { type: String }, // image url 
    
    sample_product_url: { type: String },
    sample_product_url_screenshot: { type: String }, // image url 

    _templates: {
       // these will be the templates to be used for indexing the seller's site
      product_page_template: { type: String }, // individual product page template {{add_more}}
    },

    description: { type: String },

    info_text: { type: String },  // kind of like a wiki, need to add more fields here, later.

    aliases: { type: [String], index: true }, // #TODO index is multikey index to be used when matching for the name, #CHECK
    online_order: { type: Boolean },  
    home_delivery: { type: Boolean }, // #TODO array of reach and region of delivery to be displayed on a map
    offline_shop : { type: Boolean }, // #TODO array of offline shop locations and contact details
    mode_of_money_transaction : { type: [String] }, //["CC","DC","NB","COD"], // #TODO add enum
    logo_url : { type: String },  // #TODO see if their is type for URL, to check for live links for images
    cover_image_url : { type: String },
    profile_image_url : { type: String }, 
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

    // birthday: {
    //   day:     { type: Number, min: 1, max: 31, required: false },
    //   month:   { type: Number, min: 1, max: 12, required: false },
    //   year:    { type: Number }
    // },

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

    // pscategory_all:   [{type: String}],

    submitted:  { type: Date },
    
    source :    { type: [String] }, // seller Info originated from which location
    
    // location:   {type: String},
    // location:   {type: geo},

    otd_rating: { type: Number },
    pad_rating: { type: Number },
    pri_rating: { type: Number },
    pro_rating: { type: Number },
    eos_rating: { type: Number },
    rrp_rating: { type: Number },
    csu_rating: { type: Number },
    all_rating: { type: String },

    verified:  { type: Boolean },
    source: { type: String }, // if null or undefined, then orginated from the site itself
    // last_updated: { type: Date, default: Date.now },

    // Meta: [MetaSeller],
    meta_info: {
      value: {type: Number},                    //overall value of this seller on the site
      buyers: {type: Number},                    //buyers count
      // views: {type: Number},                    //number of views (readers)
      // upvotes: {type: Number},                    //number of upvotes (upvoters)
      followers: {type: Number},                    //number of followers (followers)
      favs: {type: Number},                    //number of favorites (bookmarkers) 
      // edits: {type: Number},                    //number of edits (versions) 
      // editors: {type: Number},                    //number of editors (collaborators) 
      // flags: [{type: Number}],                       //number of flags raised, different types of flag counts
      shopex_count: {type: Number},
      question_count: {type: Number},
    },
  }, { autoIndex: false });

  SellerSchema.pre('save', function(next){
    this.updated_at = new Date;
    if ( !this.created_at ) {
      this.created_at = new Date;
      this.meta_info = {
        value: null,                    //overall value of this seller on the site
        buyers: 0,                    //buyers count
        followers: 1,                    //number of followers (followers)
        favs: 1,                    //number of favorites (bookmarkers) 
        // edits: {type: Number},                    //number of edits (versions) 
        // editors: {type: Number},                    //number of editors (collaborators) 
        // flags: [{type: Number}],                       //number of flags raised, different types of flag counts
        shopex_count: 0,
        question_count: 0,
      };

      // var mp = new MetaSeller(mpObj);

      // this.Meta.push(mpObj);
    } // when created

    next();
  });


  var Seller = mongoose.model('Seller', SellerSchema);

  var findById = function(sellerId, callback) {
    Seller.findOne({_id:sellerId}, function(err, seller) {
      callback(seller);
    });
  }

  // var findByIdPopulated = function(sellerId, callback) {
  //   Seller
  //   .findOne({_id:sellerId})
  //   .populate('_author')
  //   .exec(function(err, seller){
  //     callback(seller);
  //     // if (err)
  //     //   return handleError(err);
  //   });
  //   // });
  // }

  var findByPubId = function(sellerPubId, callback) {
    Seller.findOne({pub_id:sellerPubId}, function(err, seller) {
      callback(err, seller);
    });
  }
 
  // utility functions

  // var register = function(email, password, firstName, lastName, verificationUrl, callback) 
  
  var createSeller = function(sellerObj, callback) {
    console.log("in createSeller function")

    models.PublicCounter.getNextSequence("Seller", function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      if (!seq){
        console.log("Got No Sequence Number from counter collection");
        // throw error;
      }
      sellerObj.pub_id = seq;
      var seller = new Seller(sellerObj);
      
      seller.save(function(err, saved_seller) {
        callback(err, saved_seller);
      });  
    });

  }

  var getIdByQuery = function(query, callback) {
    console.log("%%% inside getIdByQuery Seller with query: %%%", query)
    Seller.findOne(query, function(err, seller){
      console.log("%%% inside getIdByQuery callback got Seller: %%%", seller)
      callback(err, seller);
    });
  }

  // var getSellersByShopexCount = function(callback) {
  //   Seller.find().sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }

  // var getSellersByShopexCountLimitCount = function(limit, callback) {
  //   Seller.find().sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).limit(limit).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }

  var getSellersByShopexCountSkipLimit = function(skip, limit, callback) {
    Seller.find().sort({
      'meta_info.shopex_count': -1,
      // 'meta_info.upvotes': -1,
    }).skip(skip).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  // var getSellersByShopexCountQuery = function(lastValue, callback) {
  //   Seller.find({
  //     'meta_info.shopex_count': {$lt: lastValue},
  //     // 'meta_info.upvotes': {$lt: lastValue},
  //   }).sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }

  // var getSellersByShopexCountQueryLimit = function(lastValue, limit, callback) {
  //   Seller.find({
  //     'meta_info.shopex_count': {$lt: lastValue},
  //     // 'meta_info.upvotes': {$lt: lastValue},
  //   }).sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).limit(limit).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }


  return {
    findById: findById,
    // findByIdPopulated: findByIdPopulated,
    createSeller: createSeller,
    getIdByQuery: getIdByQuery,

    // getSellersByShopexCount: getSellersByShopexCount,
    // getSellersByShopexCountLimitCount: getSellersByShopexCountLimitCount,
    getSellersByShopexCountSkipLimit: getSellersByShopexCountSkipLimit,
    // getSellersByShopexCountQuery: getSellersByShopexCountQuery,
    // getSellersByShopexCountQueryLimit: getSellersByShopexCountQueryLimit,
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    Model: Seller
  }
}
