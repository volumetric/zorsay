module.exports = function(config, mongoose, models) {

  var jsdiff = require("diff");
  // Import models
  // var models = {
  //   // PublicCounter: require('./PublicCounter')(config, mongoose),
  //   PublicCounter: public_counter,
  // };

  mongoose.set('debug', true);

  // var MetaPost = new mongoose.Schema({
  //   value: {type: Number},                    //overall value of this post
  //   views: {type: Number},                    //number of views (readers)
  //   upvotes: {type: Number},                    //number of upvotes (upvoters)
  //   // followers: {type: Number},                    //number of followers (followers)
  //   favs: {type: Number},                    //number of favorites (bookmarkers) 
  //   edits: {type: Number},                    //number of edits (versions) 
  //   // editors: {type: Number},                    //number of editors (collaborators) 
  //   flags: [{type: Number}],                       //number of flags raised, different types of flag counts
  // })

  // Schema = mongoose.Schema;

  var ShopexSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},

    // created_at: {type: Date, required: true, default: Date.now },
    created_at: {type: Date },
    // updated_at: {type: Date, required: true, default: Date.now },
    updated_at: {type: Date },

    pub_id: { type: Number },

    _author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },
    _upvoters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }],

    // // making array of array of account refs for diff types of flag raisers #CHECK #TODO
    _flaggers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Account' }], 

    review_text: { type: String },

    _seller: {
      site_domain: { type: String }, // site domain for the seller, frequently used
      id: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', index: true },
      pub_id: { type: Number, ref: 'Seller', index: true },
      // dummy: { type: String }, // site domain for the seller, frequently used
    },

    permalink: {type: String},
    
    // making array of ps_cat refs with multikey indexing on their ids #CHECK        
    // _pro_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ProductCat', index: true }],
    _pro_cat: {
      name: { type: [String] },
      id: { type: [mongoose.Schema.Types.ObjectId], ref: 'ProductCat', index: true },
      pub_id: { type: [Number], ref: 'ProductCat', index: true },
    },

    // _pro: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', index: true }],
    _pro: {
      name: { type: [String] },
      id: { type: [mongoose.Schema.Types.ObjectId], ref: 'Product', index: true },
      pub_id: { type: [Number], ref: 'Product', index: true },
    },
    
    // _ser_cat: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceCat', index: true }],
    _ser_cat:  {
      name: { type: [String] },
      id: { type: [mongoose.Schema.Types.ObjectId], ref: 'ServiceCat', index: true },
      pub_id: { type: [Number], ref: 'ServiceCat', index: true },
    },
    
    // _ser: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Service', index: true }],
    _ser: {
      name: { type: [String] },
      id: { type: [mongoose.Schema.Types.ObjectId], ref: 'Service', index: true },
      pub_id: { type: [Number], ref: 'Service', index: true },
    },
    


    // ref to EditsSuggestionsHistory collection for edit version histroy and edit suggestion
    // _edit_sugg: { type: mongoose.Schema.Types.ObjectId, ref: 'PostDiff'},

    // The diff in the case of edit history will be incremental from the previous version of the post
    edit_hist_diff_arr: [],
    edit_hist_diff_arr_meta: [{
      edit_author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'}, // if null or undefined then same as _author
      edit_summary: { type: String },
      submitted:  { type: Date },
    }],

    // The diff in the case of suggestion will be w.r.t to the latest version of the post
    // accepting/rejecting a suggestion will remove that entry from this array

    // There won't be any suggestions to edit shopex

    // edit_sugg_diff_arr: [],
    // edit_sugg_diff_arr_meta: [{ 
    //   sugg_author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'}, // anon if null or undefined
    //   sugg_accepted: { type: Boolean }, // if this field is undefined, then the edit has not been viewed or judged 
    //   sugg_wrt: { type: Number },
    //   submitted:  { type: Date },
    //   // This will be the index of the array in edit_hist_diff_arr w.r.t which the suggestion was made
    //   // This will be 0-indexed number and if the edit hist diff arr increases in size (it cannot decrease) then no problem will occur
    // }],

    
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

    // Meta: [MetaPost],
    meta_info: {
      value: {type: Number},                    //overall value of this post
      views: {type: Number},                    //number of views (readers)
      upvotes: {type: Number},                    //number of upvotes (upvoters)
      // followers: {type: Number},                    //number of followers (followers)
      favs: {type: Number},                    //number of favorites (bookmarkers) 
      edits: {type: Number},                    //number of edits (versions) 
      // editors: {type: Number},                    //number of editors (collaborators) 
      flags: [{type: Number}],                       //number of flags raised, different types of flag counts
      shared: [{type: Number}],                  // number of times shared on each of the social networks
    },

    // anonymous: { type: Boolean },
    // version_history: [ShopexSchema],
    // version_history: [ShopexSchemaDiff]
  }, { autoIndex: false });

  ShopexSchema.pre('save', function(next){

    console.log("^^^^^^^^^^^ @@@@@@@ $$$$$$$$$$$ inside pre save")


    this.updated_at = new Date;
    // this.meta_info.value = this.meta_info.upvotes;

    if ( !this.created_at ) {
      this.created_at = new Date;
    
      // this.populate('_author', '_seller', '_pro_cat')
      this.populate('_author')
      procat = this.pscategory.split(',')[0].replace(" ","_");
      // console.log("procat:", procat);
      this.permalink = "/shopping-experience/"+this.vendor+"/"+procat+"/"+this.pub_id;

      // var shopex = new Shopex(shopexObj);

      this._seller.site_domain = this.vendor.split('+')[0];
      this._seller.pub_id = this.vendor.split('+')[1];
      // thatsellerid = this._seller.id;
      // that = this;

      models.Seller.Model.findOne({
        site_domain: this._seller.site_domain
      }, function(err, seller){

          if (err || !seller) return;

          if (!seller.meta_info.shopex_count) {
            seller.save(function(err, saved_seller){
              console.log("seller.meta_info.shopex_count", saved_seller.meta_info.shopex_count);
              saved_seller.meta_info.shopex_count = 1
              saved_seller.save();
            })
          } else {
            seller.meta_info.shopex_count += 1
            seller.save();
          }

      })

      // console.log(this.vendor);

      // var food = function(err, seller){
          
      //     if (err || !seller){
      //       console.log("FFFFFFFFffffffffffffffffffffffffffffffffFFFFFFFFFFFFfffffffffffFFFFFFFFFfffffffFFFFFFFFfffffffFFFFFfffffffff");
      //       // that._seller.dummy = "ddd";
      //       this._seller.dummy = "ddd";
      //       return;
      //     }
      //     this._seller.dummy = "kkk";

      //     // seller.save(function(){
      //     //   if (!seller.meta_info.shopex_count) {
      //     //     seller.meta_info.shopex_count = 1
      //     //   } else {
      //     //     seller.meta_info.shopex_count += 1
      //     //   }  
      //     // });
          
      //     // console.log("%%% callbacl from getIdByQuery %%%")
      //     if (err || !seller) {
      //       // console.log("%%% got no id from getIdByQuery %%%")
      //       this._seller.id = null;
      //     } else { 
      //       // console.log("%%% got some id from getIdByQuery %%%", seller._id)
      //       this._seller.id = seller._id;
      //     }


      //     console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV")
      //     console.log(this)
      //     console.log("VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV")
      //     // that.save();

      //     if (!seller.meta_info.shopex_count) {
      //       seller.save(function(){
      //         console.log("seller.meta_info.shopex_count", seller.meta_info.shopex_count);
      //         seller.meta_info.shopex_count = 1
      //         seller.save();
      //       })
      //     } else {
      //       seller.meta_info.shopex_count += 1
      //       seller.save();
      //     }

      //   };

      // (function foo (that){

        // console.log(this);
        // console.log("calling getIdByQuery---------------");

        // models.Seller.getIdByQuery({
        //   site_domain: this.vendor
        // }, food.bind(this));  
        // }, food);  

      // })(this);

      

      pscats_arr = this.pscategory.split(',');

      for (var i = 0; i < pscats_arr.length; ++i) {
        ps_name = pscats_arr[i].split('+')[0];
        ps_pub_id = pscats_arr[i].split('+')[1];

        this._pro_cat.name.push(ps_name);
        this._pro_cat.pub_id.push(ps_pub_id);

        models.ProductCat.Model.findOne({
          name: ps_name
        }, function(err, procat){

          if (err || !procat) return;
          
          // seller.save(function(){
          //   if (!seller.meta_info.shopex_count) {
          //     seller.meta_info.shopex_count = 1
          //   } else {
          //     seller.meta_info.shopex_count += 1
          //   }  
          // });
          
          // // console.log("%%% callbacl from getIdByQuery %%%")
          // if (err || !procat) {
          //   // console.log("%%% got no id from getIdByQuery %%%")
          //   // that._seller.id = null;
          // } else { 
          //   // console.log("%%% got some id from getIdByQuery %%%", seller._id)
          //   that._pro_cat.id.push(procat._id);
          //   // that._pro_cat.id = seller._id;
          // }
          // // that.save();


          if (!procat.meta_info.shopex_count) {
            console.log("#####################################################################################")
            procat.save(function(err, saved_procat){
              console.log("###########$$##########################################################################")
              console.log("procat.meta_info.shopex_count", saved_procat.meta_info.shopex_count);
              saved_procat.meta_info.shopex_count = 1
              saved_procat.save();
            })
          } else {
            console.log("###########@@##########################################################################")
            procat.meta_info.shopex_count += 1
            procat.save();
          }
        });          
      }

      this.meta_info = {
        value: 10,                     //overall value of this post
        views: 1,                      //number of views (readers)
        upvotes: 1,                    //number of upvotes (upvoters)
        favs: 1,                       //number of favorites (bookmarkers) 
        edits: 1,                      //number of edits (versions) 
        flags: [],                     //number of flags raised, different types of flag counts
      };

      // var mp = new MetaPost(mpObj);

      // this.Meta.push(mpObj);
    } // when created

    next();
  });


  ShopexSchema.post('save', function(shopex_doc){

    console.log("@@@@@@@ $$$$$$$$$$$ inside post save")

    models.Seller.Model.findOne({pub_id: shopex_doc._seller.pub_id}, function(err, seller_doc){
      if (!err && seller_doc){
        seller_doc._shopexes_pub_id.push(shopex_doc.pub_id);
        seller_doc.save();
        console.log("@@@@@@@ shopex id pushed in seller")
      }
    })

    for (var i = 0; i < shopex_doc._pro_cat.pub_id.length; ++i){
      models.ProductCat.Model.findOne({pub_id: shopex_doc._pro_cat.pub_id[i]}, function(err, procat_doc){
        if (!err && procat_doc){
          procat_doc._shopexes_pub_id.push(shopex_doc.pub_id);
          procat_doc.save();
          console.log("@@@@@@@ shopex id pushed in procat num:", i)
        }
      });
    }

  });

  // function rcomment_validator (comment) {
  //   return (comment.length <= 137);
  // };

  // function rating_validator (rating) {
  //   return (rating >= 0 && rating <= 5);
  // };


  var Shopex = mongoose.model('Shopex', ShopexSchema);

  var findById = function(shopexId, callback) {
    Shopex.findOne({_id:shopexId}, function(err, shopex) {
      callback(shopex);
    });
  }

  var findByIdPopulated = function(shopexId, callback) {
    // Shopex.findOne({_id:shopexId}, function(err, shopex) {
    // callback(shopex);
    Shopex
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
    Shopex.findOne({pub_id:shopexPubId}, function(err, shopex) {
      callback(err, shopex);
    });
  }

  var findByPubIdPopulated = function(shopexPubId, callback) {
    // Shopex.findOne({_id:shopexId}, function(err, shopex) {
    // callback(shopex);
    Shopex
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

  var getAuthorId = function(shopexPubId, callback) {
    Shopex.findOne({pub_id:shopexPubId}, function(err, shopex) {
      callback(err, shopex._author);
    });
  }

  var getAuthorInfo = function(shopexPubId, callback) {
    Shopex
    .findOne({pub_id:shopexPubId})
    .populate('_author')
    .exec(function(err, shopex){
      // if (err) return handleError(err);
      callback(err, { 
        name: shopex._author.name,
        email: shopex._author.email,
        last_seen: shopex._author.last_seen,
        img_icon_url: shopex._author.img_icon_url,
        });
    });
  }

  var getAuthor = function(shopexPubId, callback) {
    Shopex
    .findOne({pub_id:shopexPubId})
    .populate('_author')
    .exec(function(err, shopex){
      // if (err) return handleError(err);
      callback(err, shopex._author);
    });
  }

  var getComments = function(shopexPubId, callback) {
    Shopex
    .findOne({pub_id:shopexPubId})
    .populate('_comments')
    .exec(function(err, shopex){
      // if (err) return handleError(err);
      callback(err, shopex._comments);
    });
  }

  // #TODO implement this fucker #DONE
  var addComment = function(shopexPubId, commentId, callback) {
    Shopex.findOne({pub_id:shopexPubId}, function(err, shopex_doc){
      shopex_doc._comments.push(commentId);
    });
  }

  // var register = function(email, password, firstName, lastName, verificationUrl, callback) 
  
  var createPost = function(shopexObj, callback) {
    console.log("in createPost function")

    models.PublicCounter.getNextSequence("Shopex", function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      if (!seq){
        console.log("Got No Sequence Number from counter collection");
        // throw error;
      }
      shopexObj.pub_id = seq;
      var shopex = new Shopex(shopexObj);
      
      shopex.save(function(err, saved_shopex) {
        callback(err, saved_shopex);
      });  
    });

  }

  // // diff on basic varibel types, string, number, boolean etc...
  // // #TODO#DONE implement this function
  // var basicDiff = function(a, b) {

  // }

  var createObjPatch = function(fileId, obj1, obj2, diff_fields, callback) {
    // do the diff and put the results in diffObj
    // diff_fields is [string], which are the fields on which to take the diff
    patchObj = {};
    for (var i = 0; i < diff_fields.length; ++i){
      key = diff_fields[i];
      
      if (typeof(obj1[key]) == undefined || obj1[key] == undefined || obj1[key] == null)
        obj1[key] = "";
        
      if (typeof(obj2[key]) == undefined || obj2[key] == undefined || obj2[key] == null)
        continue;

      if (obj1[key] == obj2[key])
        continue;

      // typecasting to string will happen inside this function
      // patchObj[key] = jsdiff.createPatch(fileId, obj1[key], obj2[key]);
      patchObj[key] = jsdiff.createPatch(fileId, JSON.stringify(obj1[key]), JSON.stringify(obj2[key]));
    }
    callback(null, patchObj);
  }

  var applyObjPatch = function(oldObj, patchObj, callback) {
    newObj = {};
    patchObj_keys = Object.keys(patchObj);

    for (var i = 0; i < patchObj_keys.length; ++i){
      key = patchObj_keys[i];

      newObj[key] = jsdiff.applyPatch(oldObj[key], patchObj[key]);
    }
    callback(null, newObj);
  }

  var getObjVersion = function(shopexPubId, version_num, callback) {
    // #TODO implement this function
    // find the shopex with shopexPubId
    // incremently apply patch till version_num from the edit_hist_diff_arr
  }



  var updatePost = function(shopexPubId, shopexObj, summary, callback) {
    console.log("inside updatePost function for shopex pub_id:", shopexPubId);

    diff_fields = ["review_text","reviewText","anonymous","anon","location","otd_rating","pad_rating","pri_rating","pro_rating","eos_rating","rrp_rating","csu_rating","all_rating","otd_comment","pad_comment","pri_comment","pro_comment","eos_comment","rrp_comment","csu_comment"];

    this.findByPubId(shopexPubId, function(err, shopex_doc){
      if (err || !shopex_doc){
        callback(err, null);
        return;
      }

      createObjPatch("sx_"+shopexPubId, shopex_doc, shopexObj, diff_fields, function(err, patch){
        shopex_doc.edit_hist_diff_arr.push(patch);
        
        shopex_doc.edit_hist_diff_arr_meta.push({
          edit_summary: summary,
          submitted: Date.now(),
        });

        // shopex_doc.save(function(err, saved_shopex_doc) {
        //   callback(err, saved_shopex_doc);
        // });

        // #TODO#DONE update the shopex entry with the newest edit enrty saved
        keys = Object.keys(shopexObj);
        for (var i = 0; i < keys.length; ++i) {
          key = keys[i];
          shopex_doc[key] = shopexObj[key];
        }
        shopex_doc.save(function(err, saved_shopex_doc){
          callback(err, saved_shopex_doc);
        });
      });
    });
  }


  var getPostsByTime = function(callback) {
    Shopex.find().sort({
      _id: -1,
      // created_at: 1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeLimitCount = function(limit, callback) {
    Shopex.find().sort({
      _id: -1,
      // created_at: 1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeSkipLimit = function(skip, limit, callback) {
    Shopex.find().sort({
      _id: -1,
      // created_at: 1,
    }).skip(skip).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeQuery = function(objId, callback) {
    Shopex.find({
      _id: {$lt: objId},
    }).sort({
      _id: -1,
      // created_at: 1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByTimeQueryLimit = function(objId, limit, callback) {
    Shopex.find({
      _id: {$lt: objId},
    }).sort({
      _id: -1,
      // created_at: 1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  // Getting posts by their value or upvotes [Start]

  var getPostsByValue = function(callback) {
    Shopex.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueLimitCount = function(limit, callback) {
    Shopex.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueSkipLimit = function(skip, limit, callback) {
    Shopex.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).skip(skip).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueQuery = function(lastValue, callback) {
    Shopex.find({
      'meta_info.value': {$lt: lastValue},
      // 'meta_info.upvotes': {$lt: lastValue},
    }).sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getPostsByValueQueryLimit = function(objId, limit, callback) {
    Shopex.find({
      'meta_info.value': {$lt: lastValue},
      // 'meta_info.upvotes': {$lt: lastValue},
    }).sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  // Getting posts by their value or upvotes [End]

  var _shopexUpVote = function(found_shopex, callback) {
    found_shopex.meta_info.upvotes += 1
    // found_shopex.meta_info.value += 1
    found_shopex.save(function(err, saved_shopex){
      callback(err, saved_shopex);
    })
  }

  var _shopexDownVote = function(found_shopex, callback) {
    found_shopex.meta_info.downvotes += 1
    // found_shopex.meta_info.value += 1
    found_shopex.save(function(err, saved_shopex){
      callback(err, saved_shopex);
    })
  }

  var upvote = function(shopexPubId, callback) {
    Shopex.findOne({pub_id: shopexPubId}, function(err, found_shopex){
      if (!found_shopex.meta_info){
        found_shopex.save(function(){
          // _shopexUpvote(found_shopex, callback);
          found_shopex.meta_info.upvotes = 1
          // found_shopex.meta_info.value += 1
          found_shopex.save(function(err, saved_shopex){
            callback(err, saved_shopex);
          })
        });
      } else {
        _shopexUpVote(found_shopex, callback);
      }
    })
  }

  var downvote = function(shopexPubId, callback) {
    Shopex.findOne({pub_id: shopexPubId}, function(err, found_shopex){
      if (!found_shopex.meta_info){
        found_shopex.save(function(){
          // _shopexUpvote(found_shopex, callback);
          found_shopex.meta_info.downvotes = 1
          // found_shopex.meta_info.value += 1
          found_shopex.save(function(err, saved_shopex){
            callback(err, saved_shopex);
          })
        });
      } else {
        _shopexDownVote(found_shopex, callback);
      }
    })
  }

  var _shopexUpvalue = function(found_shopex, val, callback) {
    found_shopex.meta_info.value += val
    // found_shopex.meta_info.value += 1
    found_shopex.save(function(err, saved_shopex){
      callback(err, saved_shopex);
    })
  }

  var updateValue = function(shopexPubId, val, callback) {
    Shopex.findOne({pub_id: shopexPubId}, function(err, found_shopex){
      if (!found_shopex.meta_info){
        found_shopex.save(function(){
          // _shopexUpvote(found_shopex, callback);
          found_shopex.meta_info.value = val
          // found_shopex.meta_info.value += 1
          found_shopex.save(function(err, saved_shopex){
            callback(err, saved_shopex);
          })
        });
      } else {
        _shopexUpvalue(found_shopex, val, callback);
      }
    })
  }



  // args will be bunch of key, val, alternatively given 
  // key should be according to the object inner structure, like for a nested key full key name from top level is expected
  // # means that the suffix is actually an index and prefix is an array and update has to be made on that index of the array
  // var updatePost = function() {
    
  // }

  // args will be bunch of key, val, alternatively given 
  // key is expected to be for MetaPost subdocument top level
  // # means that the suffix is actually an index and prefix is an array and update has to be made on that index of the array
  // var updateMetaPost = function() {

  // }

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
    updatePost: updatePost,

    getPostsByTime: getPostsByTime,
    getPostsByTimeLimitCount: getPostsByTimeLimitCount,
    getPostsByTimeSkipLimit: getPostsByTimeSkipLimit,
    getPostsByTimeQuery: getPostsByTimeQuery,
    getPostsByTimeQueryLimit: getPostsByTimeQueryLimit,

    getPostsByValue: getPostsByValue,
    getPostsByValueLimitCount: getPostsByValueLimitCount,
    getPostsByValueSkipLimit: getPostsByValueSkipLimit,
    getPostsByValueQuery: getPostsByValueQuery,
    getPostsByValueQueryLimit: getPostsByValueQueryLimit,

    upvote: upvote,
    downvote: downvote,
    updateValue: updateValue,

    getAuthorId: getAuthorId,
    getAuthorInfo: getAuthorInfo,
    getAuthor: getAuthor,
    getComments: getComments,
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    Model: Shopex,
  }
}
