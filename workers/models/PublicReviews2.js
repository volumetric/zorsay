module.exports = function(config, mongoose) {
  // var crypto = require('crypto');

  var PublicReviewsSchema = new mongoose.Schema({
    entries: [ReviewEntry]    
  });

  var ReviewEntry = new mongoose.Schema({
    accountId: {type: String},
    reviewIndex: {type: Number},
    timestamp: {type: Date}
  });

  var PublicReviews = mongoose.model('PublicReviews',  PublicReviewsSchema);

  // var singleton_id = "";

  // (function(){
  //   PublicReviews.findOne(function(err, doc){
  //     if (err) {
  //       var entries = new PublicReviews({
  //         entries: []
  //       });
  //       entries.save(function(err1, doc1){
  //         if (err1) throw err1;
  //         singleton_id = doc1._id;
  //         return singleton_id;
  //       });
  //     } else {
  //       singleton_id = doc._id;
  //       return singleton_id;
  //     }
  //   });
  // })();

  (function(){
    PublicReviews.findOne(function(err, doc){
      if (err) {
        var entries = new PublicReviews({
          entries: []
        });
        entries.save(function(err1, doc1){
          if (err1) throw err1;
        });
      }
    });
  })();


  var addEntry = function(accountId, reviewIndex, timestamp, callback) {
    PublicReviews.findOne(function(err,doc) {
      if (err){
        callback(err);
        return;
      }
      var entry = {
        accountId: accountId,
        reviewIndex: reviewIndex,
        timestamp: timestamp
      };

      doc.entries.push(entry);
      callback(entry);
    });
  }

  var getNextPage = function(accountId, reviewIndex, timestamp, count, callback) {
    PublicReviews.findOne(function(err,doc) {
      if (err){
        callback(err);
        return;
      }
      doc.entries
    }
  }


  return {
    addEntry: addEntry,
    getNextPage: getNextPage,
    PublicReviews: PublicReviews
  }
}
