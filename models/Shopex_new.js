module.exports = function(config, mongoose, models, modelName) {

	// initialized the specific schema to be used and return the model
	// ShopexBasicModel = require('./basic/Shopex')(config, mongoose, models);
	ShopexBasicModel = require('./basic/Shopex_good_schema')(config, mongoose, models, modelName);

	// initialized all the utility funcitons for this model
	// returned all the utility functions and model under an Object
	Shopex = require('./inherit/Post_v1')(config, mongoose, models, ShopexBasicModel);

	// ShopexBasicModel is just a schema with pre() and post() middleware
	// Shopex is the final Model having all the utility functions to be used in app
	// Shopex.Model will give the mongoose model made from the schema

	return Shopex; 

}