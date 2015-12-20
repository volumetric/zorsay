module.exports = function(config, mongoose, nodemailer, models) {

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
  }, { autoIndex: false });

  AccountSchema.pre('save', function(next){
    this.updated_at = new Date;
    // last_seen entry to be updated here
    if ( !this.created_at ) {
      // put account created related stuff here
    } // when created
    next();
  });

  AccountSchema.post('save', function(account){
    // put post() save stuff here
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

  return Account;
}
