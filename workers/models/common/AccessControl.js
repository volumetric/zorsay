module.exports = function(config) {

  var crypto = require('crypto');

  // #TODO put these values in db and get it from it at system start, and update them in both db and here when its changed, so to avoid system restart to see its effect
  var root_account = 1;
  var admin_accounts = [1, 3];
  var mod_accounts = [1, 3];
  var staff_accounts = [1, 3];
  
  // #TODO de-duplicate account ids in a group
  var post_edit_group = admin_accounts.concat(mod_accounts);
  post_edit_group.push(root_account);

  var post_admin_group = admin_accounts
  post_admin_group.push(root_account);

  var agent_edit_group = admin_accounts;
  agent_edit_group.push(root_account);

  var agent_admin_group = admin_accounts
  agent_admin_group.push(root_account);

  var node_edit_group = admin_accounts.concat(mod_accounts);
  node_edit_group.push(root_account); 

  var node_admin_group = admin_accounts;
  node_edit_group.push(root_account); 


  var getId = function(obj_info) {
    var obj_id;

    if (obj_info){
      if(typeof(obj_info) == 'object')
        obj_id = obj_info._id;
      else
        obj_id = obj_info;
    }
    return obj_id;
  }

  var isAdmin = function(user_info) {
    var user_id = getId(user_info);

    if (admin_accounts.indexOf(user_id) != -1){
      return true;
    }
  }

  var isMod = function(user_info) {
    var user_id = getId(user_info);
    
    if (mod_accounts.indexOf(user_id) != -1){
      return true;
    }
  }

  var isStaff = function(user_info) {
    var user_id = getId(user_info);
    
    if (staff_accounts.indexOf(user_id) != -1){
      return true;
    }
  }


  var postEditPermission = function(post_data, user_info) {
    
    var user_id;
    var author_id;

    if (user_info){
      if(typeof(user_info) == 'object')
        user_id = user_info._id;
      else
        user_id = user_info;
    }
    if (post_data && post_data._author){
      if(typeof(post_data._author) == 'object')
        author_id = post_data._author._id;
      else
        author_id = post_data._author;
    }


    if (post_edit_group.indexOf(user_id) != -1){
      return true;
    }

    if (user_id && user_id == author_id) {
      return true; 
    }

    return false;
  }

  var postAdminPermission = function(post_data, user_info) {
    
    var user_id;
    var author_id;

    if (user_info){
      if(typeof(user_info) == 'object')
        user_id = user_info._id;
      else
        user_id = user_info;
    }
    if (post_data && post_data._author){
      if(typeof(post_data._author) == 'object')
        author_id = post_data._author._id;
      else
        author_id = post_data._author;
    }

    // Allow Admins
    if (post_admin_group.indexOf(user_id) != -1){
      return true;
    }

    // if the post is a question and has some answers or some comments posted on it, then access is not allowed for users other than admins
    if (post_data._related_questions && ((post_data._answers.length > 0) || (post_data._comments.length > 0))) {
      return false;
    }

    // if the post is a shopex and has some comments posted on it. then access is not allowed for users other than admins
    if (post_data._related_shopexes && post_data._comments.length > 0) {
      return false;
    }

    // Allow Author of the Post, when the conditions are ok
    if (user_id && user_id == author_id) {
      return true; 
    }

    return false;
  }

  var agentEditPermission = function(user_info, agent_data, password) {
    
    var user_id;
    var agent_password;
    var given_password;

    if (user_info){
      if(typeof(user_info) == 'object')
        user_id = user_info._id;
      else
        user_id = user_info;
    }

    if (agent_edit_group.indexOf(user_id) != -1){
      return true;
    }


    if (password != null){
      var shaSum = crypto.createHash('sha256');
      shaSum.update(password);
      given_password = shaSum.digest('hex');

      if (agent_data && agent_data.password){
        agent_password = agent_data.password;
      }

      if (user_id && agent_password == given_password) {
        return true;
      }
    } else if (agent_data){
      if(typeof(agent_data) == 'object')
        agent_id = agent_data._id;
      else
        agent_id = agent_data;

      if (user_id && user_id == agent_id) {
        return true; 
      }
    }
  }

  var agentAdminPermission = function(user_info) {
    
    var user_id;

    if (user_info){
      if(typeof(user_info) == 'object')
        user_id = user_info._id;
      else
        user_id = user_info;
    }

    if (agent_admin_group.indexOf(user_id) != -1){
      return true;
    }

    return false;
  }

  return {
    postEditPermission: postEditPermission,
    postAdminPermission: postAdminPermission,
    agentEditPermission: agentEditPermission,
    agentAdminPermission: agentAdminPermission,

    isAdmin: isAdmin,
    isMod: isMod,
    isStaff: isStaff,
  }
}
