module.exports = function(config, mongoose, public_counter) {

  // Import models
  var models = {
    // PublicCounter: require('./PublicCounter')(config, mongoose),
    PublicCounter: public_counter,
  };

  mongoose.set('debug', true);

  var MetaProductCat = new mongoose.Schema({
    value: {type: Number},                    //overall value of this productCat on the site
    buyers: {type: Number},                    //buyers count
    // views: {type: Number},                    //number of views (readers)
    // upvotes: {type: Number},                    //number of upvotes (upvoters)
    followers: {type: Number},                    //number of followers (followers)
    favs: {type: Number},                    //number of favorites (bookmarkers) 
    // edits: {type: Number},                    //number of edits (versions) 
    // editors: {type: Number},                    //number of editors (collaborators) 
    // flags: [{type: Number}],                       //number of flags raised, different types of flag counts
  })

  // Schema = mongoose.Schema;

  var ProductCatSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},

    pub_id: { type: Number },

    // the user who created this productCat on the site. if null or undefined, then created by site staff
    _creator: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true }, 

    _followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],

    // making array of ps_cat refs with multikey indexing on their ids #CHECK #TODO
    // All the categories and products/services this productCat sells

    // All the sellers, who sell products from this category or products from any of its child product category
    // _seller: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true }],
    _seller: { type: [mongoose.Schema.Types.ObjectId], ref: 'Seller', index: true },


    // child_pro_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCat', index: true }],
    _child_pro_cat: { type: [mongoose.Schema.Types.ObjectId], ref: 'ProductCat', index: true },

    // parent_pro_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCat', index: true }],
    _parent_pro_cat: { type: [mongoose.Schema.Types.ObjectId], ref: 'ProductCat', index: true },

    // All Products from this category. these products comes directly under this category, and not under one of its child categories
    // direct_pro: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true }],
    _direct_pro: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', index: true },
    
    // Related Service Categories with this Product Category
    // related_ser_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCat', index: true }],
    _related_ser_cat: { type: [mongoose.Schema.Types.ObjectId], ref: 'ServiceCat', index: true },
    
    // Related Services with this Product Category
    // related_ser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', index: true }],
    _related_ser: { type: [mongoose.Schema.Types.ObjectId], ref: 'Service', index: true },
    


    // ref to EditsSuggestionsHistory collection for edit version histroy and edit suggestion
    _edit_sugg: { type: mongoose.Schema.Types.ObjectId, ref: 'EditsSuggestions'},
    
    // array of refs to Comments in Comment collection 
    _comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],


    name: { type: String, unique: true, index: true },
    // site_domain: { type: String,  unique: true, index: true },
    
    wiki_url: { type: String }, // url of the wikipedia page with more detailed information about the product category
    google_url: { type: String }, // url of the Google Search results page with more information about the product category
    picture: { type: String }, // image url 

    // store_url: { type: String },
    // store_url_screenshot: { type: String }, // image url 

    // catalog_url: { type: String },
    // catalog_url_screenshot: { type: String }, // image url 
    
    sample_product_url: { type: [String] }, // url of few sample products in this category from each vendors
    sample_product_images: { type: [String] }, // image url for them


    description: { type: String },

    info_text: { type: String },  // kind of like a wiki, need to add more fields here, later.

    aliases: { type: [String], index: true }, // #TODO index is multikey index to be used when matching for the name, #CHECK

    // online_order: { type: Boolean },  
    // home_delivery: { type: Boolean }, // #TODO array of reach and region of delivery to be displayed on a map
    offline_availability : { type: Boolean, default: true }, // #TODO array of offline shop locations and contact details
    // mode_of_money_transaction : { type: [String] }, //["CC","DC","NB","COD"], // #TODO add enum
    icon_url : { type: String },  // #TODO see if their is type for URL, to check for live links for images
    cover_image_url : { type: String },
    profile_image_url : { type: String }, 
    // courier_details : { type: String },  // #TODO add details

    details : {  
      last_updated: { type: Date },
      estimated_total_num_of_purchases: { type: Number },
      // revenue: { type: Number }, // in USD
      valuation: { type: Number }, // in USD
      // employees: { type: Number },
      // world_alexa_rank: { type: Number },
      // india_alexa_rank: { type: Number },
      // type: { type: [String] }, // #TODO enum list of types of productCats: stores, agents, boutique, etc...
      // language_availability: { type: [String] }, // #TODO list of locals like en-us or en-uk
      // launched: { type: Date },
      // current_status: { type: String }, // #TODO enum for online, offline, recently lauched, out of business etc...
      // registration_requirement: { type: [String] }, // #TODO registration required for these activities, like buying digital content
      // slogan: { type: String },
      // sister_sites:  { type: [String] }, //["Flipkart.com", "Electronic Wallet","Mime360.com", "Chakpak.com"],
      // services:  { type: String }, //"Electronic commerce",
      industry:  { type: [String] }, //["Internet","Online retailing"],
      // area_served:  { type: [String] }, // ["India", "Southe East Asia" ]
    },

    // birthday: {
    //   day:     { type: Number, min: 1, max: 31, required: false },
    //   month:   { type: Number, min: 1, max: 12, required: false },
    //   year:    { type: Number }
    // },

    // pscategory_all:   [{type: String}],

    submitted:  { type: Date },
    
    source :    { type: [String] }, // productCat Info originated from which location
    
    // location:   {type: String},
    // location:   {type: geo},

    verified:  { type: Boolean },
    source: { type: String }, // if null or undefined, then orginated from the site itself
    // last_updated: { type: Date, default: Date.now },

    Meta: [MetaProductCat],
  });


  var ProductCat = mongoose.model('ProductCat', ProductCatSchema);

  var findById = function(productCatId, callback) {
    ProductCat.findOne({_id:productCatId}, function(err, productCat) {
      callback(productCat);
    });
  }

  // var findByIdPopulated = function(productCatId, callback) {
  //   ProductCat
  //   .findOne({_id:productCatId})
  //   .populate('_author')
  //   .exec(function(err, productCat){
  //     callback(productCat);
  //     // if (err)
  //     //   return handleError(err);
  //   });
  //   // });
  // }

  var findByPubId = function(productCatPubId, callback) {
    ProductCat.findOne({pub_id:productCatPubId}, function(err, productCat) {
      callback(err, productCat);
    });
  }
 
  // utility functions

  // var register = function(email, password, firstName, lastName, verificationUrl, callback) 
  
  var createProductCat = function(productCatObj, callback) {
    console.log("in createProductCat function")

    models.PublicCounter.getNextSequence("ProductCat", function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      if (!seq){
        console.log("Got No Sequence Number from counter collection");
        // throw error;
      }
      productCatObj.pub_id = seq;
      var productCat = new ProductCat(productCatObj);
      
      productCat.save(function(err, saved_productCat) {
        callback(err, saved_productCat);
      });  
    });

  }


  return {
    findById: findById,
    // findByIdPopulated: findByIdPopulated,
    createProductCat: createProductCat,
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    ProductCat: ProductCat
  }
}
