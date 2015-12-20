module.exports = function(app){

  var getSidebarData = function(callback) {
    var side_bar_data = {}
    app.models.Question.getRandomPosts(10, function(err, qdocs){
      if (!err && qdocs){
        side_bar_data.questions = qdocs;
      }
      // callback(null, side_bar_data);
      app.models.Shopex.getRandomPosts(10, function(err, sdocs){
        if (!err && sdocs){
          side_bar_data.shopexes = sdocs;
        }
        // callback(null, side_bar_data);
        app.models.Seller.getRandomNodes(10, function(err, sldocs){
          if (!err && sldocs){
            side_bar_data.sellers = sldocs;
          }
          // callback(null, side_bar_data);
          app.models.ProductCat.getRandomNodes(10, function(err, pcdocs){
            if (!err && pcdocs){
              side_bar_data.procats = pcdocs;
            }
            // callback(null, side_bar_data);
            app.models.ServiceCat.getRandomNodes(10, function(err, scdocs){
              if (!err && scdocs){
                side_bar_data.sercats = scdocs;
              }
              callback(null, side_bar_data);
            });
          });
        });
      });
    });
  }
  
  var getSinglePostSidebarData = function(callback) {
    var side_bar_data = {}
    app.models.Question.getRandomPosts(10, function(err, qdocs){
      if (!err && qdocs){
        side_bar_data.questions = qdocs;
      }
      // callback(null, side_bar_data);
      app.models.Shopex.getRandomPosts(10, function(err, sdocs){
        if (!err && sdocs){
          side_bar_data.shopexes = sdocs;
        }
        callback(null, side_bar_data);
      });
    });
  }

  var getAllPostsSidebarData = function(callback) {
    var side_bar_data = {}
    app.models.Seller.getRandomNodes(10, function(err, sldocs){
      if (!err && sldocs){
        side_bar_data.sellers = sldocs;
      }
      // callback(null, side_bar_data);
      app.models.ProductCat.getRandomNodes(10, function(err, pcdocs){
        if (!err && pcdocs){
          side_bar_data.procats = pcdocs;
        }
        // callback(null, side_bar_data);
        app.models.ServiceCat.getRandomNodes(10, function(err, scdocs){
          if (!err && scdocs){
            side_bar_data.sercats = scdocs;
          }
          callback(null, side_bar_data);
        });
      });
    });
  }

  return {
  	getSidebarData: getSidebarData,
  	getSinglePostSidebarData: getSinglePostSidebarData,
  	getAllPostsSidebarData: getAllPostsSidebarData,
  }

} // end module.exports