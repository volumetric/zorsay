var fs = require('fs');

var onlineSellersList = "sellers_list.txt";
var productCategoryList = "product_category_list.txt";
var serviceCategoryList = "service_category_list.txt";
  

fs.readFile(onlineSellersList, "utf-8", function(err, data){
	if (err)
	  throw err;

	entries = data.split("\n");
	// console.log(entries.length);

	for(var i = 0; i < entries.length; ++i) {
		res = entries[i].trim().toLowerCase();
		console.log(res);
	}
});

// fs.readFile(productCategoryList, "utf-8", function(err, data){
// 	if (err)
// 	  throw err;

// 	entries = data.split("\n");
// 	// console.log(entries.length);

// 	for(var i = 0; i < entries.length; ++i) {
// 		res = entries[i].trim().toLowerCase().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]/,"");
// 		console.log(res);
// 	}
// });

// fs.readFile(serviceCategoryList, "utf-8", function(err, data){
// 	if (err)
// 	  throw err;

// 	entries = data.split("\n");
// 	// console.log(entries.length);

// 	for(var i = 0; i < entries.length; ++i) {
// 		res = entries[i].trim().toLowerCase().replace(/\s+/g, "-").replace(/[^-a-zA-Z0-9]/,"");
// 		console.log(res);
// 	}
// });

