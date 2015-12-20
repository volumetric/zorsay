module.exports = function(config, mongoose, models, modelName) {

	AnswerBasicModel = require('./basic/Answer_good_schema')(config, mongoose, models, modelName);
	// initialized the specific schema to be used and return the model

	// initialized all the utility funcitons for this model
	// returned all the utility functions and model under an Object
	Answer = require('./inherit/Post_v1')(config, mongoose, models, AnswerBasicModel);

	// AnswerBasicModel is just a schema with pre() and post() middleware
	// Answer is the final Model having all the utility functions to be used in app
	// Answer.Model will give the mongoose model made from the schema

	return Answer; 

}