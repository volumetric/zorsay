  var ShopexSchema = new mongoose.Schema({

    review_text: { type: String },
    reviewText: { type: String },

    anonymous:  { type: String },
    anon:  { type: Boolean },
    
    location:   {type: String},

    otd_rating: { type: Number },
    pad_rating: { type: Number },
    pri_rating: { type: Number },
    pro_rating: { type: Number },
    eos_rating: { type: Number },
    rrp_rating: { type: Number },
    csu_rating: { type: Number },
    all_rating: { type: String },

    otd_comment:{ type: String },
    pad_comment:{ type: String },
    pri_comment:{ type: String },
    pro_comment:{ type: String },
    eos_comment:{ type: String },
    rrp_comment:{ type: String },
    csu_comment:{ type: String },
  }, { autoIndex: false });
