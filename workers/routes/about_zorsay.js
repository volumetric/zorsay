module.exports = function(app){

  app.get('/about-zorsay', function(req, res){
    console.log("inside /about-zorsay")

    console.log(req);

    about_zorsay_page_data = {};
    about_zorsay_page_data.navbar_data = {};
    if (req.session.loggedIn){
      about_zorsay_page_data.navbar_data = { user_info: req.session.user_info };
    }

    res.render("zs_about_zorsay_page", {
        about_zorsay_page_data: about_zorsay_page_data
    });
    
  });

} // end module.exports