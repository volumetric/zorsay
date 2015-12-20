module.exports = function(config, mongoose) {

  var LaunchListAccountSchema = new mongoose.Schema({
    email:     { type: String, unique: true },
    location: {
      ip:   { type: String },
      geo: {type: String}
    },
    timestamp: { type: String},
  });

  var LaunchListAccount = mongoose.model('LaunchListAccount', LaunchListAccountSchema);

  var submitCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('A Launch List email was Submitted.');
  };

  var launchListAccountSubmit = function(email, ip, callback) {
    timestamp = new Date();

    console.log('Registering ' + email + ' For Launch List.');
        // Check if an account with same email address already exixts.
    LaunchListAccount.findOne({email: email}, function findAccount(err, doc){
      // if not found
      if (!doc) {
        var user = new LaunchListAccount({
          email: email,
          location: {
            ip: ip
          },
          timestamp: timestamp
        });
        // user.save(submitCallback);
        user.save(callback);
        console.log('Save command was sent');
      } else {
        console.log('This email is already in our Launch List annoucement.');
        callback({code:412});
      }
    });
  }

  return {
    launchListAccountSubmit: launchListAccountSubmit,
    LaunchListAccount: LaunchListAccount
  }
}
