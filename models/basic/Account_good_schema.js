module.exports = function(config, mongoose, nodemailer, models, modelName) {

  mongoose.set('debug', true);

  var AccountSchema = new mongoose.Schema({
    _id: { type: Number, required: true, unique: true },
    
    // Auxiallary ID of the document
    obj_id: { type: mongoose.Schema.ObjectId, unique: true },
    
    // sha256 hash of a newly created objectid
    verification_id_hash: { type: String },
    verification_id_timestamp: { type: Date },
    
    // ### timestamps ###
    created_at: { type: Date },
    // only when the post is edited
    updated_at: { type: Date, required: true, default: Date.now() },
    // activity like upvoted/commneted/edited anything
    last_activity: { type: Date, default: Date.now() },

    // ### content ###
    email:     { type: String, unique: true, required: true },
    password:  { type: String, required: true, default: "0b1a06d4b936cc63ea4f7bba6d8d4d9570e3d70f0a99470fbdc5c89d1415f927" }, // sha256 hash of "innnertemple"

    url_name:  { type: String },
    // username:  { type: String, unique: true },

    fullname:  { type: String, required: true },
    name: {
      first:   { type: String, required: true },
      last:    { type: String }
    },
    gender: { type: String },
    location:  { type: String },
    areacode:  { type: Number },

    // buyer/shopper
    // seller representative
    // marketeer
    // advertiser
    // expert etc...
    type: { type: Number },
    // level: member, influencer, asker, expert, rational_buyer, trusted member, etc...
    level: { type: Number, default: 0 },

    short_bio: {type: String},
    aboutme: { type: String },

    img_icon_url: { type: String, default: "/img/newuser.jpg" },
    profile_image_url:  { type: String, default: "/img/newuser.jpg" },
    cover_image_url : { type: String, default: "/img/newcover.jpg" },

    social_network_data: {
      facebook: {
        id: {type: String},
        token: {type: String},
        data: {type: String},  // Stringified JSON
      },
      twitter: {
        id: {type: String},
        token: {type: String},
        data: {type: String},  // Stringified JSON
      },
      google: {
        id: {type: String},
        token: {type: String},
        data: {type: String},  // Stringified JSON
      },
    },

    email_verified:  { type: Boolean, default: false },
    email_not_sent:  { type: Boolean, default: true },
    robot:  { type: Boolean, default: false },

    age: { type: Number },
    birthday: {
      day:     { type: Number, min: 1, max: 31, required: false },
      month:   { type: Number, min: 1, max: 12, required: false },
      year:    { type: Number }
    },

    signup_source : {type: String},

    // ### associations ###
    _referer: { type: Number, ref: 'Account', index: true },

    // these are posts written by this agent
    _shopexes: [{ type: Number, ref: 'Shopex', index: true }],
    _questions: [{ type: Number, ref: 'Question', index: true }],
    _answers: [{ type: Number, ref: 'Answer', index: true }],
    _comments: [{ type: Number, ref: 'Comment' }],

    // f_ means the agent is following those elements, i.e.. will get notification about it when its updated
    f_shopexes: [{ type: Number, ref: 'Shopex', index: true }],
    f_questions: [{ type: Number, ref: 'Question', index: true }],
    f_answers: [{ type: Number, ref: 'Answer', index: true }],
    // f_comments: [{ type: Number, ref: 'Comment' }],

    // s_ means the agent has stared those elements, i.e.. kept it as a bookmark in her account for getting on it later on
    s_shopexes: [{ type: Number, ref: 'Shopex', index: true }],
    s_questions: [{ type: Number, ref: 'Question', index: true }],
    s_answers: [{ type: Number, ref: 'Answer', index: true }],
    // s_comments: [{ type: Number, ref: 'Comment' }],


    f_seller: [{ type: Number, ref: 'Seller', index: true,}],
    //array of refs with multikey indexing on their ids #CHECK #TODO
    f_pro_cat: [{ type: Number, ref: 'ProductCat', index: true }],
    f_ser_cat: [{ type: Number, ref: 'ServiceCat', index: true }],
    f_pro: [{ type: Number, ref: 'Product', index: true }],
    f_ser: [{ type: Number, ref: 'Service', index: true }],

    // ### meta information ###
    permalink: { type: String },
    verified:  { type: Boolean, default: false },
    source: { type: String }, // if null, then orginated from the site itself

    meta_info: {
      value: { type: Number }, //overall value of this post
      
      viewers: [{ type: Number, ref: 'Account' }],
      followers: [{ type: Number, ref: 'Account' }],
      following: [{ type: Number, ref: 'Account' }],
      
      favors: [{ type: Number, ref: 'Account' }],
      sharers: [{ type: Number, ref: 'Account' }],
      
      //array of array of account refs for diff types of flag raisers #TODO
      flaggers: [{ type: Number, ref: 'Account' }],
    },

    // ### session information ###
    ip_addresses: [{ type: String }], // from where the user logged in
    computer_uid: [{ type: String }], // from which the user logged in

    // ### configuration information ###
    settings: {
      email_notifications : {
        // send email when their is some activity on f_<element>
        f_shopex: { type: Boolean, default: true }, 
        f_question: { type: Boolean, default: true },
        f_answer: { type: Boolean, default: true },

        f_seller:   { type: Boolean, default: false },
        f_pro_cat:   { type: Boolean, default: false },
        f_ser_cat:   { type: Boolean, default: false },
        f_pro:   { type: Boolean, default: false },
        f_ser:   { type: Boolean, default: false },
      }
    },

  }, { autoIndex: true });

  AccountSchema.pre('save', function(next){
    this.updated_at = new Date;
    // last_activity entry will be updated when the user does anything
    // updated_at entry will be updated only when user content info edited

    var url_n = this.fullname.trim().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]+/g,"");
    if ( this.url_name != url_n )
      this.url_name = url_n;

    if (this._id) {
      var plink = "/user/"+this._id+"/"+this.url_name

      if ( this.permalink != plink )
          this.permalink = plink;
    }

    if ( !this.created_at ) {
      this.created_at = new Date;
      this.obj_id = mongoose.Types.ObjectId();
      // put account creation related stuff here
    } // when created

    next();
  });

  AccountSchema.post('save', function(account){
    // put post() save stuff here
  });

  // var Account = mongoose.model('Account', AccountSchema);
  var Account = mongoose.model(modelName, AccountSchema);
  return Account;
}
