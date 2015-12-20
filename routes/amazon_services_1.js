module.exports = function(app){

    var crypto      = require('crypto');

    /*
     * Load the S3 information from the environment variables.
     */
    var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
    var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    var S3_BUCKET = process.env.S3_BUCKET


    /*
     * Respond to GET requests to /sign_s3.
     * Upon request, return JSON containing the temporarily-signed S3 request and the
     * anticipated URL of the image.
     */
    app.get('/sign_s3', function(req, res){
        console.log("inside /sign_s3");

        if(!req.session.loggedIn){
            res.status(401).render("zs_401_not_logged.ejs");
            return;
        }

        var accountId = req.session.accountId;
        var object_name = req.query.s3_object_name;
        var mime_type = req.query.s3_object_type;
        var opts = req.query.opts;

        // #TODO use this opts to create url structure for image access location to avoif name collision and to keep it organized in amazon s3 buckets.
        console.log("======HERE IS ENTITY INFO=======");
        console.log(opts);
        console.log("======HERE IS ENTITY INFO=======");

        var now = new Date();
        var expires = Math.ceil((now.getTime() + 30000)/1000); // 30 seconds from now
        var amz_headers = "x-amz-acl:public-read";  

        // var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+"user/12/profile/"+object_name;
        // #NOTE need to make change here if upload url is to be changed
        var put_request = "PUT\n\n"+mime_type+"\n"+expires+"\n"+amz_headers+"\n/"+S3_BUCKET+"/"+object_name;

        // console.log("put_request:","======>"+put_request+"<=======");
        // console.log("AWS_SECRET_KEY:","======>"+AWS_SECRET_KEY+"<======");
        // console.log("AWS_ACCESS_KEY:","======>"+AWS_ACCESS_KEY+"<=======");

        var signature = crypto.createHmac('sha1', AWS_SECRET_KEY).update(put_request).digest('base64');
      
        // console.log("signature:","=======>"+signature+"<========");
       
        signature = encodeURIComponent(signature.trim());
        signature = signature.replace('%2B','+');

        // var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+'user/12/profile/'+object_name;
        // #NOTE need to make change here if upload url is to be changed, along with above #NOTE
        var url = 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+object_name;

        var credentials = {
            signed_request: url+"?AWSAccessKeyId="+AWS_ACCESS_KEY+"&Expires="+expires+"&Signature="+signature,
            url: url
        };
        res.write(JSON.stringify(credentials));
        res.end();
    });
} // end module.exports