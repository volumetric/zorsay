module.exports = function(app){

    app.get('/share_post', function(req, res){
        console.log("inside /share_post");

        // if(!req.session.loggedIn){
        //     res.send(401);
        //     return;
        // }

        // var object_name = req.query.s3_object_name;
        // var mime_type = req.query.s3_object_type;
        // var opts = req.query.opts;

        // res.render('zs_share_post_modal');
        res.sendfile('views/zs_share_post_modal.ejs');
        // res.send('views/zs_share_post_modal.ejs');
    });
} // end module.exports