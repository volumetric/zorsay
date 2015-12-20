module.exports = function(config, mongoose, models, modelName) {

	// initialized the specific schema to be used and return the model
	ProductCatBasicModel = require('./basic/ProductCat_good_schema')(config, mongoose, models, modelName);

	// initialized all the utility funcitons for this model
	// returned all the utility functions and model under an Object
	ProductCat = require('./inherit/Node_v1')(config, mongoose, models, ProductCatBasicModel);

	// ProductCatBasicModel is just a schema with pre() and post() middleware
	// ProductCat is the final Model having all the utility functions to be used in app
	// ProductCat.Model will give the mongoose model made from the schema

	return ProductCat; 
}