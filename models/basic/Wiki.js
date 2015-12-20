module.exports = function(config, mongoose, models) {

  mongoose.set('debug', true);

  var WikiSchema = new mongoose.Schema({
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


    wiki_title: { type: String }, // title of the wiki
    wiki_text: { type: String },  // wiki details 

    _answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }],
    _related_wikis: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Wiki' }],

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

    // #TODO implement edit suggestions
    // There will be  suggestions to edit answer

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


    anon:  { type: Boolean }, // "on" or "off"
    
    location:   {type: String},
    // location:   {type: geo},

    verified:  { type: Boolean },
    source: { type: String }, // if null or undefined, then orginated from the site itself

    meta_info: {
      value: {type: Number},                    //overall value of this post
      views: {type: Number},                    //number of views (readers)
      upvotes: {type: Number},                    //number of upvotes (upvoters)
      followers: {type: Number},                    //number of followers (followers)
      favs: {type: Number},                    //number of favorites (bookmarkers) 
      edits: {type: Number},                    //number of edits (versions) 
      editors: {type: Number},                    //number of editors (collaborators) 
      flags: [{type: Number}],                       //number of flags raised, different types of flag counts
      shared: [{type: Number}],                  // number of times shared on each of the social networks
    },

  }, { autoIndex: false });

  WikiSchema.pre('save', function(next){

    console.log("^^^^^^^^^^^ @@@@@@@ $$$$$$$$$$$ inside pre save")


    this.updated_at = new Date;
    // this.meta_info.value = this.meta_info.upvotes;

    if ( !this.created_at ) {
      this.created_at = new Date;
    
      // this.populate('_author', '_seller', '_pro_cat')
      this.populate('_author')
      procat = this.pscategory.split(',')[0].replace(" ","_");
      // console.log("procat:", procat);
      this.permalink = "/wiki/"+this.vendor+"/"+procat+"/"+this.pub_id;

      // var wiki = new Wiki(wikiObj);

      // this._seller.site_domain = this.vendor.split('+')[0];
      // this._seller.pub_id = this.vendor.split('+')[1];
      // thatsellerid = this._seller.id;
      // that = this;


      // #TODO move this from pre() to post() 
      // #TODO and write a function to increment wiki count for Sellers and ProductCat
      // models.Seller.Model.findOne({
      //   site_domain: this._seller.site_domain
      // }, function(err, seller){

      //     if (err || !seller) return;

      //     if (!seller.meta_info.wiki_count) {
      //       seller.save(function(err, saved_seller){
      //         console.log("seller.meta_info.wiki_count", saved_seller.meta_info.wiki_count);
      //         saved_seller.meta_info.wiki_count = 1
      //         saved_seller.save();
      //       })
      //     } else {
      //       seller.meta_info.wiki_count += 1
      //       seller.save();
      //     }

      // })

      

      pscats_arr = this.pscategory.split(',');

      for (var i = 0; i < pscats_arr.length; ++i) {
        ps_name = pscats_arr[i].split('+')[0];
        ps_pub_id = pscats_arr[i].split('+')[1];

      //   this._pro_cat.name.push(ps_name);
      //   this._pro_cat.pub_id.push(ps_pub_id);

      //   // #TODO move this from pre() to post() 
      //   // #TODO and write a function to increment wiki count for Sellers and ProductCat
      //   models.ProductCat.Model.findOne({
      //     name: ps_name
      //   }, function(err, procat){

      //     if (err || !procat) return;
          
      //     if (!procat.meta_info.wiki_count) {
      //       console.log("#####################################################################################")
      //       procat.save(function(err, saved_procat){
      //         console.log("###########$$##########################################################################")
      //         console.log("procat.meta_info.wiki_count", saved_procat.meta_info.wiki_count);
      //         saved_procat.meta_info.wiki_count = 1
      //         saved_procat.save();
      //       })
      //     } else {
      //       console.log("###########@@##########################################################################")
      //       procat.meta_info.wiki_count += 1
      //       procat.save();
      //     }
      //   });          
      // }

      this.meta_info = {
        value: 10,                     //overall value of this post
        views: 1,                      //number of views (readers)
        upvotes: 1,                    //number of upvotes (upvoters)
        followers: 1,                    //number of upvotes (upvoters)
        favs: 1,                       //number of favorites (bookmarkers) 
        edits: 1,                      //number of edits (versions) 
        editors: 1,                      //number of edits (versions) 
        flags: [],                     //number of flags raised, different types of flag counts
      };
    } // when created

    next();
  });


  WikiSchema.post('save', function(wiki_doc){

    console.log("@@@@@@@ $$$$$$$$$$$ inside post save")

    // // #TODO write a function for adding the wiki pub_id to Seller in Seller Model
    // models.Seller.Model.findOne({pub_id: wiki_doc._seller.pub_id}, function(err, seller_doc){
    //   if (!err && seller_doc){
    //     seller_doc._wikis_pub_id.push(wiki_doc.pub_id);
    //     seller_doc.save();
    //     console.log("@@@@@@@ wiki id pushed in seller")
    //   }
    // })

    // // #TODO write a function for adding the wiki pub_id to Seller in ProductCat Model
    // for (var i = 0; i < wiki_doc._pro_cat.pub_id.length; ++i){
    //   models.ProductCat.Model.findOne({pub_id: wiki_doc._pro_cat.pub_id[i]}, function(err, procat_doc){
    //     if (!err && procat_doc){
    //       procat_doc._wikis_pub_id.push(wiki_doc.pub_id);
    //       procat_doc.save();
    //       console.log("@@@@@@@ wiki id pushed in procat num:", i)
    //     }
    //   });
    // }

  });

  // function rcomment_validator (comment) {
  //   return (comment.length <= 137);
  // };

  // function rating_validator (rating) {
  //   return (rating >= 0 && rating <= 5);
  // };


  var Wiki = mongoose.model('Wiki', WikiSchema);
  
  // return {
  //   Model: Wiki,
  // };

  //#CHECK#DONE see if this gets returned else return the above Object [its working]
  return Wiki;
}