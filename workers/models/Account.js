module.exports = function(config, mongoose, nodemailer) {
  var crypto = require('crypto');

  var Review = new mongoose.Schema({
    // _id: {type: mongoose.Schema.ObjectId},
    reviewText: { type: String },
    vendor:     { type: String },
    pscategory: { type: String },
    pscategory_all:   [{type: String}],
    submitted:  { type: Date },
    anonymous:  { type: String }, // "on" or "off"
    source :    { type: String }, //Review originated from which location
    
    otd_rating: { type: Number },
    pad_rating: { type: Number },
    pri_rating: { type: Number },
    pro_rating: { type: Number },
    eos_rating: { type: Number },
    rrp_rating: { type: Number },
    csu_rating: { type: Number },
    all_rating: { type: String },

    // otd_rating: { type: Number, validate: [rating_validator, 'must be [0,5]'] },
    // pad_rating: { type: Number, validate: [rating_validator, 'must be [0,5]'] },
    // pri_rating: { type: Number, validate: [rating_validator, 'must be [0,5]'] },
    // pro_rating: { type: Number, validate: [rating_validator, 'must be [0,5]'] },
    // eos_rating: { type: Number, validate: [rating_validator, 'must be [0,5]'] },
    // rrp_rating: { type: Number, validate: [rating_validator, 'must be [0,5]'] },
    // csu_rating: { type: Number, validate: [rating_validator, 'must be [0,5]'] },

    // otd_rating: { type: Number, min: 0, max: 5, required: false },
    // pad_rating: { type: Number, min: 0, max: 5, required: false },
    // pri_rating: { type: Number, min: 0, max: 5, required: false },
    // pro_rating: { type: Number, min: 0, max: 5, required: false },
    // eos_rating: { type: Number, min: 0, max: 5, required: false },
    // rrp_rating: { type: Number, min: 0, max: 5, required: false },
    // csu_rating: { type: Number, min: 0, max: 5, required: false },

    otd_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    pad_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    pri_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    pro_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    eos_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    rrp_comment:{ type: String, validate: [rcomment_validator, 'my error type'] },
    csu_comment:{ type: String, validate: [rcomment_validator, 'my error type'] }
  });

  var AccountSchema = new mongoose.Schema({
    email:     { type: String, unique: true },
    password:  { type: String },
    name: {
      first:   { type: String },
      last:    { type: String }
    },
    verified:  { type: Boolean },
    birthday: {
      day:     { type: Number, min: 1, max: 31, required: false },
      month:   { type: Number, min: 1, max: 12, required: false },
      year:    { type: Number }
    },
    joined: { type: Date },
    last_activity: { type: Date },
    last_seen: { type: Date },
    photoUrl:  { type: String },
    img_icon_url: { type: String },
    biography: { type: String },
    reviews:    [Review], // My public review updates
    anonReviews: [Review] // My Anonymous review updates
    // activity:  [Status]  //  All status updates including friends
  });

  function rcomment_validator (comment) {
    return (comment.length <= 137);
  };

  function rating_validator (rating) {
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr");
    console.log(rating);
    return (rating >= 0 && rating <= 5);
  };


  var Account = mongoose.model('Account', AccountSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Account was created');
  };

  var changePassword = function(accountId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    Account.update({_id:accountId}, {$set: {password:hashedPassword}},{upsert:false},
      function changePasswordCallback(err) {
        console.log('Change password done for account ' + accountId);
    });
  };

  var forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Account.findOne({email: email}, function findAccount(err, doc){
      if (!doc) {
        // Email address is not a valid user
        callback(false);
      } else {
        var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
        resetPasswordUrl += '?account=' + doc._id;
        smtpTransport.sendMail({
          from: 'no-reply@zorsay.com',
          to: doc.email,
          subject: 'Zorsay Password Request',
          text: 'Click here to reset your password: ' + resetPasswordUrl
        }, function forgotPasswordResult(err) {
          if (err) {
            callback(false);
          } else {
            callback(true);
          }
        });
      }
    });
  };

  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Account.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
      callback(doc);
    });
  };

  var findById = function(accountId, callback) {
    Account.findOne({_id:accountId}, function(err,doc) {
      callback(doc);
    });
  }

  var register = function(email, password, firstName, lastName, verificationUrl, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    console.log('Registering ' + email);

    // Check if an account with same email address already exixts.
    Account.findOne({email: email}, function findAccount(err, doc){
      // if not found
      if (!doc) {
        var user = new Account({
          email: email,
          name: {
            first: firstName,
            last: lastName
          },
          password: shaSum.digest('hex'),
          verified: false
        });
        // user.save(registerCallback);
        console.log('Save command sent');

        user.save(function(err, newdoc){
          console.log('User account Saved');

          var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
          verificationUrl += '?account=' + newdoc._id;
          message = "Thanks for signing up with Zorsay, Click here to verify your mail: " + verificationUrl;

          smtpTransport.sendMail({
            from: 'no-reply@zorsay.com',
            to: email,
            subject: 'Zorsay SignUp',
            text: message
          }, function SignUpResult(err) {
            if (err) {
              console.log("Problem in sending registration mail.")
              callback({code:201});
            } else {
              console.log("Registration mail sent.")
              callback({code:201});
            }
          });

          callback(err, newdoc);
        });

      } else {
        console.log("################## account repeat #####################")
        console.log('An account with the same email already exists.');
        callback({code:412});
      }
    });
  }

  return {
    findById: findById,
    register: register,
    forgotPassword: forgotPassword,
    changePassword: changePassword,
    login: login,
    Model: Account
  }
}
