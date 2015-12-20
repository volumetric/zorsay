module.exports = function(config, mongoose) {

  var LaunchListAccountSchema = new mongoose.Schema({
    email:     { type: String, unique: true },
    location: {
      ip:   { type: String },
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

  var launchListAccountSubmit = function(email, ip) {
    timestamp = new Date();

    console.log('Registering ' + email + 'For Launch List.');
    var user = new LaunchListAccount({
      email: email,
      location: {
        ip: ip
      },
      timestamp: timestamp;
    });
    user.save(submitCallback);
    console.log('Save command was sent');
  }

  return {
    launchListAccountSubmit: launchListAccountSubmit,
    LaunchListAccount: LaunchListAccount
  }
}
