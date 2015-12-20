module.exports = function(config, mongoose, public_counter) {

  // Import models
  var models = {
    // PublicCounter: require('./PublicCounter')(config, mongoose),
    PublicCounter: public_counter,
  };

  mongoose.set('debug', true);

  // Schema = mongoose.Schema;

  var PostDiffSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},

    pub_id: { type: Number },

    // _author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', index: true },

    _suggestion: {type: Boolean},

    _accepted: {type: Boolean},

    summary_text: { type: String },

    collection_name: { type: String }, // #TODO add enum for [Question | Answer | Shopex | Comment]
    document_id: { type: mongoose.Schema.Types.ObjectId }, 

    query_field_key: { type: String }, // for example "_id" or "pub_id", this is the field name to be used for querying the collection
    query_field_value: {}, // this will be the value of that field for the document we want to check in the given collection.

    // each element of this array will be a shorter version of the documents from the collection, this shorter version 
    // will have only those field which are possible to edit for that document. and the value itself will be the diff.

    // The diff in the case of edit history will be incremental from the previous version of the post
    edit_hist_diff_arr: [],
    edit_hist_diff_arr_meta: [{
      edit_author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
    }],
    // The diff in the case of suggestion will be w.r.t to the latest version of the post
    // accepting/rejecting a suggestion will remove that entry from this array
    edit_sugg_diff_arr: [],
    edit_sugg_diff_arr_meta: [{ 
      sugg_author: { type: mongoose.Schema.Types.ObjectId, ref: 'Account'},
      sugg_accepted: { type: Boolean },
      // sugg_viewed: { type: Boolean },    // if this has been viewed by someone who can accept/reject the suggestion
      sugg_wrt: { type: Number },
      // This will be the index of the array in edit_hist_diff_arr w.r.t which the suggestion was made
      // This will be 0-indexed number and if the edit hist diff arr increases in size (it cannot decrease) then no problem will occur
    }],
    
    submitted:  { type: Date },
    
    anon:  { type: Boolean }, // "on" or "off"
    
    verified:  { type: Boolean },
    source: { type: String }, // if null or undefined, then orginated from the site itself
    last_updated: { type: Date, default: Date.now },
  });


  var PostDiff = mongoose.model('PostDiff', PostDiffSchema);

  var findById = function(postDiffId, callback) {
    PostDiff.findOne({_id:postDiffId}, function(err, postDiff) {
      callback(postDiff);
    });
  }

  var findByCollectionQuery = function(collection_name, query_field_key, query_field_value, callback) {
    query = { collection_name: collection_name };
    query[query_field_key] = query_field_value;

    PostDiff.findOne(query, function(err, postDiff) {
      callback(postDiff);
    });
  }

  var findByCollectionDocumentId = function(collection_name, document_id, callback) {
    query = { collection_name: collection_name, document_id: document_id };

    PostDiff.findOne(query, function(err, postDiff) {
      callback(postDiff);
    });
  }

  // var findByIdPopulated = function(postDiffId, callback) {
  //   // PostDiff.findOne({_id:postDiffId}, function(err, postDiff) {
  //   // callback(postDiff);
  //   PostDiff
  //   .findOne({_id:postDiffId})
  //   .populate('_author')
  //   .exec(function(err, postDiff){
  //     callback(postDiff);
  //     // if (err)
  //     //   return handleError(err);
  //   });
  //   // });
  // }

  // var findByPubId = function(postDiffPubId, callback) {
  //   PostDiff.findOne({pub_id:postDiffPubId}, function(err, postDiff) {
  //     callback(postDiff);
  //   });
  // }

  // var findByPubIdPopulated = function(postDiffPubId, callback) {
  //   // PostDiff.findOne({_id:postDiffId}, function(err, postDiff) {
  //   // callback(postDiff);
  //   PostDiff
  //   .findOne({pub_id:postDiffPubId})
  //   .populate('_author')
  //   .exec(function(err, postDiff){
  //     callback(postDiff);
  //     // if (err)
  //     //   return handleError(err);
  //   });
  //   // });
  // }

 
  // utility functions
  
  // var register = function(email, password, firstName, lastName, verificationUrl, callback) 
  
  // var createPost = function(postDiffObj, callback) {
  //   console.log("in createPost function")

  //   models.PublicCounter.getNextSequence("PostDiff", function(seq){
  //     // need to add pub_id auto increment counter sync with auto increment counter collection
      
  //     if (!seq){
  //       console.log("Got No Sequence Number from counter collection");
  //       // throw error;
  //     }
  //     postDiffObj.pub_id = seq;
  //     var postDiff = new PostDiff(postDiffObj);
      
  //     postDiff.save(function(err, saved_postDiff) {
  //       callback(err, saved_postDiff);
  //     });  
  //   });

  // }


  return {
    findById: findById,
  
    findByCollectionQuery: findByCollectionQuery,
    findByCollectionDocumentId: findByCollectionDocumentId,
    // createPost: createPost,
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    PostDiff: PostDiff
  }
}
