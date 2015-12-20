module.exports = function(config, mongoose) {

  var PublicReviewsSchema = new mongoose.Schema({
    accountId: {type: mongoose.Schema.ObjectId}, 
    reviewId: {type: mongoose.Schema.ObjectId},
    approved: {type: Boolean},
    disapproved: {type: Boolean}
  });

  var PublicReviews = mongoose.model('PublicReviews',  PublicReviewsSchema);


  var addEntry = function(accountId, reviewId, callback) {
    var entry = new PublicReviews({
      accountId: accountId,
      reviewId: reviewId,
      approved: false,
      disapproved: false
    });
    entry.save(callback);
  }

  var approveEntry = function(reviewId, callback) {
    PublicReviews.findOne({reviewId: reviewId})(function(err, doc){
      doc.approved = true;
    });
  }

  var disapproveEntry = function(reviewId, callback) {
    PublicReviews.findOne({reviewId: reviewId})(function(err, doc){
      doc.disapproved = true;
    });
  }

  var findById = function(reviewId, callback) {
    PublicReviews.findOne({reviewId:reviewId}, function(err,doc) {
      callback(doc);
    });
  }


  // @param prevCount is the count of the total no. of approved reviews with us that we will show publicly when the page was loaded
  //                  this will set the anchor to give the update from their on, and refresh page to see latest reviews
  //                  later we can use this count to add stuff on top of the page also. this count will work as thw anchor point.
  var getNextPage = function(skipCount, prevCount, resCount, callback) {
    // console.log(skipCount);
    // console.log(prevCount);
    // console.log(resCount);
    PublicReviews.count(function(err, currCount){
      skip_entries = skipCount + currCount - prevCount;
      // put a condition in array that PublicReviews should be approved
      // PublicReviews.find({approved: true}).skip(skip_entries).limit(resCount).exec(function(err, docs) {
      PublicReviews.find().skip(skip_entries).limit(resCount).exec(function(err, docs) {
        // console.log(docs.length);
        callback(err, docs); // the docs are an array. 
      });
    });
  }

  return {
    addEntry: addEntry,
    approveEntry: approveEntry,
    disapproveEntry: disapproveEntry,
    getNextPage: getNextPage,
    PublicReviews: PublicReviews,
    findById: findById,
  }
}
