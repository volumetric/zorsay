module.exports = function(config, mongoose, nodemailer, models, modelName) {

	// initialized the specific schema to be used and return the model
	// AccountBasicModel = require('./basic/Account')(config, mongoose, nodemailer, models);
	AccountBasicModel = require('./basic/Account_good_schema')(config, mongoose, nodemailer, models, modelName);

	// initialized all the utility funcitons for this model
	// returned all the utility functions and model under an Object
	Account = require('./inherit/Agent_v1')(config, mongoose, nodemailer, models, AccountBasicModel);

	// AccountBasicModel is just a schema with pre() and post() middleware
	// Account is the final Model having all the utility functions to be used in app
	// Account.Model will give the mongoose model made from the schema

	return Account; 

}