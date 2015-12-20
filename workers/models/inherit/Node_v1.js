module.exports = function(config, mongoose, models, Node) {

  // Node is actually NodeModel 
  // its a basic mongoose model defined by specific schema and
  // pre() and node() middlware functions definitions

  // var jsdiff = require("diff");

  var findById = function(nodeId, callback) {
    Node.findOne({_id:nodeId}, callback);
  }

  var getNameById = function(nodeId, callback) {
    Node.findOne({_id: nodeId}, 'name url_name', callback);
  }

  // #TODO making sure the order array is maintained by an overkill hack, use populate() or something to  do inplace. NET is not working right now, so can't check the exact syntax.
  var getNamesByIds = function(nodeIdArrStr, callback) {
    var nodeIdArr = JSON.parse(nodeIdArrStr);

    Node.find({_id: {$in : nodeIdArr}}, 'name url_name', function(err, docs){
      if (err || !docs){
        callback(err, docs)
      } else {

        var d = []
        for(var i = 0; i < nodeIdArr.length; ++i){
          for(var j = 0; j < docs.length; ++j){
            if (nodeIdArr[i] == docs[j]._id)
              d.push(docs[j]);
          }
        }
        callback(err, d);
      }
    });
  }

  var findByPubId = function(nodePubId, callback) {
    Node.findOne({pub_id:nodePubId}, callback);
  }

  var findByRegex = function(field, regex, callback) {
    query_json = {};
    query_json[field] = regex

    Node.find(query_json, function(err, nodes) {
      callback(err, nodes);
    });
  }

  var findByRegex1 = function(field, regex, projection_json, callback) {
    query_json = {};
    query_json[field] = regex;

    // projection_json = {};
    // for (var i = 0; i < return_fields.length; ++i) {
    //   projection_json[return_fields[i]] = 1;
    // }

    Node.find(query_json, projection_json).exec(callback);
  }

  // utility functions

  var getAuthorId = function(nodePubId, callback) {
    Node.findOne({pub_id:nodePubId}, function(err, node) {
      callback(err, node._author);
    });
  }
  
  var createNode = function(nodeObj, callback) {
    console.log("in createNode function for:", Node.modelName)

    // #TODO#DONE #BUG "Node" should get replaced by Model name/Collection name. must me some way to get it from the model i.e.. Node itself #CHECK
    models.PublicCounter.getNextSequence(Node.modelName, function(seq){
      // need to add pub_id auto increment counter sync with auto increment counter collection
      
      if (!seq){
        console.log("Got No Sequence Number from counter collection for: ", Node.modelName);
        // throw error;
        callback(new Error("Serial number for Pubic id not initialized."), null);
      }
      nodeObj._id = seq;
      var node = new Node(nodeObj);
      
      node.save(function(err, saved_node) {
        callback(err, saved_node);
      });  
    });
  }

  var editNode = function(nodePubId, nodeObj, callback) {
    if (VIN_DEBUG) console.log("in editNode function for:", Node.modelName, nodePubId);

    Node.findOne({pub_id: nodePubId}, function(err, node_doc){
      if (err || !node_doc){
        callback(err, null);
        return;
      }

      keys = Object.keys(nodeObj);
      for (var i = 0; i < keys.length; ++i) {
        key = keys[i];
        node_doc[key] = nodeObj[key];
      }

      node_doc.meta_info.edits += 1;

      node_doc.save(function(err, saved_node) {
        callback(err, saved_node);
      });

    })
  }

  // Getting nodes by their value or upvotes [Start]

  var getNodesByValue = function(callback) {
    Node.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getNodesByValueLimitCount = function(limit, callback) {
    Node.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getNodesByValueSkipLimit = function(skip, limit, callback) {
    Node.find().sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).skip(skip).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getNodesByValueQuery = function(lastValue, callback) {
    Node.find({
      'meta_info.value': {$lt: lastValue},
      // 'meta_info.upvotes': {$lt: lastValue},
    }).sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getNodesByValueQueryLimit = function(objId, limit, callback) {
    Node.find({
      'meta_info.value': {$lt: lastValue},
      // 'meta_info.upvotes': {$lt: lastValue},
    }).sort({
      'meta_info.value': -1,
      // 'meta_info.upvotes': -1,
    }).limit(limit).exec(function(err, docs){
      callback(err, docs);
    })
  }

  var getRandomNodes = function(num, callback) {
    if (!num){
      callback(null, null)
      return;
    }

    models.PublicCounter.getCurrSequence(Node.modelName, function(err, doc){
      if (err || !doc) {
        callback(err, doc)
        return;
      }
      var randomLimit = doc.seq;
      var randomArr = [];
      var query;

      if (randomLimit > num * 2) {
        while(randomArr.length < num){
          var r = Math.floor((Math.random() * randomLimit));
          if (randomArr.indexOf(r) == -1){
            randomArr.push(r);
          }
        }
        query = Node.find({ _id: {$in : randomArr} }, {name: 1, url_name: 1}).limit(num);
      } else {
        query = Node.find({}, {name: 1, url_name: 1}).limit(num);
      }
      query.exec(callback);  
    })    
    
  }

  // Getting nodes by their value or upvotes [End]

  var _nodeUpvalue = function(found_node, val, callback) {
    found_node.meta_info.value += val
    // found_node.meta_info.value += 1
    found_node.save(function(err, saved_node){
      callback(err, saved_node);
    })
  }

  var updateValue = function(nodePubId, val, callback) {
    Node.findOne({pub_id: nodePubId}, function(err, found_node){
      if (!found_node.meta_info){
        found_node.save(function(){
          // _nodeUpvote(found_node, callback);
          found_node.meta_info.value = val
          // found_node.meta_info.value += 1
          found_node.save(function(err, saved_node){
            callback(err, saved_node);
          })
        });
      } else {
        _nodeUpvalue(found_node, val, callback);
      }
    })
  }

  var getByShopexCountSkipLimit = function(skip, limit, callback) {
    console.log("inside getByShopexCountSkipLimit for:", Node.modelName);
    Node.find().sort({
      'meta_info.shopex_count': -1,
      // 'meta_info.upvotes': -1,
    }).skip(skip).limit(limit).exec(function(err, nodes){
      callback(err, nodes);
    })
  }

  // var getSellersByShopexCount = function(callback) {
  //   Seller.find().sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }

  // var getSellersByShopexCountLimitCount = function(limit, callback) {
  //   Seller.find().sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).limit(limit).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }

  // var getSellersByShopexCountQuery = function(lastValue, callback) {
  //   Seller.find({
  //     'meta_info.shopex_count': {$lt: lastValue},
  //     // 'meta_info.upvotes': {$lt: lastValue},
  //   }).sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }

  // var getSellersByShopexCountQueryLimit = function(lastValue, limit, callback) {
  //   Seller.find({
  //     'meta_info.shopex_count': {$lt: lastValue},
  //     // 'meta_info.upvotes': {$lt: lastValue},
  //   }).sort({
  //     'meta_info.shopex_count': -1,
  //     // 'meta_info.upvotes': -1,
  //   }).limit(limit).exec(function(err, docs){
  //     callback(err, docs);
  //   })
  // }

  var getIdByQuery = function(query, callback) {
    console.log("inside getIdByQuery for:", Node.modelName);
    Node.findOne(query, function(err, node){
      callback(err, node._id);
      // callback(err, node.pub_id);
    });
  }

  return {
    findById: findById,
    // findByIdPopulated: findByIdPopulated,

    findByPubId: findByPubId,
    findByRegex: findByRegex,
    findByRegex1: findByRegex1,
    // findByPubIdPopulated: findByPubIdPopulated,

    getNameById: getNameById,
    getNamesByIds: getNamesByIds,
    
    createNode: createNode,
    editNode: editNode,

    getNodesByValue: getNodesByValue,
    getNodesByValueLimitCount: getNodesByValueLimitCount,
    getNodesByValueSkipLimit: getNodesByValueSkipLimit,
    getNodesByValueQuery: getNodesByValueQuery,
    getNodesByValueQueryLimit: getNodesByValueQueryLimit,

    getRandomNodes: getRandomNodes,

    getByShopexCountSkipLimit: getByShopexCountSkipLimit,

    getIdByQuery: getIdByQuery,

    updateValue: updateValue,

    getAuthorId: getAuthorId,
    // register: register,
    // forgotPassword: forgotPassword,
    // changePassword: changePassword,
    // login: login,
    Model: Node,
  }
}
