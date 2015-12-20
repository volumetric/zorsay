module.exports = function(config, mongoose, nodemailer, models, Agent) {

  // Agent is actually AgentModel 
  // its a basic mongoose model defined by specific schema and
  // pre() and node() middlware functions definitions

  var crypto = require('crypto');

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Agent was created');
  };

  var changePassword = function(agentId, newpassword) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(newpassword);
    var hashedPassword = shaSum.digest('hex');
    Agent.update({_id:agentId}, {$set: {password:hashedPassword}},{upsert:false},
      function changePasswordCallback(err) {
        console.log('Change password done for agent ' + agentId);
    });
  };

  var forgotPassword = function(email, resetPasswordUrl, callback) {
    var user = Agent.findOne({email: email}, function findAgent(err, doc){
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
    Agent.findOne({email:email,password:shaSum.digest('hex')},function(err,doc){
      callback(doc);
    });
  };

  var findById = function(agentId, callback) {
    Agent.findOne({_id: agentId}, callback);
  }

  var register = function(email, password, firstName, lastName, verificationUrl, callback) {
    var shaSum = crypto.createHash('sha256');
    shaSum.update(password);

    console.log('Registering ' + email);

    // Check if an agent with same email address already exixts.
    Agent.findOne({email: email}, function findAgent(err, doc){
      // if not found
      if (!doc) {
        var user = new Agent({
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
          console.log('User agent Saved');

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
        console.log("################## agent repeat #####################")
        console.log('An agent with the same email already exists.');
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
    Model: Agent
  }
}
