module.exports = function(config, mongoose, nodemailer, models, Agent) {

  AccessControl = require('../common/AccessControl');

  // Agent is actually AgentModel 
  // its a basic mongoose model defined by specific schema and
  // pre() and node() middlware functions definitions

  var crypto = require('crypto');

  // var registerCallback = function(err) {
  //   if (err) {
  //     return console.log(err);
  //   };
  //   return console.log('Agent was created');
  // };

  var changePassword = function(agentId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    Agent.update({_id:agentId}, {$set: {password:hashedPassword}},{upsert:false},
      function changePasswordCallback(err) {
        console.log('Change password done for agent ' + agentId);
    });
  };

  // var forgotPassword = function(email, resetPasswordUrl, callback) {
  //   var user = Agent.findOne({email: email}, function findAgent(err, doc){
  //     if (err || !doc) {
  //       // Email address is not a valid user
  //       callback(err, doc);
  //     } else {
  //       var subject = 'Zorsay Password Recovery';
  //       var message = 'A <b>Password Recovery</b> request has been made from your Account. If this was <b>Not</b> you, then please ignore this mail. <br> Otherwise Click the link below to <b>Reset</b> your password:<br> ';
  //       sendVerificationMail(doc, resetPasswordUrl, subject, message, callback);
  //     }
  //   });
  // };

  var login = function(email, password, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);
    Agent.findOne({email:email,password:shaSum.digest('hex')}, callback);
  };

  var findById = function(agentId, callback) {
    Agent.findOne({_id: agentId}, callback);
  }

  var findByEmail = function(agentEmail, callback) {
    Agent.findOne({email: agentEmail}, callback);
  }

  var findByFbId = function(agentFbId, callback) {
    Agent.findOne({'social_network_data.facebook.id': agentFbId}, callback);
  }

  var findAndVerify = function(agentId, vid_hash, callback) {
    Agent.findOne({_id: agentId}, function(err, agent_doc){
      if (err || !agent_doc){
        callback(err, agent_doc);
        return;
      }

      if(agent_doc.verified || agent_doc.email_verified){
        callback(err, agent_doc);
        return;
      }

      if (agent_doc.verification_id_hash && agent_doc.verification_id_hash == vid_hash){
        callback(err, agent_doc);
      } else {
        callback(new Error("Verification ID hash is wrong"), null);
      }
    }); 
  }

  var checkvidhash = function(agentId, vid_hash, callback) {
    Agent.findOne({_id: agentId}, function(err, agent_doc){
      if (err || !agent_doc){
        callback(err, agent_doc);
        return;
      }

      if (agent_doc.verification_id_hash && agent_doc.verification_id_hash == vid_hash){
        callback(err, agent_doc);
      } else {
        callback(new Error("Verification ID hash is wrong"), null);
      }
    }); 
  }

  var generateAndSaveHash = function(agent_doc, callback) {
    var vid = new mongoose.Types.ObjectId();
    var vid_ts = vid.getTimestamp();

    var shaSum = crypto.createHash('sha256');
    shaSum.update(JSON.stringify(vid));
    vid_hash = shaSum.digest('hex');

    agent_doc.verification_id_hash = vid_hash;
    agent_doc.verification_id_timestamp = vid_ts;

    agent_doc.save(callback);
  }

  // var sendVerificationMail = function(agent_doc, linkUrl, subject, message, callback) {

  //   var vid = new mongoose.Types.ObjectId();
  //   var vid_ts = vid.getTimestamp();

  //   var shaSum = crypto.createHash('sha256');
  //   shaSum.update(JSON.stringify(vid));
  //   vid_hash = shaSum.digest('hex');

  //   agent_doc.verification_id_hash = vid_hash;
  //   agent_doc.verification_id_timestamp = vid_ts;

  //   agent_doc.save(function(err, saved_agent_doc){
  //     if (err || !saved_agent_doc){
  //       console.log("err saving verification id");
  //       callback(err, saved_agent_doc);
  //       return;
  //     }

  //     var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
  //     linkUrl += '?account=' + saved_agent_doc._id+'&vid='+saved_agent_doc.verification_id_hash;
  //     message += linkUrl;

  //     smtpTransport.sendMail({
  //       from: 'Zorsay@zorsay.com',
  //       to: saved_agent_doc.email,
  //       subject: subject,
  //       html: message
  //     }, function SignUpResult(err) {
  //       if (!err) {
  //         console.log("mail sent");
  //         saved_agent_doc.email_not_sent = false;
  //         saved_agent_doc.save(callback);
  //         return;
  //       }
  //       console.log("err sending mail");
  //       console.log(err);
  //       callback(err, null);
  //       return;
  //     });
  //   });
  // }

  var zsSendMail = function(fromemail, toemail, subject, message, callback) {

      var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
      
      smtpTransport.sendMail({
        from: fromemail,
        to: toemail,
        subject: subject,
        html: message
      }, callback);
  }

  var random_name_gen = function() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
          return v.toString(16);
      });    
  }

  var social_register = function(network, userdata_obj, callback) {

    var email = userdata_obj.email;
    var password = random_name_gen();
    var firstName = userdata_obj.first_name;
    var lastName = userdata_obj.last_name;

    register(email, password, firstName, lastName, "", function(err, newuser_doc) {
      newuser_doc.signup_source = network;
      newuser_doc.profile_image_url = userdata_obj.userpic_500_url;
      newuser_doc.img_icon_url = userdata_obj.userpic_50_url;
      newuser_doc.save(callback);
    })
  }

  var register = function(email, password, firstName, lastName, verificationUrl, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    console.log('Registering ' + email);

    // Check if an agent with same email address already exixts.
    Agent.findOne({email: email}, function findAgent(err, doc){
      // no document found
      if (!err && !doc) {
        models.PublicCounter.getNextSequence(Agent.modelName, function(seq){
        
          if (!seq){
            console.log("Serial number for Pubic id not initialized.")
            nerr = new Error("Internal Server Error. Please Try Again after some time.");
            nerr.code = 500;
            callback(nerr, null);
            return;
          }
          
          var fullname = firstName+" "+lastName;
          fullname = fullname.trim();

          var url_name = fullname.toLowerCase().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]/,"");

          var user = new Agent({
            _id: seq,
            email: email,
            name: {
              first: firstName,
              last: lastName
            },
            fullname: fullname,
            url_name: url_name,
            password: shaSum.digest('hex'),
            verified: false,
          });

          user.save(function(err, newdoc){
            if (err || !newdoc){
              callback(err, newdoc);
              return;
            }

            // var subject = 'Welcome To Zorsay';
            // var message = "Thanks for signing up with <b>Zorsay</b>. <br> Click the link below to verify your email address: <br>";
            // sendVerificationMail(newdoc, verificationUrl, subject, message, function(){});
            callback(err, newdoc);
          });
        });
      } else {
        nerr = new Error("Email already in Use. Try Recovering your password.");
        nerr.code = 409;
        callback(nerr, null);
      }
    });
  }

  var restrictKeys = function(agentObj, diff_fields, callback) {
    new_agentObj = {}

    keys = Object.keys(agentObj);
    for (var i = 0; i < keys.length; ++i) {
      if (diff_fields.indexOf(keys[i]) > -1){
        new_agentObj[keys[i]] = agentObj[keys[i]];  
      }
    }
    callback(null, new_agentObj);
  }

  var editAgentPassword = function(agentId, userId, new_password, current_password, callback) {
    // if (VIN_DEBUG) 
    console.log("inside editAgentPassword function for:", Agent.modelName, agentId);

    // console.log(agentObj);
    this.findById(agentId, function(err, agent_doc){
      if (err || !agent_doc){
        callback(err, null);
        return;
      }

      if (!AccessControl.agentEditPermission(userId, agent_doc, current_password)){
        callback(new Error("Permission Denied, Cannot Change password for this Agent"), null);
        return;
      }

      var shaSum = crypto.createHash('sha256');
      shaSum.update(new_password);
      agent_doc.password = shaSum.digest('hex');

      agent_doc.save(callback);
    });
  }

  var editAgent = function(agentId, userId, agentObj, verify_password, diff_fields, callback) {
    // if (VIN_DEBUG) 
    console.log("inside editAgent function for:", Agent.modelName, agentId);

    // console.log(agentObj);
    this.findById(agentId, function(err, agent_doc){
      if (err || !agent_doc){
        callback(err, null);
        return;
      }

      if (!AccessControl.agentEditPermission(userId, agent_doc, verify_password)){
        callback(new Error("Permission Denied, Cannot Edit this Agent"), null);
        return;
      }

      restrictKeys(agentObj, diff_fields, function(err, new_agentObj){

        keys = Object.keys(new_agentObj);
        for (var i = 0; i < keys.length; ++i) {
          key = keys[i];
          agent_doc[key] = new_agentObj[key];
        }
        agent_doc.save(callback);
      });
    });
  }

  var getAgentsPopulatedById = function(lastAgentId, limit, pop_fields, callback) {
    // query = Agent.find( {_id: {$gt: lastPostId}} )
    query = Agent.find( {_id: {$lt: lastAgentId}} )
      .lean()
      .sort({ _id: -1 })
      .limit(limit);

    for(key in pop_fields){
      query = query.populate(key, pop_fields[key]);
    }

    query.exec(function(err, docs){
      callback(err, docs);
    });
  }

  return {
    findById: findById,
    findByEmail: findByEmail,

    findByFbId: findByFbId,

    register: register,
    social_register: social_register,

    editAgent: editAgent,
    editAgentPassword: editAgentPassword,

    findAndVerify: findAndVerify,   
    checkvidhash: checkvidhash,
    // forgotPassword: forgotPassword,
    changePassword: changePassword,

    generateAndSaveHash: generateAndSaveHash,
    // sendVerificationMail: sendVerificationMail,
    zsSendMail: zsSendMail,

    getAgentsPopulatedById: getAgentsPopulatedById,

    login: login,
    Model: Agent
  }
}
