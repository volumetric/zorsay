module.exports = function(config, mongoose, models, modelName) {

	// initialized the specific schema to be used and return the model
	// CommentBasicModel = require('./basic/Comment')(config, mongoose, models);
	CommentBasicModel = require('./basic/Comment_good_schema')(config, mongoose, models, modelName);

	// initialized all the utility funcitons for this model
	// returned all the utility functions and model under an Object
	Comment = require('./inherit/Post_v1')(config, mongoose, models, CommentBasicModel);

	// CommentBasicModel is just a schema with pre() and post() middleware
	// Comment is the final Model having all the utility functions to be used in app
	// Comment.Model will give the mongoose model made from the schema

	return Comment; 
}