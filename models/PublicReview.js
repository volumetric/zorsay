module.exports = function(config, mongoose) {

  var PublicReviewSchema = new mongoose.Schema({
    accountId: {type: String},
    reviewIndex: {type: Number},
    timestamp: {type: Date}
  });

  var PublicReview = mongoose.model('PublicReview',  PublicReviewSchema);


  var addEntry = function(accountId, reviewIndex, timestamp, callback) {
    var entry = new PublicReview({
      accountId: accountId,
      reviewIndex: reviewIndex,
      timestamp: timestamp
    });
    entry.save(callback);
  }

  var getNextPage = function(start, totalCount, callback) {
    PublicReview.findOne({accountId: accountId, reviewIndex: reviewIndex, timestamp: timestamp}, function(err, doc))
  }


  return {
    addEntry: addEntry,
    getNextPage: getNextPage,
    PublicReview: PublicReview
  }
}
