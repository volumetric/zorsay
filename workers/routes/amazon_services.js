module.exports = function(app){

    var crypto      = require('crypto');

    /*
     * Load the S3 information from the environment variables.
     */
    var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
    var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    var S3_BUCKET = process.env.S3_BUCKET

    var random_name_gen = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });    
    }

    var random_url_hash = function(name) {
        var h = random_name_gen() + "-" + name +"-" + Date.now();
        return crypto.createHash('md5').update(h).digest("hex");
    }
    
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
        var mime_type = req.query.s3_object_type;
        if (mime_type.split("/")[0] != "image"){
            res.status(412).render("zs_412_file_invalid.ejs");
            return;
        }
        var file_ext = mime_type.split("/")[1];
        var opts = req.query.opts;
        var opts_obj;
        try{
            opts_obj = JSON.parse(opts);
        } catch(e) {
            console.log("bad file_opts")
            console.log(opts);
        }
        var path = "";
        var info = accountId +"-"
        var type = ""
        if (opts_obj) {
            var optsp = opts_obj["id"].split("_");
            var element = optsp[0] ? optsp[0].toLowerCase() : "";
            var element_id = optsp[1] ? optsp[1] : 0;

            var allowed = ["account", "seller", "productcat", "servicecat", "shopex", "question", "answer", "comment"]
            if (allowed.indexOf(element) != -1){
                path += element + "/";
                info += (allowed.indexOf(element)+1) + "-";
            } else {
                info += "0-";
            }

            var image_type = opts_obj["type"];
            if(["orig", "thumb", "icon", "cover"].indexOf(image_type) != -1){
                type += image_type + "-";
            } else {
                type += "orig-";
            }

            info += element_id +"-";
        } else {
            info += "0-0-";
            type += "orig-";
        }
        // var object_name = req.query.s3_object_name;
        var object_name = path+"zsimg-"+type+info+random_url_hash(req.query.s3_object_name)+"."+file_ext;

        // #TODO use this opts to create url structure for image access location to avoif name collision and to keep it organized in amazon s3 buckets.
        console.log("======HERE IS ENTITY INFO=======");
        console.log(accountId);
        console.log(object_name);
        console.log(mime_type);
        console.log(opts);
        console.log("======HERE IS ENTITY INFO=======");

        var now = new Date();
        var expires = Math.ceil((now.getTime() + 60000)/1000); // 60 seconds from now
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
        // signature = signature.replace('%2B','+');
        // signature = signature.replace('+', '%2B');

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