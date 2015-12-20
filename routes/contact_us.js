module.exports = function(app){

  app.post('/contact-us', function(req, res){
    console.log("inside /contact-us")

    message = {}
    message.name = req.param.name;
    message.email = req.param.email;
    message.subject = req.param.subject;
    message.content_text = req.param.content_text;

    // about_zorsay_page_data = {}
    // if (req.session.loggedIn){
    //   about_zorsay_page_data.navbar_data = { user_info: req.session.user_info };
    // }

    // res.render("zs_about_zorsay_page", {
    //     about_zorsay_page_data: about_zorsay_page_data
    // });

    if(req.session.loggedIn){
      var user = req.session.user_info;
    }
    
    res.send(200)

  });

} // end module.exports