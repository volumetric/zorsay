module.exports = function(config, mongoose, nodemailer) {
  // var crypto = require('crypto');

  var PublicReviewsSchema = new mongoose.Schema({
    accountId: {type: String},
    reviewIndex: {type: Number},
    timestamp: {type: Date}
  });

  var PublicReviews = mongoose.model('PublicReviews',  PublicReviewsSchema);

  (function(){
    PublicReviews.findOne(function(err, doc){
      if (err) {
        var publicReviews = new PublicReviews({
          publicReviews: []
        });
        publicReviews.save(function(err1, doc1){
          if (err1) throw err1;
        });
      }
    });
  })();


  var addEntry = function(accountId, reviewIndex, timestamp, callback) {

    var entry = new PublicReviews({
      email: email,
      name: {
        first: firstName,
        last: lastName
      },
      password: shaSum.digest('hex')
    });
    // user.save(registerCallback);
    user.save(callback);


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

      doc.publicReviews.push(entry);
      callback(entry);
    });
  }

  var getReviews = function(timestamp, count) {
    
  }


  return {
    addEntry: addEntry,
    getReviews: getReviews,
    PublicReviews: PublicReviews
  }
}
