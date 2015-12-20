module.exports = function(config, mongoose, models, modelName) {

	// initialized the specific schema to be used and return the model
	QuestionBasicModel = require('./basic/Question_good_schema')(config, mongoose, models, modelName);

	// initialized all the utility funcitons for this model
	// returned all the utility functions and model under an Object
	Question = require('./inherit/Post_v1')(config, mongoose, models, QuestionBasicModel);

	// QuestionBasicModel is just a schema with pre() and post() middleware
	// Question is the final Model having all the utility functions to be used in app
	// Question.Model will give the mongoose model made from the schema

	return Question; 

}