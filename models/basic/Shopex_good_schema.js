module.exports = function(config, mongoose, models, modelName) {

  mongoose.set('debug', true);

  var ShopexSchema = new mongoose.Schema({
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
    content_title: { type: String },
    content_text: { type: String },
    anon: { type: Boolean, default: false },
    
    otd_rating: { type: Number },
    pad_rating: { type: Number },
    pri_rating: { type: Number },
    pro_rating: { type: Number },
    eos_rating: { type: Number },
    csu_rating: { type: Number },
    rrp_rating: { type: Number },
    
    all_rating: { type: Number },

    otd_comment:{ type: String },
    pad_comment:{ type: String },
    pri_comment:{ type: String },
    pro_comment:{ type: String },
    eos_comment:{ type: String },
    csu_comment:{ type: String },
    rrp_comment:{ type: String },

    location: { type: String, index: "text" }, // location: {type: geo}, #TODO
    areacode: { type: Number, index: true },
    prod_links: [{ type: String }],

    // will get the month and year from the form
    order: { type: Date },
    delivery: { type: Date }, // 15th of a month and year


    // ### associations ###
    _author: { type: Number, ref: 'Account', index: true },

    _related_shopexes: [{ type: Number, ref: 'Shopex' }],
    _comments: [{ type: Number, ref: 'Comment' }],

    _seller: { type: Number, ref: 'Seller', index: true, required: true },

    // making array of refs with multikey indexing on their ids #CHECK #TODO
    _pro_cat: [{ type: Number, ref: 'ProductCat', index: true }],
    _pro: [{ type: Number, ref: 'Product', index: true }],

    _ser_cat: [{ type: Number, ref: 'ServiceCat', index: true }],
    _ser: [{ type: Number, ref: 'Service', index: true }],

    _primary_pro_cat: { type: Number, ref: 'ProductCat' },
    _primary_ser_cat: { type: Number, ref: 'ServiceCat' },

    // ### edits ###
    // edit history diff will be incremental from previous versions of the post
    edit_hist_diff_arr: [],
    
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
      favors: [{ type: Number, ref: 'Account' }],
      sharers: [{ type: Number, ref: 'Account' }],
    
      //array of array of account refs for diff types of flag raisers #TODO
      flaggers: [{ type: Number, ref: 'Account' }],

      edits: {type: Number}, //number of edits made on this post (versions) 
      editors: [{ type: Number, ref: 'Account' }],
    },

  }, { autoIndex: true });

  ShopexSchema.pre('save', function(next){
    this.updated_at = new Date;
      
    //   if (this._primary_pro_cat)
    //     this.permalink += this._primary_pro_cat+"/";
    //   else if (this._primary_ser_cat)
    //     this.permalink += this._primary_ser_cat+"/";
    // }

    // if this is a new post and being saved for the first time
    if ( !this.created_at ) {
      this.created_at = new Date;
      this.obj_id = mongoose.Types.ObjectId();


      // #TODO#CANCEL move this from pre() to post() --> i thought of move this to post() because earlier, _id generation was happening after saving the document, and _id was required for setting things like permalink etc. But now _id is provided before saving using publicCounter, so its better to put it in pre() and thus no requiring mutiple saving of document.

      // #TODO#CANCEL write a function to associate shopex with Sellers and PSCats --> These associations will be very inefficient, instead of that realtime filters will be used for categorizing Posts among different nodes.

      this.vote_count = 1;
      this.meta_info = {
        value: 50, //overall value of this post
      
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

    if (this._id){
      // this.permalink = "/shopping-experience/"+this._id+"/"+this._seller.name+"/"+this._primary_pro_cat.name;
      var this_doc = this;
      var permalink = "/shopping-experience/"+this._id;
      var content_title = "Online Shopping for ";

      var pcas = JSON.stringify(this._pro_cat);
      var scas = JSON.stringify(this._ser_cat);

      models.Seller.getNameById(this._seller, function(err1, seller_doc){

        // #TODO if the seller and category id is not fouund in the db then stop the process of shopex creation and send a 412 or 503 or something

        models.ProductCat.getNamesByIds(pcas, function(err2, procat_docs){

          models.ServiceCat.getNamesByIds(scas, function(err3, sercat_docs){

            if (!err1 && seller_doc){
              permalink += "/" + seller_doc.url_name;
              // console.log(seller_doc.url_name);
            }

            if (!err2 && procat_docs){
              // for (i in procat_docs){
              // console.log(pcas);
              // console.log("========================");
              // console.log(procat_docs);

              for(var i = 0; i < procat_docs.length; ++i) {
                permalink += "/" + procat_docs[i].url_name;
                content_title += procat_docs[i].url_name;
                content_title += (i < procat_docs.length - 1) ? ', ' : '';
              }
              // console.log(permalink);
            }

            if (!err3 && sercat_docs){
              // for (i in sercat_docs){
              for(var i = 0; i < sercat_docs.length; ++i) {
                permalink += "/" + sercat_docs[i].url_name;
                content_title += procat_docs.length > 0 ? ", " : "";
                content_title += sercat_docs[i].url_name;
                content_title += (i < sercat_docs.length - 1) ? ', ' : '';
              }
              // console.log(permalink);
            }

            if (!err1 && seller_doc){
              content_title += " from ";
              content_title += seller_doc.url_name;
            }

            // console.log("----------------------------");
            // console.log(permalink);
            // console.log(content_title);
            // console.log("----------------------------");

            this_doc.permalink = permalink;
            this_doc.content_title = content_title;
            // This is required to be here, so that middleware goes to next step only when all the callbacks have done their job.
            next();
          });
        });
      });

    }
    // next();
  });


  ShopexSchema.post('save', function(shopex_doc){

    // #TODO implement addShopex() in Node Model
    // models.Seller.addShopex(shopex_doc._seller.pub_id, shopex_doc._id);

    // for (var i = 0; i < shopex_doc._pro_cat.length; ++i){
    //   models.ProductCat.addShopex(shopex_doc._pro_cat[i], shopex_doc._id);
    // }
    // for (var i = 0; i < shopex_doc._ser_cat.length; ++i){
    //   models.ServiceCat.addShopex(shopex_doc._ser_cat[i], shopex_doc._id);
    // }

  });

  // var Shopex = mongoose.model('Shopex', ShopexSchema);
  var Shopex = mongoose.model(modelName, ShopexSchema);

  return Shopex;
}