module.exports = function(config, mongoose) {

  mongoose.set('debug', true);

  var PublicCounterSchema = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},
    coll_name: { type: String, unique: true }, // collection name: [Shopex | Question | Answer | Comment| Other Posts]
    seq: {type: Number},

  });

  var PublicCounter = mongoose.model('PublicCounter', PublicCounterSchema);

  // http://docs.mongodb.org/manual/tutorial/create-an-auto-incrementing-field/
  // http://stackoverflow.com/questions/15123182/mongoose-findoneandupdate-not-working

  var autoIncrementCounter =  function(collection_name, callback){
    // console.log("in autoIncrementCounter function")
    
    // var ret = PublicCounter.findAndModify({
    //   query: { coll_name: collection_name },
    //   update: { $inc: { seq: 1 } },
    //   new: true,
    // });
    // return ret.seq;

    PublicCounter.findOneAndUpdate(
      { coll_name: collection_name },
      { $inc: { seq: 1 } },
      { new: true },
      function(err, PublicCounter) {
        if (PublicCounter != undefined)
          callback(PublicCounter.seq);
        else
          callback(undefined);
      }
    );
  } 

  var getNextSequence = function(collection_name, callback) {
    // console.log("in getNextSequence function")
    
    // query collection for coll_name : collection_name, if found then proceed, else, make a new document for it, with seq: 0
    PublicCounter.findOne({ coll_name: collection_name }, function(err, doc){
      if (!doc){
        // console.log("have to make a new document for this counter")

        var public_counter = new PublicCounter ({
          coll_name: collection_name,
          seq: 0,
        });
        public_counter.save(function(err, saved_doc){
          autoIncrementCounter(collection_name, callback);
        })
      } else {
        // console.log("found counter document")
        autoIncrementCounter(collection_name, callback);
      }
    });
  }

  var getCurrSequence = function(collection_name, callback) {
    // console.log("in getCurrSequence function")
    PublicCounter.findOne({ coll_name: collection_name }, callback);
  }

  return {
    getNextSequence: getNextSequence,
    getCurrSequence: getCurrSequence,
    PublicCounter: PublicCounter,
  }
}
